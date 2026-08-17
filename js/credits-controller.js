(function registerCreditsController() {
  'use strict';

  function initAccordions() {
    document.querySelectorAll('[data-credit-accordion]').forEach((column) => {
      const groups = Array.from(column.querySelectorAll('details.credits-group'))
        .filter((details) => details.parentElement === column);

      groups.forEach((group) => {
        group.addEventListener('toggle', () => {
          if (!group.open) return;
          groups.forEach((other) => {
            if (other !== group && other.open) other.open = false;
          });
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions, { once: true });
  } else {
    initAccordions();
  }
})();
