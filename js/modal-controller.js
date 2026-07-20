(function registerModalController(global) {
  'use strict';

  class ModalController {
    constructor(dialog) {
      if (!(dialog instanceof HTMLDialogElement)) {
        throw new TypeError('ModalController requires a dialog element.');
      }

      this.dialog = dialog;
      this.closeButton = dialog.querySelector('[data-dialog-close]');
      this.eyebrow = dialog.querySelector('[data-dialog-eyebrow]');
      this.title = dialog.querySelector('[data-dialog-title]');
      this.body = dialog.querySelector('[data-dialog-body]');
      this.trigger = null;
      this.inertRecords = [];
      this.isClosing = false;

      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleClose = this.handleClose.bind(this);

      this.closeButton.addEventListener('click', () => this.close());
      this.dialog.addEventListener('keydown', this.handleKeydown);
      this.dialog.addEventListener('cancel', this.handleCancel);
      this.dialog.addEventListener('click', this.handleClick);
      this.dialog.addEventListener('close', this.handleClose);
    }

    open(content, trigger) {
      if (!content || !content.title || !content.body) {
        return;
      }

      this.trigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
      this.eyebrow.textContent = content.eyebrow || '';
      this.title.textContent = content.title;
      this.body.textContent = content.body;

      this.setBackgroundInert(true);
      document.body.classList.add('has-open-dialog');

      if (typeof this.dialog.showModal === 'function') {
        if (!this.dialog.open) {
          this.dialog.showModal();
        }
      } else {
        this.dialog.setAttribute('open', '');
      }

      window.requestAnimationFrame(() => {
        this.title.focus({ preventScroll: true });
      });
    }

    close(options = {}) {
      const { restoreFocus = true } = options;
      if (!this.dialog.open && !this.dialog.hasAttribute('open')) {
        return;
      }

      this.isClosing = true;
      this.shouldRestoreFocus = restoreFocus;

      if (typeof this.dialog.close === 'function') {
        this.dialog.close();
      } else {
        this.dialog.removeAttribute('open');
        this.handleClose();
      }
    }

    handleCancel(event) {
      event.preventDefault();
      this.close();
    }

    handleClick(event) {
      if (event.target === this.dialog) {
        this.close();
      }
    }

    handleClose() {
      this.setBackgroundInert(false);
      document.body.classList.remove('has-open-dialog');

      const restoreFocus = this.shouldRestoreFocus !== false;
      const trigger = this.trigger;
      this.trigger = null;
      this.shouldRestoreFocus = true;
      this.isClosing = false;

      if (restoreFocus && trigger instanceof HTMLElement && document.contains(trigger)) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
      }
    }

    handleKeydown(event) {
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = this.getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        this.dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !this.dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !this.dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    getFocusableElements() {
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');

      return Array.from(this.dialog.querySelectorAll(selector)).filter((element) => {
        return !element.hasAttribute('hidden') && element.getClientRects().length > 0;
      });
    }

    setBackgroundInert(makeInert) {
      const targets = document.querySelectorAll('[data-dialog-inert]');

      if (makeInert) {
        this.inertRecords = Array.from(targets).map((element) => ({
          element,
          inert: element.inert,
          ariaHidden: element.getAttribute('aria-hidden')
        }));

        this.inertRecords.forEach(({ element }) => {
          element.inert = true;
          element.setAttribute('aria-hidden', 'true');
        });
        return;
      }

      this.inertRecords.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }
      });
      this.inertRecords = [];
    }
  }

  global.TikusModalController = ModalController;
})(window);
