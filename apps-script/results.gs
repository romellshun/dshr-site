/**
 * ДШР — приём результатов теста аттестации в Google Таблицу.
 *
 * Как развернуть — см. apps-script/README.md.
 *
 * Одна попытка на кандидата: повторное прохождение возможно только после
 * разрешения командира. Разрешения выдаются через меню «ДШР» в Google Таблице
 * и хранятся на листе «Разрешения».
 *
 * Скрипт принимает POST с JSON-телом (Content-Type: text/plain),
 * а также резервную отправку формой с полем payload.
 */

var SHEET_NAME = 'Результаты';
var PERMISSIONS_SHEET = 'Разрешения';

/* Если скрипт создан не внутри таблицы, укажите ID таблицы.
   Пример: '1AbCdEfGhIjKlMnOpQrStUvWxYz'. Если пусто — берётся активная таблица. */
var SPREADSHEET_ID = '';

var HEADERS = [
  'ID результата',
  'Дата отправки',
  'Никнейм',
  'Статик-ID',
  'Подразделение',
  'Баллы',
  'Всего',
  'Процент',
  'Статус',
  'Время, сек',
  'Автозавершение',
  'Начало',
  'Завершение',
  'СВУ',
  'Первая помощь',
  'Переговоры',
  'Штурм',
  'Запреты главы 4',
  'Ошибки (JSON)',
  'Все ответы (JSON)'
];

var PERM_HEADERS = [
  'Статик-ID',
  'Никнейм',
  'Статус',
  'Выдано',
  'Комментарий',
  'ID результата',
  'Дата использования'
];

var STATUS_ALLOWED = 'Разрешено';
var STATUS_USED = 'Использовано';
var STATUS_REVOKED = 'Отозвано';

/* ---------------- HTTP ---------------- */

