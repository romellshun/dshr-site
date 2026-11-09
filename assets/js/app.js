/* ============================================================
   ДШР — логика сайта
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const TITLES = {
    home: 'Главная',
    attestation: 'Аттестация',
    svu: 'СВУ',
    'first-aid': 'Первая помощь',
    assault: 'Штурм',
    negotiations: 'Переговоры',
    signals: 'Специальные сигналы',
    robbery: 'Ограбления и выкуп',
    help: 'Помощь'
  };

  const pages = $$('.page');
  const routes = new Set(pages.map(p => p.dataset.route));

  /* ---------------- Тема ---------------- */
  const themeBtn = $('#themeBtn');
  const savedTheme = localStorage.getItem('icssnvp-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.setAttribute('data-theme', savedTheme || (prefersLight ? 'light' : 'dark'));

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('icssnvp-theme', next);
  });

  /* ---------------- Роутинг ---------------- */
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    return { route: parts[0] || 'home', id: parts.slice(1).join('/') || null };
  }

  function openAncestors(el) {
    if (el.tagName === 'DETAILS') el.open = true;
    for (let n = el.parentElement; n; n = n.parentElement) {
      if (n.tagName === 'DETAILS') n.open = true;
    }
  }

  function show(route, id, animate) {
    if (!routes.has(route)) route = 'home';
    pages.forEach(p => p.classList.toggle('active', p.dataset.route === route));

    $$('.sidebar nav a').forEach(a => {
      const on = a.dataset.nav === route;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    const activePage = pages.find(p => p.dataset.route === route);
    const h1 = activePage ? activePage.querySelector('h1') : null;
    const pageTitle = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
    document.title = (TITLES[route] || pageTitle || 'ДШР') + ' — ДШР';

    if (id) {
      const el = document.getElementById(id);
      if (el) {
        openAncestors(el);
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: animate ? 'smooth' : 'auto', block: 'start' });
          if (animate) {
            el.classList.remove('flash');
            void el.offsetWidth;
            el.classList.add('flash');
            setTimeout(() => el.classList.remove('flash'), 1900);
          }
        });
      } else {
        window.scrollTo({ top: 0 });
      }
    } else {
      window.scrollTo({ top: 0 });
    }

    closeSidebar();
    updateProgressBar();
  }

  window.addEventListener('hashchange', () => {
    const { route, id } = parseHash();
    show(route, id, true);
  });

  /* ---------------- Мобильное меню ---------------- */
  const sidebar = $('#sidebar');
  const menuBtn = $('#menuBtn');
  const overlay = $('#overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);
  $$('.sidebar a').forEach(a => a.addEventListener('click', closeSidebar));

  /* ---------------- Печать ---------------- */
  $('#printBtn').addEventListener('click', () => window.print());

  /* ---------------- Индекс поиска ---------------- */
  const index = [];
  let uid = 0;

  function buildIndex() {
    pages.forEach(page => {
      const route = page.dataset.route;
      const h1 = page.querySelector('h1');
      let h2 = h1 ? h1.textContent.trim() : TITLES[route];
      let h3 = '';

      page.querySelectorAll('h2, h3, h4, p, li').forEach(el => {
        if (el.closest('pre') || el.classList.contains('copy-btn')) return;
        if (el.closest('.code-grid')) return;

        const tag = el.tagName;
        let text = el.textContent.replace(/\s+/g, ' ').trim();
        if (!text || text.length < 3) return;

        if (tag === 'H2') { h2 = text; h3 = ''; return; }
        if (tag === 'H3') { if (!el.closest('details')) h3 = text; return; }
        if (tag === 'H4') return;

        if (!el.id) el.id = 'sr-' + (++uid);

        const acc = el.closest('details.acc');
        const summary = acc && acc.querySelector('summary');
        let section = h2;
        if (summary) section += ' · ' + summary.textContent.replace(/\s+/g, ' ').trim();
        else if (h3) section += ' · ' + h3;

        index.push({
          route,
          anchor: el.id,
          section,
          text,
          kind: tag
        });
      });
    });
  }

  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');
  let searchTimer = null;

  function esc(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function markTokens(text, tokens) {
    let out = esc(text);
    tokens.forEach(t => {
      const safe = esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  function runSearch(q) {
    const tokens = q.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (!tokens.length) { hideResults(); return; }

    const hits = [];
    for (const item of index) {
      const hay = item.text.toLowerCase();
      if (!tokens.every(t => hay.includes(t))) continue;
      let score = 0;
      for (const t of tokens) {
        if (item.text.toLowerCase().startsWith(t)) score += 6;
        if (item.kind === 'H2' || item.kind === 'H3') score += 4;
        score += (hay.split(t).length - 1);
      }
      hits.push({ item, score });
    }
    hits.sort((a, b) => b.score - a.score);

    if (!hits.length) {
      searchResults.innerHTML = '<div class="search-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
      searchResults.hidden = false;
      return;
    }

    searchResults.innerHTML = hits.slice(0, 14).map(({ item }) => {
      const snippet = item.text.length > 140 ? item.text.slice(0, 140) + '…' : item.text;
      return '<a class="search-result" href="#/' + item.route + '/' + item.anchor + '">' +
        '<span class="sr-top"><span>' + esc(item.section) + '</span><span>' + esc(TITLES[item.route] || '') + '</span></span>' +
        '<span class="sr-text">' + markTokens(snippet, tokens) + '</span>' +
        '</a>';
    }).join('');
    searchResults.hidden = false;
  }

  function hideResults() {
    searchResults.hidden = true;
    searchResults.innerHTML = '';
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const q = searchInput.value.trim();
    searchTimer = setTimeout(() => runSearch(q), 120);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) runSearch(searchInput.value.trim());
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search')) hideResults();
  });

  searchResults.addEventListener('click', e => {
    const link = e.target.closest('.search-result');
    if (!link) return;
    hideResults();
    searchInput.value = '';
    const target = link.getAttribute('href');
    if (location.hash === target) {
      const { route, id } = parseHash();
      show(route, id, true);
    }
  });

  /* ---------------- Клавиатура ---------------- */
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === 'Escape') {
      hideResults();
      closeSidebar();
      searchInput.blur();
    }
  });

  /* ---------------- Копирование отыгровок ---------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); }
      catch (err) { reject(err); }
      finally { ta.remove(); }
    });
  }

  $$('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'копировать';
    btn.addEventListener('click', () => {
      copyText(pre.innerText.replace(/\n+$/, '')).then(() => {
        btn.textContent = 'скопировано';
        btn.classList.add('done');
        toast('Отыгровка скопирована');
        setTimeout(() => { btn.textContent = 'копировать'; btn.classList.remove('done'); }, 1800);
      }).catch(() => toast('Не удалось скопировать'));
    });
    pre.appendChild(btn);
  });

  /* ---------------- Чек-листы ---------------- */
  const CHECK_KEY = 'icssnvp-checks';
  let checks = {};
  try { checks = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}'); } catch (e) { checks = {}; }

  const boxes = $$('input[type="checkbox"][data-key]');

  function refreshAttestation() {
    const total = boxes.length;
    const done = boxes.filter(b => b.checked).length;
    const label = $('#attestProgress');
    const bar = $('#attestBar');
    if (label) label.textContent = done + ' / ' + total;
    if (bar) bar.style.width = total ? (done / total * 100) + '%' : '0%';
  }

  boxes.forEach(box => {
    if (checks[box.dataset.key]) box.checked = true;
    box.addEventListener('change', () => {
      checks[box.dataset.key] = box.checked;
      localStorage.setItem(CHECK_KEY, JSON.stringify(checks));
      refreshAttestation();
    });
  });
  refreshAttestation();

  /* ---------------- Развернуть / свернуть ---------------- */
  $$('[data-details]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scope = document.querySelector('.page[data-route="' + btn.dataset.scope + '"]');
      if (!scope) return;
      const open = btn.dataset.details === 'open';
      $$('details.acc', scope).forEach(d => { d.open = open; });
      toast(open ? 'Все разделы развёрнуты' : 'Все разделы свёрнуты');
    });
  });

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }

  /* ---------------- Прогресс и кнопка «наверх» ---------------- */
  const progress = $('#progress');
  const toTop = $('#toTop');

  function updateProgressBar() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const y = window.scrollY || doc.scrollTop || 0;
    progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
    if (y > 600) toTop.hidden = false;
    else toTop.hidden = true;
  }

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Старт ---------------- */
  buildIndex();
  const initial = parseHash();
  show(initial.route, initial.id, false);
  updateProgressBar();
})();
