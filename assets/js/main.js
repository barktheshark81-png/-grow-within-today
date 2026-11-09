/* Grow Within Today — nur progressive Verbesserung.
   Die Website funktioniert vollständig ohne JavaScript. Keine Cookies, kein Browser-Speicher, kein Tracking. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var header = document.querySelector('.site-header');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.setAttribute('data-open', String(open));
    if (header) header.classList.toggle('nav-open', open);
  }
  if (toggle && nav) {
    setNav(false);
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    window.matchMedia('(min-width: 56em)').addEventListener('change', function (mq) { if (mq.matches) setNav(false); });
  }

  /* ---------- Header state on the home hero ---------- */
  if (header && document.body.classList.contains('page-home')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Subtle hero parallax ---------- */
  var layers = document.querySelectorAll('.hero__art [data-depth]');
  if (layers.length && !reduceMotion) {
    var ticking = false;
    var hero = document.querySelector('.hero');
    var update = function () {
      var y = window.scrollY;
      if (y < hero.offsetHeight) {
        layers.forEach(function (l) {
          l.style.transform = 'translate3d(0,' + (y * parseFloat(l.getAttribute('data-depth')) * -0.6).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    };
    // Wait for the load animation to finish before taking over transforms
    setTimeout(function () {
      layers.forEach(function (l) { l.style.animation = 'none'; });
      update();
      window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    }, 2500);
  }

  /* ---------- Topics: highlight the section in view ---------- */
  var topicLinks = document.querySelectorAll('.topic-nav a[href^="#"]');
  if (topicLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    topicLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          topicLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
          map[en.target.id].setAttribute('aria-current', 'true');
          var link = map[en.target.id];
          link.parentNode.parentNode.scrollTo({ left: link.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.topic[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- Contact: copy email address ---------- */
  var copyBtn = document.querySelector('[data-copy]');
  if (copyBtn) {
    var status = document.getElementById('copy-status');
    if (navigator.clipboard) { copyBtn.hidden = false; }
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(function () {
        if (status) status.textContent = 'E-Mail-Adresse kopiert.';
      }, function () {
        if (status) status.textContent = 'Das Kopieren hat nicht funktioniert. Bitte markiere die Adresse oben und kopiere sie manuell.';
      });
    });
  }
})();
