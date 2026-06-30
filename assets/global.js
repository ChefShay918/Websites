/* global.js — PrintsByShay */

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

  /* ── Product thumbnails ──────────────────────────────────── */
  document.querySelectorAll('.product-thumbnail').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      const mainImg = document.querySelector('.product-media__main img');
      if (mainImg && src) {
        mainImg.src = src;
        document.querySelectorAll('.product-thumbnail').forEach((t) =>
          t.classList.remove('is-active')
        );
        thumb.classList.add('is-active');
      }
    });
  });

  /* ── Cart quantity controls ──────────────────────────────── */
  document.querySelectorAll('.cart-item__qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.cart-item__qty').querySelector('.cart-item__qty-input');
      if (!input) return;
      const delta = btn.dataset.action === 'increase' ? 1 : -1;
      const newVal = Math.max(0, parseInt(input.value, 10) + delta);
      input.value = newVal;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

})();