function doGet(e) {
  var action = e && e.parameter ? String(e.parameter.action || '') : '';
  if (action === 'check') {
    try {
      return checkAttempt_(e.parameter);
    } catch (err) {
      return json({ ok: false, error: String(err) });
    }
  }
  return json({ ok: true, service: 'dshr-test-results', version: 2 });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }

  try {
    var data = parsePayload(e);
    if (!data) {
      return json({ ok: false, error: 'empty payload' });
    }

    /* Проверка перед стартом теста может идти тем же POST-каналом. */
    if (String(data.action || '') === 'check') {
      return checkAttempt_(data);
    }

    var id = String(data.id || '');
    if (!/^[a-zA-Z0-9-]{6,80}$/.test(id)) {
      return json({ ok: false, error: 'empty or invalid payload id' });
    }

    var nickname = String(data.nickname || '').trim();
    var staticId = String(data.staticId || '').trim();
    if (!nickname || !staticId) {
      return json({ ok: false, error: 'empty candidate' });
    }

    var ss = getSpreadsheet_();
    if (!ss) {
      return json({ ok: false, error: 'spreadsheet not found' });
    }

    var sheet = ensureResultsSheet_(ss);

    /* Дедупликация: повторная отправка того же результата не создаёт новую строку. */
    if (resultExists_(sheet, id)) {
      return json({ ok: true, duplicate: true });
    }

    var permSheet = ensurePermissionsSheet_(ss);

    /* Одна попытка: без действующего разрешения повторный результат не принимается. */
    var attempts = findAttempts_(sheet, staticId, nickname);
    var allowedByPermission = false;
    if (attempts.length) {
      allowedByPermission = findActivePermissionRow_(permSheet, staticId, nickname) > 0;
      if (!allowedByPermission) {
        return json({
          ok: false,
          error: 'already_attempted',
          message: 'Тест уже пройден. Повторная попытка возможна только с разрешения командира.',
          previous: attempts[attempts.length - 1]
        });
      }
    }

    var t = data.topics || {};
    var svu = t.svu || {};
    var firstAid = t.firstAid || {};
    var negotiations = t.negotiations || {};
    var assault = t.assault || {};
    var prohibitions = t.prohibitions || {};

    var wrong = (data.answers || []).filter(function (a) {
      return !a.isCorrect;
    }).map(function (a) {
      return {
        id: a.id,
        question: a.question,
        chosen: a.chosen,
        correct: a.correct
      };
    });

    sheet.appendRow([
      id,
      new Date(),
      safeCell(nickname),
      safeCell(staticId),
      safeCell(data.unit),
      Number(data.score) || 0,
      Number(data.total) || 0,
      Number(data.percent) || 0,
      data.passed ? 'СДАНО' : 'НЕ СДАНО',
      Number(data.durationSec) || 0,
      data.autoSubmitted ? 'да' : 'нет',
      data.startedAt || '',
      data.finishedAt || '',
      topicScore(svu),
      topicScore(firstAid),
      topicScore(negotiations),
      topicScore(assault),
      topicScore(prohibitions),
      JSON.stringify(wrong),
      JSON.stringify(data.answers || [])
    ]);

    /* Разрешение расходуется только после успешной записи результата. */
    if (allowedByPermission) {
      consumePermissions_(permSheet, staticId, nickname, id);
    }

    return json({ ok: true, id: id, repeat: !!allowedByPermission });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- Проверка попытки ---------------- */

function checkAttempt_(params) {
  var staticId = String((params && params.staticId) || '').trim();
  var nickname = String((params && params.nickname) || '').trim();

  if (!staticId || !nickname) {
    return json({
      ok: false,
      error: 'empty candidate',
      message: 'Укажите статик-ID и никнейм.'
    });
  }

  var ss = getSpreadsheet_();
  if (!ss) {
    return json({ ok: false, error: 'spreadsheet not found' });
  }

  var results = ss.getSheetByName(SHEET_NAME);
  var attempts = findAttempts_(results, staticId, nickname);

  if (!attempts.length) {
    return json({ ok: true, allowed: true, reason: 'first', attempts: 0 });
  }

  var previous = attempts[attempts.length - 1];
  var permSheet = ss.getSheetByName(PERMISSIONS_SHEET);
  if (findActivePermissionRow_(permSheet, staticId, nickname) > 0) {
    return json({
      ok: true,
      allowed: true,
      reason: 'permission',
      attempts: attempts.length,
      previous: previous
    });
  }

  return json({
    ok: true,
    allowed: false,
    reason: 'already_attempted',
    attempts: attempts.length,
    previous: previous,
    message: 'Тест уже пройден. Повторная попытка возможна только с разрешения командира.'
  });
}

/* ---------------- Листы ---------------- */

function getSpreadsheet_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function ensureResultsSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1c2c26')
      .setFontColor('#f0b429');
    sheet.setColumnWidth(1, 220);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 110);
  }

  return sheet;
}

function ensurePermissionsSheet_(ss) {
  var sheet = ss.getSheetByName(PERMISSIONS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(PERMISSIONS_SHEET);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, PERM_HEADERS.length).setValues([PERM_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, PERM_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1c2c26')
      .setFontColor('#f0b429');
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 260);
    sheet.setColumnWidth(6, 220);
    sheet.setColumnWidth(7, 160);
  }

  return sheet;
}

/* ---------------- Поиск по кандидату ---------------- */

