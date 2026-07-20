(function registerModalControllers(global) {
  'use strict';

  class DialogControllerBase {
    constructor(dialog, closeSelector) {
      if (!(dialog instanceof HTMLDialogElement)) {
        throw new TypeError('Dialog controller requires a dialog element.');
      }

      this.dialog = dialog;
      this.closeButton = dialog.querySelector(closeSelector);
      this.trigger = null;
      this.inertRecords = [];
      this.shouldRestoreFocus = true;

      if (!(this.closeButton instanceof HTMLButtonElement)) {
        throw new Error('Dialog close button was not found.');
      }

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

    show(trigger, focusTarget) {
      this.trigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
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
        const target = focusTarget instanceof HTMLElement ? focusTarget : this.closeButton;
        target.focus({ preventScroll: true });
      });
    }

    close(options = {}) {
      const { restoreFocus = true } = options;
      if (!this.dialog.open && !this.dialog.hasAttribute('open')) {
        return;
      }

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
      this.beforeRestoreFocus();
      this.setBackgroundInert(false);
      document.body.classList.toggle('has-open-dialog', Boolean(document.querySelector('dialog[open]')));

      const restoreFocus = this.shouldRestoreFocus !== false;
      const trigger = this.trigger;
      this.trigger = null;
      this.shouldRestoreFocus = true;

      if (restoreFocus && trigger instanceof HTMLElement && document.contains(trigger)) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
      }
    }

    beforeRestoreFocus() {}

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
        'iframe',
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

  class ModalController extends DialogControllerBase {
    constructor(dialog) {
      super(dialog, '[data-dialog-close]');
      this.eyebrow = dialog.querySelector('[data-dialog-eyebrow]');
      this.title = dialog.querySelector('[data-dialog-title]');
      this.body = dialog.querySelector('[data-dialog-body]');
    }

    open(content, trigger) {
      if (!content || !content.title || !content.body) {
        return;
      }

      this.eyebrow.textContent = content.eyebrow || '';
      this.title.textContent = content.title;
      this.body.textContent = content.body;
      this.show(trigger, this.title);
    }
  }

  class TrailerModalController extends DialogControllerBase {
    constructor(dialog, config) {
      super(dialog, '[data-trailer-close]');
      this.config = config || {};
      this.title = dialog.querySelector('#trailer-dialog-title');
      this.frame = dialog.querySelector('[data-trailer-frame]');
      this.externalLink = dialog.querySelector('[data-trailer-link]');
      this.openButtons = Array.from(document.querySelectorAll('[data-trailer-open]'));

      if (!(this.frame instanceof HTMLIFrameElement)) {
        throw new Error('Trailer iframe was not found.');
      }

      this.openButtons.forEach((button) => {
        button.addEventListener('click', () => this.open(button));
      });

      if (this.externalLink && this.config.watchUrl) {
        this.externalLink.href = this.config.watchUrl;
      }
    }

    open(trigger) {
      if (!this.config.embedUrl) {
        if (this.config.watchUrl) {
          window.open(this.config.watchUrl, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      this.frame.src = this.config.embedUrl;
      this.show(trigger, this.closeButton);
    }

    beforeRestoreFocus() {
      this.frame.removeAttribute('src');
    }
  }

  global.TikusModalController = ModalController;
  global.TikusTrailerModalController = TrailerModalController;
})(window);
