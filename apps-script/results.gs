/**
 * ДШР — приём результатов теста аттестации в Google Таблицу.
 *
 * Как развернуть — см. apps-script/README.md.
 *
 * Скрипт принимает POST с JSON-телом (Content-Type: text/plain),
 * а также резервную отправку формой с полем payload.
 */

var SHEET_NAME = 'Результаты';

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

function doGet() {
  return json({ ok: true, service: 'dshr-test-results' });
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
    var id = String((data && data.id) || '');
    if (!/^[a-zA-Z0-9-]{6,80}$/.test(id)) {
      return json({ ok: false, error: 'empty or invalid payload id' });
    }

    var ss = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (!ss) {
      return json({ ok: false, error: 'spreadsheet not found' });
    }

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
    }

    /* Дедупликация: повторная отправка того же результата не создаёт новую строку. */
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === id) {
          return json({ ok: true, duplicate: true });
        }
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
      safeCell(data.nickname),
      safeCell(data.staticId),
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

    return json({ ok: true, id: id });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

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