function normText_(value) {
  return String(value === null || typeof value === 'undefined' ? '' : value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function sameCandidate_(rowStatic, rowNick, staticId, nickname) {
  return normText_(rowStatic) === normText_(staticId) &&
    normText_(rowNick) === normText_(nickname);
}

function resultExists_(sheet, id) {
  if (!sheet || sheet.getLastRow() < 2) return false;
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return true;
  }
  return false;
}

function findAttempts_(sheet, staticId, nickname) {
  var out = [];
  if (!sheet || sheet.getLastRow() < 2) return out;

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  for (var i = 0; i < values.length; i++) {
    if (sameCandidate_(values[i][3], values[i][2], staticId, nickname)) {
      var sentAt = values[i][1];
      out.push({
        row: i + 2,
        date: sentAt instanceof Date ? sentAt.toISOString() : String(sentAt || ''),
        nickname: String(values[i][2] || ''),
        staticId: String(values[i][3] || ''),
        score: Number(values[i][5]) || 0,
        total: Number(values[i][6]) || 0,
        passed: String(values[i][8] || '').trim() === 'СДАНО'
      });
    }
  }
  return out;
}

function findActivePermissionRow_(sheet, staticId, nickname) {
  if (!sheet || sheet.getLastRow() < 2) return 0;

  var found = 0;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  for (var i = 0; i < values.length; i++) {
    if (sameCandidate_(values[i][0], values[i][1], staticId, nickname) &&
        String(values[i][2] || '').trim() === STATUS_ALLOWED) {
      found = i + 2;
    }
  }
  return found;
}

function consumePermissions_(sheet, staticId, nickname, resultId) {
  if (!sheet || sheet.getLastRow() < 2) return false;

  var used = false;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  for (var i = 0; i < values.length; i++) {
    if (sameCandidate_(values[i][0], values[i][1], staticId, nickname) &&
        String(values[i][2] || '').trim() === STATUS_ALLOWED) {
      sheet.getRange(i + 2, 3).setValue(STATUS_USED);
      sheet.getRange(i + 2, 6).setValue(resultId);
      sheet.getRange(i + 2, 7).setValue(new Date());
      used = true;
    }
  }
  return used;
}

/* ---------------- Меню командира ---------------- */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ДШР')
    .addItem('Разрешить повтор (выбранная строка)', 'menuAllowSelected')
    .addItem('Разрешить повтор (ввести вручную)…', 'menuAllowManual')
    .addItem('Отозвать разрешение (выбранная строка)', 'menuRevokeSelected')
    .addSeparator()
    .addItem('Открыть лист «Разрешения»', 'menuOpenPermissions')
    .addToUi();
}

function menuAllowSelected() {
  var ss = getSpreadsheet_();
  var sheet = ss.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var row = sheet.getActiveCell().getRow();

  if (row < 2 || (sheet.getName() !== SHEET_NAME && sheet.getName() !== PERMISSIONS_SHEET)) {
    ui.alert('Выберите строку кандидата на листе «Результаты» или «Разрешения».');
    return;
  }

  var candidate = candidateFromRow_(sheet, row);
  if (!candidate.nickname || !candidate.staticId) {
    ui.alert('В выбранной строке нет никнейма или статик-ID.');
    return;
  }

  var created = grantPermission_(ss, candidate.staticId, candidate.nickname, 'Выдано через меню');
  ui.alert(
    (created ? 'Повтор разрешён.' : 'Повтор уже был разрешён — срок обновлён.') +
    '\n\nКандидат: ' + candidate.nickname +
    '\nСтатик-ID: ' + candidate.staticId +
    '\n\nКандидат сможет пройти тест ещё один раз.'
  );
}

function menuAllowManual() {
  var ui = SpreadsheetApp.getUi();
  var ss = getSpreadsheet_();

  var staticAnswer = ui.prompt('Разрешить повтор', 'Введите статик-ID кандидата:', ui.ButtonSet.OK_CANCEL);
  if (staticAnswer.getSelectedButton() !== ui.Button.OK) return;

  var nickAnswer = ui.prompt('Разрешить повтор', 'Введите никнейм кандидата:', ui.ButtonSet.OK_CANCEL);
  if (nickAnswer.getSelectedButton() !== ui.Button.OK) return;

  var staticId = staticAnswer.getResponseText().trim();
  var nickname = nickAnswer.getResponseText().trim();
  if (!staticId || !nickname) {
    ui.alert('Нужно указать и статик-ID, и никнейм.');
    return;
  }

  var created = grantPermission_(ss, staticId, nickname, 'Выдано через меню');
  ui.alert(
    (created ? 'Повтор разрешён.' : 'Повтор уже был разрешён — срок обновлён.') +
    '\n\nКандидат: ' + nickname +
    '\nСтатик-ID: ' + staticId
  );
}

