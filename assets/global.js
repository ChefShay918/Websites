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

  /* ── Mobile nav toggle ────────────────────────────────────── */
  const menuToggle = document.querySelector('.site-header__menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (menuToggle && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ── Driver application: print filled-in copy ────────────── */
  const applyForm = document.querySelector('.fbs-apply__form');
  const printBtn = document.querySelector('.fbs-apply__print-btn');
  const printSummary = document.getElementById('fbs-print-summary');

  if (applyForm && printBtn && printSummary) {
    const escapeHtml = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    printBtn.addEventListener('click', () => {
      applyForm.querySelectorAll('[data-print-checkbox-summary]').forEach((hidden) => {
        const groupKey = hidden.dataset.printCheckboxSummary;
        const checked = Array.from(
          applyForm.querySelectorAll('[data-print-checkbox-of="' + groupKey + '"]:checked')
        ).map((cb) => cb.dataset.printOption);
        hidden.value = checked.length ? checked.join(', ') : 'None selected';
      });

      const sections = [];
      let current = null;
      applyForm.querySelectorAll('[data-print-label]').forEach((field) => {
        const sectionName = field.dataset.printSection || '';
        if (!current || current.name !== sectionName) {
          current = { name: sectionName, rows: [] };
          sections.push(current);
        }
        current.rows.push({
          label: field.dataset.printLabel,
          value: (field.value || '').trim() || '—',
        });
      });

      const nameField = applyForm.querySelector('#ApplyFullName');
      const applicantName = (nameField && nameField.value.trim()) || 'Driver Application';

      let html = '<h1>' + escapeHtml(applicantName) + ' — Driver Application</h1>';
      html += '<p class="fbs-print-date">Printed ' + new Date().toLocaleDateString() + '</p>';
      sections.forEach((section) => {
        html += '<h2>' + escapeHtml(section.name) + '</h2>';
        section.rows.forEach((row) => {
          html +=
            '<div class="fbs-print-row"><span class="fbs-print-label">' +
            escapeHtml(row.label) +
            ':</span><span class="fbs-print-value">' +
            escapeHtml(row.value) +
            '</span></div>';
        });
      });

      printSummary.innerHTML = html;
      window.print();
    });
  }

})();
