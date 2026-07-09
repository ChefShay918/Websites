/* global.js — Family Bond Solutions LLC */

(function () {
  'use strict';

  /* ── Sticky header shadow on scroll ─────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

})();
