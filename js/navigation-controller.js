(function registerTikusNavigation(global) {
  'use strict';

  function init() {
    const controls = document.querySelector('[data-site-controls]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-site-navigation]');
    if (!controls || !toggle || !nav) return;

    let open = false;

    function t(key, fallback) {
      return global.TikusI18n?.t(key, {}, fallback) ?? fallback;
    }

    function render() {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? t('nav.close', 'Close navigation menu') : t('nav.open', 'Open navigation menu'));
      controls.classList.toggle('is-menu-open', open);
      nav.hidden = !open;
      document.documentElement.classList.toggle('has-site-menu', open);
    }

    function close({ restoreFocus = false } = {}) {
      if (!open) return;
      open = false;
      render();
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    function openMenu() {
      if (open) return;
      open = true;
      render();
      const firstLink = nav.querySelector('a');
      firstLink?.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', () => {
      if (open) close();
      else openMenu();
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('[data-nav-link]')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close({ restoreFocus: true });
      }
      if (event.key === 'Tab') {
        const focusables = [toggle, ...nav.querySelectorAll('a[href]')].filter((el) => !el.hidden);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('pointerdown', (event) => {
      if (open && !controls.contains(event.target)) close();
    });

    document.addEventListener('tikuslanguagechange', render);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);
