/* ============================================================
   УЧТЕНО — экран «Итоги»
   Строит три карточки: «Неделя чеком», «Куда уходит», «Мелким шрифтом».
   Пересчитывает всё заново при каждом вызове render (вызывается из app.js
   при переходе на экран stats).
   ============================================================ */
window.UchtenoStats = (function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DAY = 864e5;
  var WEEK_LABELS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  function fmt(n) { return n.toLocaleString('ru-RU') + ' ₽'; }

  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* понедельник = 0 … воскресенье = 6, как в WEEK_LABELS */
  function isoWeekday(ts) {
    var wd = new Date(ts).getDay(); // 0=вс..6=сб
    return wd === 0 ? 6 : wd - 1;
  }

  /* ---------- Блок 1: «Неделя чеком» ---------- */
  function buildWeek(items) {
    var now = Date.now();
    var todayKey = dayKey(now);
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var ts = now - i * DAY;
      var key = dayKey(ts);
      var sum = items.filter(function (it) { return dayKey(it.t) === key; })
        .reduce(function (s, it) { return s + it.a; }, 0);
      days.push({ key: key, label: WEEK_LABELS[isoWeekday(ts)], sum: sum, isToday: key === todayKey });
    }
    var total = days.reduce(function (s, d) { return s + d.sum; }, 0);
    var max = days.reduce(function (m, d) { return Math.max(m, d.sum); }, 0);

    var bars = days.map(function (d, i) {
      var hasData = d.sum > 0;
      var h = hasData ? Math.max(6, Math.round((d.sum / max) * 84)) : 6;
      var cls = 'st-bar' + (d.isToday ? ' st-bar-today' : '') + (hasData ? '' : ' st-bar-empty');
      var style = 'height:' + h + 'px' + (reduced ? '' : ';animation-delay:' + (i * 40) + 'ms');
      return '<div class="st-bar-col">' +
        '<div class="st-bar-slot"><div class="' + cls + '" style="' + style + '"></div></div>' +
        '<div class="st-bar-day">' + d.label + '</div>' +
        '<div class="st-bar-sum">' + (hasData ? d.sum.toLocaleString('ru-RU') : '—') + '</div>' +
        '</div>';
    }).join('');

    return '<div class="st-card">' +
      '<div class="st-row-head">последние 7 дней · итого ' + total.toLocaleString('ru-RU') + ' ₽</div>' +
      '<div class="st-week">' + bars + '</div>' +
      '</div>';
  }

  /* ---------- Блок 2: «Куда уходит» (топ-5 категорий за 30 дней) ---------- */
  function buildTop(items, catById) {
    var since = Date.now() - 30 * DAY;
    var sums = {};
    items.forEach(function (it) {
      if (it.t < since) return;
      sums[it.c] = (sums[it.c] || 0) + it.a;
    });
    var rows = Object.keys(sums).map(function (id) {
      return { id: id, sum: sums[id] };
    }).sort(function (a, b) { return b.sum - a.sum; }).slice(0, 5);

    if (!rows.length) return ''; // и одна категория — уже картина

    var top = rows[0].sum;
    var list = rows.map(function (r, i) {
      var c = catById[r.id] || catById.other;
      var pct = top ? Math.round((r.sum / top) * 100) : 0;
      var fillClass = 'st-fill' + (i === 0 ? ' st-fill-stamp' : '');
      return '<div class="st-cat-row">' +
        '<span class="st-cat-ico">' + c.svg + '</span>' +
        '<div class="st-cat-body">' +
        '<div class="st-cat-top"><span class="st-cat-name">' + c.name + '</span>' +
        '<span class="st-cat-sum">' + fmt(r.sum) + '</span></div>' +
        '<div class="st-cat-track"><div class="' + fillClass + '" style="width:' + pct + '%"></div></div>' +
        '</div></div>';
    }).join('');

    return '<div class="st-card">' +
      '<div class="st-row-head">куда уходит · 30 дней</div>' +
      list +
      '</div>';
  }

  /* ---------- Блок 3: «Мелким шрифтом» (факты за 30 дней) ---------- */
  function buildFacts(items, catById) {
    var since = Date.now() - 30 * DAY;
    var recent = items.filter(function (it) { return it.t >= since; });
    if (!recent.length) return '';

    var freq = {};
    recent.forEach(function (it) { freq[it.c] = (freq[it.c] || 0) + 1; });
    var topCatId = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; })[0];
    var topCat = catById[topCatId] || catById.other;

    var sorted = recent.map(function (it) { return it.a; }).sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    var median = sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

    return '<div class="st-card st-facts">' +
      '<p>самая частая: ' + topCat.name + ' · ' + freq[topCatId] + ' раз</p>' +
      '<p>медианный чек: ' + median.toLocaleString('ru-RU') + ' ₽</p>' +
      '<p>всего записей: ' + recent.length + '</p>' +
      '</div>';
  }

  /* ---------- Пустое состояние ---------- */
  function buildEmpty() {
    return '<div class="st-empty">итоги появятся после первой записи.<br>хорошая новость: она занимает 4 секунды</div>';
  }

  function render(state, cats) {
    var mount = document.getElementById('stats-mount');
    if (!mount) return;

    var items = (state && state.items) || [];
    if (!items.length) {
      mount.innerHTML = buildEmpty();
      return;
    }

    var catById = {};
    cats.forEach(function (c) { catById[c.id] = c; });

    var html = buildWeek(items) + buildTop(items, catById) + buildFacts(items, catById);
    mount.innerHTML = html;
  }

  return { render: render };
})();
