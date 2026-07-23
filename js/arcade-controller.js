(function registerTikusGameDialog(global) {
  'use strict';

  const REQUIRED_GAMES = Object.freeze(['beat', 'slider', 'rush']);
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function validateGameHotspots() {
    const room = global.TIKUS_CONTENT?.scenes?.['sitting-room'];
    if (!room || !Array.isArray(room.hotspots)) return false;
    const gameIds = room.hotspots.map((hotspot) => hotspot?.gameId).filter(Boolean);
    return room.hotspots.length === 3
      && room.hotspots.every((hotspot) => hotspot?.type === 'game')
      && REQUIRED_GAMES.every((id) => gameIds.includes(id));
  }

  class GameDialogController {
    constructor() {
      this.dialog = null;
      this.surface = null;
      this.content = null;
      this.brandEyebrow = null;
      this.brandTitle = null;
      this.trigger = null;
      this.currentGame = null;
      this.inertRecords = [];
      this.reducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleBackdropClick = this.handleBackdropClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.init();
    }

    init() {
      const dialog = create('dialog', 'tikus-arcade-dialog');
      dialog.id = 'tikus-game-dialog';
      dialog.setAttribute('aria-labelledby', 'tikus-game-dialog-title');
      dialog.setAttribute('aria-describedby', 'tikus-game-dialog-description');

      const surface = create('article', 'tikus-arcade-dialog__surface');
      const topbar = create('header', 'tikus-arcade-dialog__topbar');
      const brand = create('div', 'tikus-arcade-dialog__brand');
      const eyebrow = create('p', 'tikus-arcade-dialog__eyebrow', 'SAMASIHAT AFTER DARK');
      const title = create('h2', 'tikus-arcade-dialog__title', 'TIKUS Game');
      title.id = 'tikus-game-dialog-title';
      brand.append(eyebrow, title);

      const closeButton = create('button', 'tikus-arcade-dialog__close', '×');
      closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Close game and return to the Sitting Room');
      closeButton.addEventListener('click', () => this.close());
      topbar.append(brand, closeButton);

      const content = create('div', 'tikus-arcade-dialog__content');
      content.dataset.arcadeContent = '';
      const description = create('p', 'visually-hidden', 'A spoiler-safe, non-canonical TIKUS game.');
      description.id = 'tikus-game-dialog-description';
      surface.append(topbar, content, description);
      dialog.append(surface);
      document.body.append(dialog);

      this.dialog = dialog;
      this.surface = surface;
      this.content = content;
      this.brandEyebrow = eyebrow;
      this.brandTitle = title;
      this.closeButton = closeButton;

      dialog.addEventListener('keydown', this.handleKeydown);
      dialog.addEventListener('cancel', this.handleCancel);
      dialog.addEventListener('click', this.handleBackdropClick);
      dialog.addEventListener('close', this.handleClose);
    }

    launch(gameId) {
      const game = global.TikusGames?.[gameId];
      if (!game) {
        this.content.replaceChildren(create('p', 'tikus-game-error', 'This game is temporarily unavailable.'));
        return false;
      }

      if (this.currentGame?.destroy) this.currentGame.destroy();
      this.currentGame = null;
      this.dialog.dataset.arcadeView = gameId;
      this.surface.classList.add('is-playing');
      this.brandEyebrow.textContent = game.eyebrow || 'SAMASIHAT AFTER DARK';
      this.brandTitle.textContent = game.title;
      this.currentGame = game.mount(this.content, {
        reducedMotion: this.reducedMotion,
        onExit: () => this.close()
      });
      return true;
    }

    open(gameId, trigger) {
      if (!this.dialog || !gameId) return;
      this.trigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
      this.setPageInert(true);
      this.dialog.showModal();
      document.documentElement.classList.add('has-arcade-dialog');
      const launched = this.launch(gameId);
      if (!launched) this.focusFirst();
      else this.currentGame?.focus?.();
    }

    close() {
      if (this.dialog?.open) this.dialog.close();
    }

    focusFirst() {
      requestAnimationFrame(() => {
        const target = this.dialog.querySelector('button:not([disabled]), [tabindex="0"]');
        target?.focus({ preventScroll: true });
      });
    }

    setPageInert(inert) {
      const targets = Array.from(document.querySelectorAll('[data-dialog-inert]'));
      if (inert) {
        this.inertRecords = targets.map((element) => ({
          element,
          hadInert: element.hasAttribute('inert'),
          ariaHidden: element.getAttribute('aria-hidden')
        }));
        targets.forEach((element) => {
          element.setAttribute('inert', '');
          element.setAttribute('aria-hidden', 'true');
        });
        return;
      }

      this.inertRecords.forEach(({ element, hadInert, ariaHidden }) => {
        if (!hadInert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      this.inertRecords = [];
    }

    handleKeydown(event) {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(this.dialog.querySelectorAll(focusableSelector))
        .filter((element) => !element.hidden && !element.closest('[inert]') && element.offsetParent !== null);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    handleCancel(event) {
      event.preventDefault();
      this.close();
    }

    handleBackdropClick(event) {
      if (event.target === this.dialog) this.close();
    }

    handleClose() {
      if (this.currentGame?.destroy) this.currentGame.destroy();
      this.currentGame = null;
      this.content.replaceChildren();
      this.dialog.dataset.arcadeView = '';
      this.surface.classList.remove('is-playing');
      this.setPageInert(false);
      document.documentElement.classList.remove('has-arcade-dialog');
      const trigger = this.trigger;
      this.trigger = null;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        requestAnimationFrame(() => {
          if (trigger.isConnected) trigger.focus({ preventScroll: true });
        });
      }
    }
  }

  if (!validateGameHotspots()) {
    console.warn('The Sitting Room must contain exactly three direct game hotspots: Tikus Beat, Tikus Slider and Tikus Rush.');
  }

  let controller = null;
  global.TikusArcade = Object.freeze({
    open(gameId, trigger) {
      controller?.open(gameId, trigger);
    },
    close() {
      controller?.close();
    },
    get isReady() {
      return Boolean(controller);
    }
  });

  function init() {
    controller = new GameDialogController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
