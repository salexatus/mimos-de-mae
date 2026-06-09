/* =====================================================================
   Mimos de Mãe — interações da landing page
   - Cursor custom (apenas pointer fino, respeita reduced-motion)
   - Contagem regressiva para o lançamento (13/06/2026, fuso de RO = UTC-4)
   - Sombra da navbar ao rolar
   - Menu mobile acessível (ESC, foco, trava de scroll)
   - Revelação ao rolar (IntersectionObserver)
   - Atalho de WhatsApp para os cards do portfólio
   ===================================================================== */
(function () {
  'use strict';

  var WHATSAPP = '5569992284490';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp helper (usado pelos cards do portfólio) ---------- */
  window.waLink = function (msg) {
    var text = msg || 'Olá, vim pelo site e quero fazer um pedido!';
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  /* ---------- Custom cursor (somente dispositivos com pointer fino) ---------- */
  (function cursor() {
    var fine = window.matchMedia('(pointer: fine)').matches;
    var cur = document.getElementById('cur');
    if (!fine || reduceMotion || !cur) return;

    document.body.classList.add('cursor-on');
    var dot = cur.querySelector('.cdot');
    var ring = cur.querySelector('.cring');
    var rx = 0, ry = 0, dx = 0, dy = 0;

    window.addEventListener('mousemove', function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
    }, { passive: true });

    (function loop() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- Navbar shadow ---------- */
  (function navShadow() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('sc', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Mobile nav ---------- */
  (function mobileNav() {
    var menu = document.getElementById('mobnav');
    var openBtn = document.getElementById('burger');
    var closeBtn = document.getElementById('mobx');
    if (!menu || !openBtn) return;

    function open() {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
      openBtn.setAttribute('aria-expanded', 'true');
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
    function close() {
      menu.classList.remove('open');
      document.body.style.overflow = '';
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  })();

  /* ---------- Countdown ---------- */
  (function countdown() {
    var wrap = document.getElementById('countdown');
    if (!wrap) return;

    // 13 de junho de 2026, 00:00 — horário de Rondônia (UTC-4, sem horário de verão)
    var target = new Date('2026-06-13T00:00:00-04:00').getTime();

    var el = {
      d: document.getElementById('cd-d'),
      h: document.getElementById('cd-h'),
      m: document.getElementById('cd-m'),
      s: document.getElementById('cd-s')
    };

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function launched() {
      wrap.innerHTML =
        '<div class="cd-live">✨ Já disponível — reserve sua data!</div>';
    }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { launched(); return; }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      if (el.d) el.d.textContent = pad(days);
      if (el.h) el.h.textContent = pad(hours);
      if (el.m) el.m.textContent = pad(mins);
      if (el.s) el.s.textContent = pad(secs);
      setTimeout(tick, 1000);
    }
    tick();
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    var items = document.querySelectorAll('.rv');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('on'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Footer year ---------- */
  (function year() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  })();
})();
