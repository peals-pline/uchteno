/* УЧТЕНО — ядро. Данные живут в localStorage, никакой сети. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Категории: свой набор иконок (stroke 1.8, «печатная» пунктирная деталь) ---------- */
  function I(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var CATS = [
    { id: 'coffee', name: 'кофе', svg: I('<path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 4.5c0-.8.8-.8.8-1.5M11.5 4.5c0-.8.8-.8.8-1.5" stroke-dasharray="1.5 2.5"/>') },
    { id: 'food', name: 'еда', svg: I('<circle cx="12" cy="13" r="7"/><path d="M12 10v3" stroke-dasharray="1.5 2.5"/><path d="M4.5 5.5C6 4 8 3.5 12 3.5s6 .5 7.5 2"/>') },
    { id: 'grocery', name: 'продукты', svg: I('<path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8h-9A2 2 0 0 1 5.5 18L4 7z"/><path d="M9 10v5M15 10v5" stroke-dasharray="1.5 2.5"/><path d="M9 7a3 3 0 0 1 6 0"/>') },
    { id: 'transport', name: 'транспорт', svg: I('<rect x="4" y="5" width="16" height="12" rx="3"/><path d="M4 12h16"/><circle cx="8" cy="19.5" r="1"/><circle cx="16" cy="19.5" r="1"/><path d="M8 8.5h8" stroke-dasharray="1.5 2.5"/>') },
    { id: 'home', name: 'дом', svg: I('<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5" stroke-dasharray="1.5 2.5"/>') },
    { id: 'phone', name: 'связь', svg: I('<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M11 17.5h2"/><path d="M10 6.5h4" stroke-dasharray="1.5 2.5"/>') },
    { id: 'fun', name: 'веселье', svg: I('<rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="15.5" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.8" cy="13.6" r=".9" fill="currentColor"/><path d="M9 4.5l1.2 2M15 4.5l-1.2 2" stroke-dasharray="1.5 2.5"/>') },
    { id: 'clothes', name: 'одежда', svg: I('<path d="M8 4l-5 4 2.5 3L8 9.5V20h8V9.5l2.5 1.5L21 8l-5-4a4 4 0 0 1-8 0z"/><path d="M10 16h4" stroke-dasharray="1.5 2.5"/>') },
    { id: 'health', name: 'здоровье', svg: I('<path d="M12 20s-7-4.6-7-10a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3c0 5.4-7 10-7 10z"/><path d="M9.5 10.5h2l1-2 1.5 4 1-2h1.5" stroke-dasharray="1.5 2.5"/>') },
    { id: 'gifts', name: 'подарки', svg: I('<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 13h16M12 9v11"/><path d="M12 9c-4 0-5-2-4-3.5C9 4 12 6 12 9zm0 0c4 0 5-2 4-3.5C15 4 12 6 12 9z"/>') },
    { id: 'subs', name: 'подписки', svg: I('<circle cx="12" cy="12" r="8"/><path d="M15.5 9.5a4 4 0 1 0 .5 4"/><path d="M16 8.5v2h-2" stroke-dasharray="1.5 2.5"/>') },
    { id: 'other', name: 'прочее', svg: I('<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="8.5" cy="12" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/><circle cx="15.5" cy="12" r=".9" fill="currentColor"/>') }
  ];
  /* запасные иконки для своих категорий */
  var SPARE = {
    book: I('<path d="M5 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5V4z"/><path d="M19 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6V4z"/><path d="M8 9h2M15 9h2" stroke-dasharray="1.5 2.5"/>'),
    sport: I('<circle cx="12" cy="12" r="8"/><path d="M12 4a12 12 0 0 1 0 16M4.5 9a12 12 0 0 1 15 0" stroke-dasharray="1.5 2.5"/>'),
    pet: I('<path d="M7 14c0-3 2-5 5-5s5 2 5 5-2 6-5 6-5-3-5-6z"/><circle cx="6" cy="8" r="1.8"/><circle cx="10" cy="5.5" r="1.8"/><circle cx="14" cy="5.5" r="1.8"/><circle cx="18" cy="8" r="1.8"/>'),
    car: I('<path d="M5 12l1.6-5A2 2 0 0 1 8.5 5.5h7A2 2 0 0 1 17.4 7L19 12"/><rect x="4" y="12" width="16" height="6" rx="2"/><circle cx="8" cy="18.5" r="1.4"/><circle cx="16" cy="18.5" r="1.4"/><path d="M8 15h2" stroke-dasharray="1.5 2.5"/>'),
    beauty: I('<path d="M9 3h6v6a3 3 0 0 1-6 0V3z"/><path d="M12 12v9M9 21h6"/><path d="M10.5 6h3" stroke-dasharray="1.5 2.5"/>'),
    kids: I('<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M10 7.5h4" stroke-dasharray="1.5 2.5"/>'),
    travel: I('<path d="M3 18l18-8-4 9-5-2-3 4-1-5-5 2z"/><path d="M12 13l6-4" stroke-dasharray="1.5 2.5"/>'),
    tech: I('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9h6" stroke-dasharray="1.5 2.5"/>')
  };
  function allCats() {
    return CATS.concat((state.custom || []).map(function (c) {
      return { id: c.id, name: c.name, svg: SPARE[c.icon] || SPARE.book };
    }));
  }
  function catOf(id) {
    var all = allCats();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return CATS[CATS.length - 1];
  }
  function activeCats() {
    var hid = state.hidden || [];
    return allCats().filter(function (c) { return hid.indexOf(c.id) === -1; });
  }

  /* ---------- Состояние ---------- */
  var KEY = 'uchteno-v1';
  // items: {a: сумма, c: катid, t: timestamp}; mended: ['2026-07-01'];
  // limit: дневной потолок ₽ (0 = выключен); hidden: [id]; custom: [{id,name,icon}]
  var state = { items: [], mended: [], limit: 0, hidden: [], custom: [] };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.items) {
      state = raw;
      state.limit = state.limit || 0;
      state.hidden = state.hidden || [];
      state.custom = state.custom || [];
    }
  } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  /* ---------- Витринный режим (?shot=&demo=&still=) для галереи кейса ---------- */
  var qp = new URLSearchParams(location.search);
  var SHOT = qp.get('shot');           // today | log | stats | cats | onb
  var IS_DEMO = qp.get('demo') === '1';
  var IS_STILL = qp.get('still') === '1';
  if (IS_DEMO) {
    // богатые данные в ПАМЯТИ: localStorage посетителя не читаем и не пишем
    save = function () {};
    var _now = Date.now(), _day = 864e5;
    var _items = [];
    var _plan = [
      ['coffee',190],['grocery',1240],['transport',72],
      ['food',560],['coffee',210],['subs',399],
      ['fun',1600],['grocery',830],['coffee',190],
      ['transport',72],['food',480],['clothes',2900],
      ['coffee',230],['grocery',960],['health',540],
      ['food',620],['coffee',190],['transport',144]
    ];
    for (var _d = 0; _d < 6; _d++) {
      for (var _k = 0; _k < 3; _k++) {
        var _p = _plan[_d * 3 + _k];
        _items.push({ a: _p[1], c: _p[0], t: _now - _d * _day - (_k * 2.6 + 1.2) * 3.6e6 });
      }
    }
    state = { items: _items, mended: [], limit: 2500, hidden: [], custom: [] };
  }
  if (IS_STILL) document.documentElement.classList.add('still');

  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // «сегодня» всегда живое: приложение может жить открытым через полночь
  function today() { return dayKey(Date.now()); }
  function fmt(n) { return n.toLocaleString('ru-RU'); }

  /* дни, в которые «касса закрыта честно»: есть запись или день заклеен */
  function dayLogged(key) {
    if (state.mended.indexOf(key) > -1) return true;
    return state.items.some(function (it) { return dayKey(it.t) === key; });
  }
  function streak() {
    var n = 0, d = new Date();
    if (!dayLogged(dayKey(d.getTime()))) d.setDate(d.getDate() - 1); // сегодня ещё не вечер
    while (dayLogged(dayKey(d.getTime()))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------- Навигация по экранам ---------- */
  var screens = document.querySelectorAll('.screen');
  function go(name) {
    screens.forEach(function (s) {
      var on = s.dataset.screen === name;
      s.classList.toggle('active', on);
      if (on && !reduced) { s.classList.remove('slide-in'); void s.offsetWidth; s.classList.add('slide-in'); }
    });
    if (name === 'stats' && window.UchtenoStats) window.UchtenoStats.render(state, allCats());
    if (name === 'cats') renderCatsManage();
    // «Лента» — корневой экран: из него системная стрелка закрывает мини-апп.
    // С остальных она возвращает туда, откуда пришли, а не наружу.
    if (name === 'today' || name === 'stats' || name === 'settings' || name === 'onb') TG.back(null);
    else if (name === 'cats') TG.back(function () { go('settings'); });
    else TG.back(function () { go('today'); });
  }
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { go(b.dataset.go); });
  });

  /* ---------- Лента дня ---------- */
  var headDate = document.getElementById('head-date');
  var todayTotal = document.getElementById('today-total');
  var tapeList = document.getElementById('tape-list');
  var tapeEmpty = document.getElementById('tape-empty');
  var streakChip = document.getElementById('streak-chip');
  var streakNum = document.getElementById('streak-num');

  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  function renderToday() {
    headDate.textContent = 'сегодня · ' + new Date().getDate() + ' ' + MONTHS[new Date().getMonth()];
    var tk = today();
    var items = state.items.filter(function (it) { return dayKey(it.t) === tk; })
      .sort(function (a, b) { return b.t - a.t; });
    tapeList.innerHTML = items.map(function (it) {
      var c = catOf(it.c);
      var tm = new Date(it.t);
      return '<li class="tape-item" data-t="' + it.t + '" role="button" tabindex="0" aria-label="' + c.name + ', ' + fmt(it.a) + ' рублей, изменить">' +
        '<span class="ico">' + c.svg + '</span>' +
        '<span class="nm"><b>' + c.name + '</b><span>' +
        String(tm.getHours()).padStart(2, '0') + ':' + String(tm.getMinutes()).padStart(2, '0') +
        '</span></span>' +
        '<span class="sum">−' + fmt(it.a) + ' ₽</span></li>';
    }).join('');
    tapeEmpty.style.display = items.length ? 'none' : '';
    var sum = items.reduce(function (s, it) { return s + it.a; }, 0);
    todayTotal.textContent = fmt(sum);
    var st = streak();
    streakNum.textContent = st;
    streakChip.classList.toggle('hot', st >= 3);
    streakChip.title = st === 0 ? 'запишите первую трату — начнётся серия' : 'дней подряд с записями: ' + st;
    streakChip.dataset.hint = streakChip.title;
    renderLimit(sum);
    renderCatchup();
  }

  /* ---------- Потолок дня ---------- */
  var limitLine = document.getElementById('limit-line');
  function renderLimit(todaySum) {
    var lv = document.getElementById('limit-val');
    if (lv) lv.textContent = state.limit ? fmt(state.limit) + ' ₽ в день' : 'не задан';
    if (!state.limit) { limitLine.hidden = true; return; }
    limitLine.hidden = false;
    var left = state.limit - todaySum;
    if (left >= 0) {
      limitLine.classList.remove('over');
      limitLine.textContent = 'до потолка ' + fmt(left) + ' ₽';
    } else {
      limitLine.classList.add('over');
      limitLine.textContent = 'потолок пробит на ' + fmt(-left) + ' ₽ — бывает';
    }
  }

  /* ---------- «Догнать день» (разрыв ленты) ---------- */
  var catchupSlot = document.getElementById('catchup-slot');
  function renderCatchup() {
    var y = new Date(); y.setDate(y.getDate() - 1);
    var yk = dayKey(y.getTime());
    if (dayLogged(yk)) {
      catchupSlot.innerHTML = state.mended.indexOf(yk) > -1
        ? '<div class="tape-mended"><span class="strip">вчера заклеено · примерная сумма учтена</span></div>'
        : '';
      return;
    }
    // вчера пусто, но если приложение только поставили (нет записей вовсе) — не давим
    if (!state.items.length && !state.mended.length) { catchupSlot.innerHTML = ''; return; }
    catchupSlot.innerHTML =
      '<div class="tape-tear" id="tear">' +
      '<p>вчера лента порвалась — ни одной записи</p>' +
      '<button class="mend" id="mend-btn">заклеить: примерно…</button>' +
      '<button class="mend zero" id="zero-btn">не тратил вовсе</button>' +
      '</div>';
    // window.prompt внутри Telegram не показывается — спрашиваем своей шторкой
    document.getElementById('mend-btn').addEventListener('click', function () {
      openSheet(
        '<div class="sheet-title">Заклеить вчера</div>' +
        '<div class="sheet-sub">сколько примерно ушло? неточно — нормально</div>' +
        '<input class="sheet-input" id="mend-input" type="text" inputmode="numeric" placeholder="например, 1 200">' +
        '<div class="sheet-hint">запишем одной строкой в «прочее»</div>' +
        '<button class="sheet-btn" id="mend-save">заклеить</button>'
      );
      var inp = document.getElementById('mend-input');
      document.getElementById('mend-save').addEventListener('click', function () {
        var n = parseInt(String(inp.value).replace(/\D/g, ''), 10);
        if (!n) { inp.focus(); return; }
        var yd = new Date(); yd.setDate(yd.getDate() - 1); yd.setHours(20, 0, 0, 0);
        state.items.push({ a: n, c: 'other', t: yd.getTime() });
        state.mended.push(yk);
        save();
        renderToday();
        closeSheet();
        stamp('ЗАКЛЕЕНО');
      });
    });
    // ноль трат — тоже честный день: только mended, без записи
    document.getElementById('zero-btn').addEventListener('click', function () {
      state.mended.push(yk);
      save();
      renderToday();
      stamp('ЧИСТО ✓');
    });
  }

  /* ---------- Быстрая запись ---------- */
  var amount = 0;
  var selCat = null;
  var amountView = document.getElementById('amount-view');
  var amountHint = document.getElementById('amount-hint');
  var catsEl = document.getElementById('cats');
  var commit = document.getElementById('commit');

  function topCats() {
    var freq = {};
    state.items.forEach(function (it) { freq[it.c] = (freq[it.c] || 0) + 1; });
    return activeCats().sort(function (a, b) { return (freq[b.id] || 0) - (freq[a.id] || 0); });
  }
  function renderCats() {
    var ordered = topCats();
    catsEl.innerHTML = ordered.map(function (c, i) {
      return '<button class="cat' + (i < 3 && state.items.length ? ' top' : '') + '" data-cat="' + c.id + '" aria-pressed="false">' +
        c.svg + '<span>' + c.name + '</span>' +
        (i < 3 && state.items.length ? '<span class="freq">частая</span>' : '') +
        '</button>';
    }).join('');
    catsEl.querySelectorAll('.cat').forEach(function (b) {
      b.addEventListener('click', function () {
        selCat = b.dataset.cat;
        catsEl.querySelectorAll('.cat').forEach(function (x) {
          x.classList.toggle('sel', x === b);
          x.setAttribute('aria-pressed', String(x === b));
        });
        updateCommit();
      });
    });
  }
  function renderAmount() {
    amountView.innerHTML = fmt(amount) + '<span class="rub"> ₽</span>';
    if (!reduced) { amountView.classList.remove('pop'); void amountView.offsetWidth; amountView.classList.add('pop'); }
    updateCommit();
  }
  function updateCommit() {
    commit.disabled = !(amount > 0 && selCat);
    amountHint.textContent = amount === 0 ? 'сколько потратили?' : (selCat ? 'жмите — и свободны' : 'теперь категорию');
  }
  document.getElementById('numpad').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var k = b.dataset.k;
    if (k === 'del') amount = Math.floor(amount / 10);
    else if (k === '00') amount = Math.min(amount * 100, 9999999);
    else amount = Math.min(amount * 10 + parseInt(k, 10), 9999999);
    TG.haptic('tap');
    renderAmount();
  });

  function openLog() {
    amount = 0; selCat = null;
    renderCats(); renderAmount();
    go('log');
  }
  document.getElementById('fab').addEventListener('click', openLog);
  // тап по стрику объясняет, что это (на таче title недоступен)
  streakChip.addEventListener('click', function () { appToast(streakChip.dataset.hint || ''); });
  document.getElementById('log-close').addEventListener('click', function () { go('today'); });

  // уникальный t: он же id записи (двойной тап и совпадение миллисекунд)
  function uniqueT() {
    var ts = Date.now();
    while (state.items.some(function (i) { return i.t === ts; })) ts++;
    return ts;
  }
  commit.addEventListener('click', function () {
    if (commit.disabled) return;
    commit.disabled = true; // защита от двойного тапа, пока летит штамп
    var prevStreak = streak();
    state.items.push({ a: amount, c: selCat, t: uniqueT() });
    save();
    TG.haptic('ok');
    stamp('УЧТЕНО ✓', function () {
      go('today');
      renderToday();
      if (streak() > prevStreak && !reduced) {
        streakChip.classList.add('bump');
        setTimeout(function () { streakChip.classList.remove('bump'); }, 500);
      }
    });
  });

  /* ---------- Штамп ---------- */
  var stampLayer = document.getElementById('stamp-layer');
  var stampEl = document.getElementById('stamp');
  function stamp(text, done) {
    stampEl.textContent = text;
    stampLayer.classList.add('show');
    setTimeout(function () {
      stampLayer.classList.remove('show');
      if (done) done();
    }, reduced ? 250 : 850);
  }

  /* ---------- Ещё: демо и сброс ---------- */
  document.getElementById('demo-fill').addEventListener('click', function () {
    var now = Date.now(), day = 864e5;
    var demo = [];
    for (var d = 0; d < 7; d++) {
      var n = d === 0 ? 3 : 2 + (d % 3);
      for (var i = 0; i < n; i++) {
        demo.push({
          a: [190, 340, 1250, 560, 90, 2300, 430][(d + i) % 7],
          c: ['coffee', 'grocery', 'transport', 'food', 'subs', 'clothes', 'fun'][(d * 2 + i) % 7],
          t: now - d * day - i * 3.7e6
        });
      }
    }
    state.items = demo; state.mended = [];
    save(); renderToday();
    stamp('ДЕМО ✓');
  });
  document.getElementById('wipe').addEventListener('click', function () {
    TG.confirm('Точно стереть всё? Отменить будет нельзя.', function (ok) {
      if (!ok) return;
      state = { items: [], mended: [], limit: 0, hidden: [], custom: [] };
      save(); renderToday();
      go('today');
      TG.haptic('warn');
    });
  });

  /* ---------- Шторка ---------- */
  var sheetLayer = document.getElementById('sheet-layer');
  var sheetEl = document.getElementById('sheet');
  var sheetBody = document.getElementById('sheet-body');
  var sheetPrevFocus = null;
  function openSheet(html) {
    sheetPrevFocus = document.activeElement;
    sheetBody.innerHTML = html;
    sheetLayer.hidden = false;
    var t = sheetBody.querySelector('.sheet-title');
    if (t) { t.id = 'sheet-title'; sheetEl.setAttribute('aria-labelledby', 'sheet-title'); }
    var f = sheetBody.querySelector('input, button');
    if (f) f.focus();
  }
  function closeSheet() {
    sheetLayer.hidden = true;
    sheetBody.innerHTML = '';
    if (sheetPrevFocus && sheetPrevFocus.focus) sheetPrevFocus.focus();
  }
  sheetLayer.addEventListener('mousedown', function (e) { if (e.target === sheetLayer) closeSheet(); });
  document.addEventListener('keydown', function (e) {
    if (sheetLayer.hidden) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    // примитивная фокус-ловушка: Tab не уходит под оверлей
    if (e.key === 'Tab') {
      var f = sheetEl.querySelectorAll('input, button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Тост с действием ---------- */
  var toastEl = document.getElementById('app-toast');
  var toastText = document.getElementById('toast-text');
  var toastAct = document.getElementById('toast-act');
  var toastTimer = null, toastFn = null;
  function appToast(text, actLabel, fn) {
    toastText.textContent = text;
    toastFn = fn || null;
    toastAct.hidden = !actLabel;
    if (actLabel) toastAct.textContent = actLabel;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4800);
  }
  toastAct.addEventListener('click', function () {
    if (toastFn) toastFn();
    toastEl.hidden = true;
  });

  /* ---------- Детали записи: сменить категорию / удалить ---------- */
  function openItemSheet(t) {
    var it = null;
    for (var i = 0; i < state.items.length; i++) if (state.items[i].t === t) it = state.items[i];
    if (!it) return;
    var c = catOf(it.c);
    var grid = activeCats().map(function (x) {
      return '<button class="cat' + (x.id === it.c ? ' sel' : '') + '" data-recat="' + x.id + '">' + x.svg + '<span>' + x.name + '</span></button>';
    }).join('');
    openSheet(
      '<div class="sheet-title">' + c.name + ' · −' + fmt(it.a) + ' ₽</div>' +
      '<div class="sheet-sub">' + new Date(it.t).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + '</div>' +
      '<div class="sheet-cats">' + grid + '</div>' +
      '<button class="sheet-btn danger" id="sheet-del">вырезать запись</button>'
    );
    sheetBody.querySelectorAll('[data-recat]').forEach(function (b) {
      b.addEventListener('click', function () {
        it.c = b.dataset.recat;
        save(); renderToday(); closeSheet();
        appToast('перенесено в «' + catOf(it.c).name + '»');
      });
    });
    document.getElementById('sheet-del').addEventListener('click', function () {
      state.items.splice(state.items.indexOf(it), 1);
      undoStack.push(it);
      save(); renderToday(); closeSheet();
      offerUndo();
    });
  }
  /* очередь undo: два удаления подряд не съедают друг друга */
  var undoStack = [];
  function offerUndo() {
    if (!undoStack.length) return;
    var n = undoStack.length;
    appToast(n > 1 ? 'вырезано записей: ' + n : 'запись вырезана', 'вернуть', function () {
      var back = undoStack.pop();
      if (back) { state.items.push(back); save(); renderToday(); }
      offerUndo(); // если в очереди есть ещё — предложим вернуть и их
    });
  }

  tapeList.addEventListener('click', function (e) {
    var li = e.target.closest('.tape-item');
    if (li) openItemSheet(+li.dataset.t);
  });
  tapeList.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var li = e.target.closest('.tape-item');
    if (li) { e.preventDefault(); openItemSheet(+li.dataset.t); }
  });

  /* ---------- Настройка потолка ---------- */
  document.getElementById('set-limit').addEventListener('click', function () {
    openSheet(
      '<div class="sheet-title">Дневной потолок</div>' +
      '<div class="sheet-sub">мы просто скажем, когда близко. без нотаций</div>' +
      '<input class="sheet-input" id="limit-input" type="text" inputmode="numeric" placeholder="например, 2 000" value="' + (state.limit || '') + '">' +
      '<div class="sheet-hint">₽ в день · пустое поле = потолка нет</div>' +
      '<button class="sheet-btn" id="limit-save">сохранить</button>' +
      (state.limit ? '<button class="sheet-btn danger" id="limit-off">убрать потолок</button>' : '')
    );
    var inp = document.getElementById('limit-input');
    inp.focus();
    document.getElementById('limit-save').addEventListener('click', function () {
      var n = parseInt(String(inp.value).replace(/\D/g, ''), 10) || 0;
      state.limit = n;
      save(); renderToday(); closeSheet();
      appToast(n ? 'потолок: ' + fmt(n) + ' ₽ в день' : 'потолок убран');
    });
    var off = document.getElementById('limit-off');
    if (off) off.addEventListener('click', function () {
      state.limit = 0;
      save(); renderToday(); closeSheet();
      appToast('потолок убран');
    });
  });

  /* ---------- Категории: скрыть / своя ---------- */
  var catsManage = document.getElementById('cats-manage');
  function renderCatsManage() {
    var hid = state.hidden;
    catsManage.innerHTML = allCats().map(function (c) {
      var isCustom = c.id.indexOf('c_') === 0;
      var off = hid.indexOf(c.id) > -1;
      return '<button class="cm-row' + (off ? ' off' : '') + '" data-cm="' + c.id + '">' +
        '<span class="ico">' + c.svg + '</span><b>' + c.name + '</b>' +
        '<span class="cm-k">' + (isCustom ? 'своя · ' : '') + (off ? 'скрыта' : 'скрыть') + '</span>' +
        '</button>';
    }).join('');
    catsManage.querySelectorAll('[data-cm]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.cm;
        var i = state.hidden.indexOf(id);
        if (i > -1) state.hidden.splice(i, 1);
        else {
          if (activeCats().length <= 3) { appToast('меньше трёх нельзя — касса не поймёт'); return; }
          state.hidden.push(id);
        }
        save(); renderCatsManage();
      });
    });
  }
  document.getElementById('set-cats').addEventListener('click', function () { go('cats'); });
  document.getElementById('add-cat').addEventListener('click', function () {
    var picks = Object.keys(SPARE).map(function (k, i) {
      return '<button data-pick="' + k + '"' + (i === 0 ? ' class="sel"' : '') + '>' + SPARE[k] + '</button>';
    }).join('');
    openSheet(
      '<div class="sheet-title">Своя категория</div>' +
      '<div class="sheet-sub">имя и значок — остальное как у всех</div>' +
      '<input class="sheet-input" id="cat-name" type="text" maxlength="14" placeholder="например, дача">' +
      '<div class="icon-pick" id="icon-pick">' + picks + '</div>' +
      '<button class="sheet-btn" id="cat-save">добавить</button>'
    );
    var sel = Object.keys(SPARE)[0];
    document.getElementById('icon-pick').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]');
      if (!b) return;
      sel = b.dataset.pick;
      document.querySelectorAll('#icon-pick button').forEach(function (x) { x.classList.toggle('sel', x === b); });
    });
    document.getElementById('cat-save').addEventListener('click', function () {
      var name = String(document.getElementById('cat-name').value || '').trim().toLowerCase();
      if (!name) { document.getElementById('cat-name').focus(); return; }
      state.custom.push({ id: 'c_' + Date.now(), name: name, icon: sel });
      save(); renderCatsManage(); closeSheet();
      appToast('категория «' + name + '» в деле');
    });
  });

  /* ---------- Экспорт CSV ---------- */
  document.getElementById('set-export').addEventListener('click', function () {
    if (!state.items.length) { appToast('пока нечего выгружать'); return; }
    function q(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }
    var rows = [['дата', 'время', 'категория', 'сумма']];
    state.items.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (it) {
      var d = new Date(it.t);
      rows.push([
        d.toLocaleDateString('ru-RU'),
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'),
        catOf(it.c).name, it.a
      ]);
    });
    var csv = '﻿' + rows.map(function (r) { return r.map(q).join(';'); }).join('\r\n');
    // В Telegram скачать Blob нельзя — вебвью не отдаёт файл в систему.
    // Кладём тот же CSV в буфер: вставляется в любую таблицу как есть.
    if (TG.on) {
      TG.copy(csv, function (ok) {
        appToast(ok ? 'чек в буфере — вставьте в таблицу' : 'не вышло скопировать');
        TG.haptic(ok ? 'ok' : 'err');
      });
      return;
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'uchteno.csv';
    document.body.appendChild(a); a.click(); a.remove();
    appToast('чек уехал в загрузки');
  });

  /* ---------- Онбординг: только при первом запуске ---------- */
  (function () {
    var seen = false;
    try { seen = !!localStorage.getItem('uchteno-onb'); } catch (e) {}
    if (SHOT ? SHOT !== 'onb' : seen) return;
    var slides = document.querySelectorAll('.onb-slide');
    var dots = document.querySelectorAll('.onb-dots i');
    var next = document.getElementById('onb-next');
    var cur = 0;
    go('onb');
    next.setAttribute('aria-label', 'дальше, шаг 1 из ' + slides.length);
    next.addEventListener('click', function () {
      if (cur < slides.length - 1) {
        cur++;
        slides.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
        dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
        next.setAttribute('aria-label', 'дальше, шаг ' + (cur + 1) + ' из ' + slides.length);
        if (cur === slides.length - 1) next.textContent = 'открыть кассу';
      } else {
        if (!IS_DEMO) { try { localStorage.setItem('uchteno-onb', '1'); } catch (e) {} }
        go('today');
      }
    });
  })();

  // вернулись во вкладку / в приложение — день мог смениться
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) renderToday();
  });

  renderToday();

  /* витрина: открыть заданный экран с содержимым */
  if (SHOT && SHOT !== 'onb') {
    if (SHOT === 'log') {
      openLog();
      amount = 240; selCat = 'coffee';
      renderAmount();
      var _cb = catsEl.querySelector('[data-cat="coffee"]');
      if (_cb) { _cb.classList.add('sel'); _cb.setAttribute('aria-pressed', 'true'); }
      updateCommit();
    } else {
      /* stats.js подключён после app.js — ждём полной загрузки, иначе «итоги» откроются пустыми */
      window.addEventListener('load', function () { go(SHOT); });
    }
  }
})();
