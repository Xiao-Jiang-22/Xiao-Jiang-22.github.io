/* Responsive navigation and a compact header. No hover is needed to navigate. */
(function () {
  'use strict';
  var nav = document.getElementById('site-nav');
  if (!nav) return;
  var header = document.querySelector('.masthead');
  var toggle = nav.querySelector('.site-nav-toggle');
  var links = nav.querySelector('.site-nav__links');
  var mobile = window.matchMedia('(max-width: 640px)');
  var scheduled = false;
  nav.setAttribute('data-enhanced', 'true');

  function setOpen(open, restoreFocus) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
  });
  links.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false, false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
  });
  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target)) setOpen(false, false);
  });
  nav.addEventListener('focusout', function (event) {
    if (event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false, false);
  });
  mobile.addEventListener('change', function () { setOpen(false, false); });

  function updateHeader() {
    var compact = header.classList.contains('is-compact');
    header.classList.toggle('is-compact', compact ? window.scrollY > 32 : window.scrollY > 80);
    scheduled = false;
  }
  window.addEventListener('scroll', function () {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
  updateHeader();
})();
