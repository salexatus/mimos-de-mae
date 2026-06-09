/* =====================================================================
   Mimos de Mãe — interações + renderização de conteúdo
   - Conteúdo editável vem de content.json (gerido pelo Sveltia CMS)
   - O HTML serve de fallback: se o fetch falhar, a página continua válida
   - Cursor custom (só pointer fino), countdown, nav, menu mobile, reveals
   ===================================================================== */
(function () {
  'use strict';

  var DEFAULTS = {
    whatsapp: '5569992284490',
    instagram: 'mimosdemaeconfeitaria',
    launch: '2026-06-13T00:00:00-04:00'
  };
  var state = {
    whatsapp: DEFAULTS.whatsapp,
    instagram: DEFAULTS.instagram,
    launch: DEFAULTS.launch
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // escapa texto e converte quebras de linha em <br>
  function escBr(s) { return esc(s).replace(/\n/g, '<br>'); }

  /* ---------- WhatsApp helper (usado pelos cards do portfólio) ---------- */
  window.waLink = function (msg) {
    var text = msg || 'Olá, vim pelo site e quero fazer um pedido!';
    window.open('https://wa.me/' + state.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  };

  /* =====================================================================
     RENDERIZAÇÃO A PARTIR DO content.json
     ===================================================================== */
  function applyContent(data) {
    if (!data) return;

    /* contato */
    if (data.contact) {
      if (data.contact.whatsapp) state.whatsapp = String(data.contact.whatsapp).replace(/\D/g, '');
      if (data.contact.instagram) state.instagram = String(data.contact.instagram).replace(/^@/, '');
    }
    if (data.launch && data.launch.datetime) state.launch = data.launch.datetime;

    /* reescreve todos os links de WhatsApp mantendo a mensagem (?text=) */
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      a.href = a.getAttribute('href').replace(/wa\.me\/\d+/, 'wa.me/' + state.whatsapp);
    });
    /* reescreve links do Instagram (href + texto do @handle quando houver) */
    document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) {
      a.href = 'https://www.instagram.com/' + state.instagram + '/';
      if (/@/.test(a.textContent)) a.textContent = '📸 @' + state.instagram;
    });

    /* rótulos de data do lançamento */
    var label = (data.launch && data.launch.dateLabel) || '';
    if (label) {
      setText('launch-pill', '📅 Lançamento oficial: ' + label + ' · Ji-Paraná/RO');
      setText('eg-badge', '🌟 Novidade · ' + label);
      setText('eg-pill', '📅 ' + label + ' · Ji-Paraná/RO');
    }

    /* hero */
    if (data.hero) {
      if (data.hero.description) setText('hero-desc', data.hero.description);
      renderStats(data.hero.stats);
    }

    /* estação gourmet */
    if (data.estacao) {
      renderEstacaoCards(data.estacao.cards);
      renderFeatures(data.estacao.features);
    }

    renderPortfolio(data.portfolio);
    renderEspecialidades(data.especialidades);
    renderDepoimentos(data.depoimentos);
  }

  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text;
  }
  function fill(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
    return node;
  }
  function delayClass(i) { return ['', ' d1', ' d2', ' d3'][i % 4]; }

  function renderStats(stats) {
    if (!Array.isArray(stats) || !stats.length) return;
    fill('hero-stats', stats.map(function (s) {
      return '<div><div class="snum">' + esc(s.num) + '</div>' +
             '<div class="slbl">' + escBr(s.label) + '</div></div>';
    }).join(''));
  }

  function renderEstacaoCards(cards) {
    if (!Array.isArray(cards) || !cards.length) return;
    fill('estacao-cards', cards.map(function (c, i) {
      return '<article class="eg-card' + (c.wide ? ' wide' : '') + ' rv' + delayClass(i) + '">' +
        '<div class="bg" style="background-image:url(\'' + esc(c.image) + '\')" role="img" aria-label="' + esc(c.title) + '"></div>' +
        '<div class="lay"></div>' +
        '<div class="cb"><p class="cn">' + esc(c.tag) + '</p>' +
        '<h3 class="ct">' + esc(c.title) + '</h3>' +
        '<p class="cd">' + esc(c.desc) + '</p></div></article>';
    }).join(''));
  }

  function renderFeatures(features) {
    if (!Array.isArray(features) || !features.length) return;
    fill('estacao-features', features.map(function (f, i) {
      return '<div class="ef rv' + delayClass(i) + '">' +
        '<div class="icon" aria-hidden="true">' + esc(f.icon) + '</div>' +
        '<h3>' + esc(f.title) + '</h3><p>' + esc(f.desc) + '</p></div>';
    }).join(''));
  }

  function renderPortfolio(items) {
    if (!Array.isArray(items) || !items.length) return;
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pc ' + (p.size || 'n3') + ' rv' + delayClass(i);
      btn.innerHTML =
        '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async"/>' +
        '<span class="ptag">' + esc(p.category) + '</span><span class="ov"></span>' +
        '<span class="pi"><h3>' + esc(p.title) + '</h3><p>' + esc(p.desc) + '</p></span>';
      btn.addEventListener('click', function () {
        window.waLink(p.message || ('Olá! Quero um orçamento de ' + p.title + '.'));
      });
      grid.appendChild(btn);
    });
  }

  function renderEspecialidades(items) {
    if (!Array.isArray(items) || !items.length) return;
    fill('esp-grid', items.map(function (s, i) {
      return '<article class="scard rv' + delayClass(i) + '">' +
        '<div class="bg" style="background-image:url(\'' + esc(s.image) + '\')" role="img" aria-label="' + esc(s.title) + '"></div>' +
        '<div class="lay"></div>' +
        '<div class="sb"><p class="sn">' + esc(s.num) + '</p>' +
        '<h3 class="st">' + esc(s.title) + '</h3>' +
        '<p class="sd">' + esc(s.desc) + '</p></div></article>';
    }).join(''));
  }

  function renderDepoimentos(items) {
    if (!Array.isArray(items) || !items.length) return;
    var colors = { rose: 'var(--rose)', gold: 'var(--gold)', ink: 'var(--ink)' };
    fill('dep-grid', items.map(function (t, i) {
      var bg = colors[t.color] || 'var(--rose)';
      var initial = (t.name || '?').trim().charAt(0).toUpperCase();
      return '<figure class="tc rv' + delayClass(i) + '">' +
        '<div class="ts" aria-label="5 de 5 estrelas">★★★★★</div>' +
        '<blockquote class="tt">&ldquo;' + esc(t.text) + '&rdquo;</blockquote>' +
        '<figcaption class="ta"><div class="tav" style="background:' + bg + '">' + esc(initial) + '</div>' +
        '<div><div class="tnm">' + esc(t.name) + '</div>' +
        '<div class="tlc">' + esc(t.location) + '</div></div></figcaption></figure>';
    }).join(''));
  }

  /* =====================================================================
     INTERAÇÕES
     ===================================================================== */

  function initCursor() {
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
  }

  function initNavShadow() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('sc', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
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
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  }

  function initCountdown() {
    var wrap = document.getElementById('countdown');
    if (!wrap) return;
    var target = new Date(state.launch).getTime();
    if (isNaN(target)) target = new Date(DEFAULTS.launch).getTime();

    var el = {
      d: document.getElementById('cd-d'),
      h: document.getElementById('cd-h'),
      m: document.getElementById('cd-m'),
      s: document.getElementById('cd-s')
    };
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function launched() {
      wrap.innerHTML = '<div class="cd-live">✨ Já disponível — reserve sua data!</div>';
    }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { launched(); return; }
      if (el.d) el.d.textContent = pad(Math.floor(diff / 86400000));
      if (el.h) el.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      if (el.m) el.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
      if (el.s) el.s.textContent = pad(Math.floor((diff % 60000) / 1000));
      setTimeout(tick, 1000);
    }
    tick();
  }

  function initReveal() {
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
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- boot ---------- */
  // Interações independentes do conteúdo podem iniciar já
  initCursor();
  initNavShadow();
  initMobileNav();
  initYear();

  // Carrega o conteúdo e, em seguida, inicia o que depende do DOM final
  function finalize() {
    initCountdown();
    initReveal();
  }

  fetch('content.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) { applyContent(data); })
    .catch(function () { /* mantém o HTML de fallback */ })
    .then(finalize);
})();
