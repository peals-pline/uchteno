/* УЧТЕНО — слой Telegram Mini App.
   Подключается ДО app.js и в браузере ничего не меняет: без Telegram все
   функции падают на обычные браузерные аналоги, приложение работает как есть. */
(function () {
  'use strict';
  var tg = window.Telegram && window.Telegram.WebApp;
  var inTg = !!(tg && tg.initData !== undefined && tg.platform && tg.platform !== 'unknown');

  /* Версия API у клиентов разная: старые методы просто отсутствуют.
     Вызываем через обёртку, иначе на старом клиенте всё приложение падало бы. */
  function call(name, arg) {
    try { if (tg && typeof tg[name] === 'function') return arg === undefined ? tg[name]() : tg[name](arg); }
    catch (e) {}
  }

  if (inTg) {
    document.documentElement.classList.add('in-tg');
    call('ready');
    call('expand');
    // Свайп вниз закрывает мини-апп — а у нас вертикальные списки и цифровая
    // клавиатура: без этого лента закрывала бы приложение при прокрутке.
    call('disableVerticalSwipes');
    call('setHeaderColor', '#FAF6EE');
    call('setBackgroundColor', '#FAF6EE');
  }

  var backFn = null;
  if (inTg && tg.BackButton) {
    try { tg.BackButton.onClick(function () { if (backFn) backFn(); }); } catch (e) {}
  }

  window.TG = {
    on: inTg,
    platform: inTg ? tg.platform : 'web',

    /** Системная кнопка «назад» в шапке Telegram. target=null — спрятать. */
    back: function (fn) {
      backFn = fn;
      if (!inTg || !tg.BackButton) return;
      try { fn ? tg.BackButton.show() : tg.BackButton.hide(); } catch (e) {}
    },

    /** Тактильный отклик: 'tap' | 'ok' | 'warn' | 'err'. */
    haptic: function (kind) {
      if (!inTg || !tg.HapticFeedback) return;
      try {
        if (kind === 'ok') tg.HapticFeedback.notificationOccurred('success');
        else if (kind === 'warn') tg.HapticFeedback.notificationOccurred('warning');
        else if (kind === 'err') tg.HapticFeedback.notificationOccurred('error');
        else tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    },

    /** Подтверждение. В Telegram window.confirm блокируется — нужен свой. */
    confirm: function (text, cb) {
      if (inTg && typeof tg.showConfirm === 'function') {
        try { tg.showConfirm(text, function (ok) { cb(!!ok); }); return; } catch (e) {}
      }
      cb(window.confirm(text));
    },

    /** Текст в буфер: в Telegram скачивание Blob недоступно, копирование — да. */
    copy: function (text, done) {
      var ok = function () { done(true); };
      var no = function () { done(false); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, no);
        return;
      }
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        var done2 = document.execCommand('copy');
        ta.remove();
        done2 ? ok() : no();
      } catch (e) { no(); }
    }
  };
})();