function menuRevokeSelected() {
  var ss = getSpreadsheet_();
  var sheet = ss.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var row = sheet.getActiveCell().getRow();

  if (row < 2 || (sheet.getName() !== SHEET_NAME && sheet.getName() !== PERMISSIONS_SHEET)) {
    ui.alert('Выберите строку кандидата на листе «Результаты» или «Разрешения».');
    return;
  }

  var candidate = candidateFromRow_(sheet, row);
  if (!candidate.nickname || !candidate.staticId) {
    ui.alert('В выбранной строке нет никнейма или статик-ID.');
    return;
  }

  var changed = revokePermission_(ss, candidate.staticId, candidate.nickname);
  ui.alert(changed
    ? 'Разрешение отозвано.\n\nКандидат: ' + candidate.nickname + '\nСтатик-ID: ' + candidate.staticId
    : 'Действующего разрешения для этого кандидата нет.');
}

function menuOpenPermissions() {
  var ss = getSpreadsheet_();
  var sheet = ensurePermissionsSheet_(ss);
  ss.setActiveSheet(sheet);
}

function candidateFromRow_(sheet, row) {
  if (sheet.getName() === SHEET_NAME) {
    var values = sheet.getRange(row, 1, 1, 4).getValues()[0];
    return { nickname: String(values[2] || ''), staticId: String(values[3] || '') };
  }
  var perm = sheet.getRange(row, 1, 1, 2).getValues()[0];
  return { nickname: String(perm[1] || ''), staticId: String(perm[0] || '') };
}

function grantPermission_(ss, staticId, nickname, comment) {
  var sheet = ensurePermissionsSheet_(ss);
  var now = new Date();

  if (sheet.getLastRow() > 1) {
    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();

    /* Уже есть действующее разрешение — просто обновляем дату выдачи. */
    for (var i = 0; i < values.length; i++) {
      if (sameCandidate_(values[i][0], values[i][1], staticId, nickname) &&
          String(values[i][2] || '').trim() === STATUS_ALLOWED) {
        sheet.getRange(i + 2, 4).setValue(now);
        return false;
      }
    }

    /* Переиспользуем старую строку кандидата, чтобы не плодить записи. */
    for (var j = 0; j < values.length; j++) {
      if (sameCandidate_(values[j][0], values[j][1], staticId, nickname)) {
        sheet.getRange(j + 2, 1, 1, PERM_HEADERS.length).setValues([[
          safeCell(staticId),
          safeCell(nickname),
          STATUS_ALLOWED,
          now,
          comment,
          '',
          ''
        ]]);
        return true;
      }
    }
  }

  sheet.appendRow([
    safeCell(staticId),
    safeCell(nickname),
    STATUS_ALLOWED,
    now,
    comment,
    '',
    ''
  ]);
  return true;
}

function revokePermission_(ss, staticId, nickname) {
  var sheet = ss.getSheetByName(PERMISSIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return false;

  var changed = false;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  for (var i = 0; i < values.length; i++) {
    if (sameCandidate_(values[i][0], values[i][1], staticId, nickname) &&
        String(values[i][2] || '').trim() === STATUS_ALLOWED) {
      sheet.getRange(i + 2, 3).setValue(STATUS_REVOKED);
      changed = true;
    }
  }
  return changed;
}

/* ---------------- Вспомогательное ---------------- */

function topicScore(t) {
  if (!t || typeof t.correct === 'undefined') return '';
  return Number(t.correct) + ' / ' + Number(t.total);
}

/* Не даём значениям из формы превратиться в формулы Google Таблиц. */
function safeCell(value) {
  var s = String(value === null || typeof value === 'undefined' ? '' : value).slice(0, 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function parsePayload(e) {
  if (!e) return null;

  var raw = '';
  if (e.postData && e.postData.contents) {
    raw = e.postData.contents;
  }

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      /* Форма URL-encoded: payload=%7B...%7D */
      try {
        var m = raw.match(/(?:^|&)payload=([^&]*)/);
        if (m) return JSON.parse(decodeURIComponent(m[1].replace(/\+/g, ' ')));
      } catch (err2) { /* ниже попробуем e.parameter */ }
    }
  }

  if (e.parameter && e.parameter.payload) {
    try {
      return JSON.parse(e.parameter.payload);
    } catch (err3) { /* ignore */ }
  }

  return null;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
