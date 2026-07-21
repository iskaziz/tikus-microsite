(function registerTikusArcade(global) {
  'use strict';

  const HOTSPOT_ID = 'tikus-arcade';
  const HOTSPOT_REPLACEMENTS = new Set(['main-sofa', 'logic-game', 'tikus-rush', 'tikus-beat', HOTSPOT_ID]);
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

  function patchArcadeHotspot() {
    const content = global.TIKUS_CONTENT;
    const room = content?.scenes?.['sitting-room'];
    if (!room || !Array.isArray(room.hotspots) || room.hotspots.length === 0) return false;

    let replacementIndex = room.hotspots.findIndex((hotspot) => hotspot && HOTSPOT_REPLACEMENTS.has(hotspot.id));
    if (replacementIndex < 0) replacementIndex = room.hotspots.findIndex((hotspot) => hotspot?.type === 'game' || hotspot?.type === 'arcade-hub');
    if (replacementIndex < 0) replacementIndex = room.hotspots.length - 1;

    const previous = room.hotspots[replacementIndex] || {};
    room.hotspots.splice(replacementIndex, 1, {
      ...previous,
      id: HOTSPOT_ID,
      type: 'arcade-hub',
      x: Number.isFinite(previous.x) ? previous.x : 72,
      y: Number.isFinite(previous.y) ? previous.y : 68,
      label: 'Open the TIKUS Arcade and choose a game',
      subject: 'TIKUS Arcade',
      eyebrow: 'TWO SPOILER-SAFE CHALLENGES',
      title: 'TIKUS Arcade',
      body: 'Choose Tikus Rush or Tikus Beat. Both games are non-canonical and reveal no story outcomes.'
    });

    // Remove any extra runtime game hotspots left by older integrations.
    room.hotspots = room.hotspots.filter((hotspot, index, all) => {
      if (!hotspot) return false;
      if (hotspot.id === HOTSPOT_ID) return index === all.findIndex((item) => item?.id === HOTSPOT_ID);
      if (hotspot.type === 'game' || hotspot.id === 'tikus-beat' || hotspot.id === 'tikus-rush' || hotspot.id === 'logic-game') return false;
      return true;
    });

    return room.hotspots.length === 3;
  }

  class ArcadeController {
    constructor() {
      this.dialog = null;
      this.surface = null;
      this.content = null;
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
      dialog.id = 'tikus-arcade-dialog';
      dialog.setAttribute('aria-labelledby', 'tikus-arcade-title');
      dialog.setAttribute('aria-describedby', 'tikus-arcade-description');

      const surface = create('article', 'tikus-arcade-dialog__surface');
      const topbar = create('header', 'tikus-arcade-dialog__topbar');
      const brand = create('div', 'tikus-arcade-dialog__brand');
      brand.append(
        create('p', 'tikus-arcade-dialog__eyebrow', 'SAMASIHAT AFTER DARK'),
        create('h2', 'tikus-arcade-dialog__title', 'TIKUS Arcade')
      );
      brand.querySelector('h2').id = 'tikus-arcade-title';
      const closeButton = create('button', 'tikus-arcade-dialog__close', '×');
      closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Close TIKUS Arcade and return to the Sitting Room');
      closeButton.addEventListener('click', () => this.close());
      topbar.append(brand, closeButton);

      const content = create('div', 'tikus-arcade-dialog__content');
      content.dataset.arcadeContent = '';
      const description = create('p', 'visually-hidden', 'Choose and play one of the spoiler-safe TIKUS arcade games.');
      description.id = 'tikus-arcade-description';
      surface.append(topbar, content, description);
      dialog.append(surface);
      document.body.append(dialog);

      this.dialog = dialog;
      this.surface = surface;
      this.content = content;
      this.closeButton = closeButton;

      dialog.addEventListener('keydown', this.handleKeydown);
      dialog.addEventListener('cancel', this.handleCancel);
      dialog.addEventListener('click', this.handleBackdropClick);
      dialog.addEventListener('close', this.handleClose);
      this.renderHub();
    }

    getGames() {
      return ['rush', 'beat']
        .map((id) => global.TikusGames?.[id])
        .filter(Boolean);
    }

    renderHub() {
      if (this.currentGame?.destroy) this.currentGame.destroy();
      this.currentGame = null;
      this.dialog.dataset.arcadeView = 'hub';
      this.surface.classList.remove('is-playing');

      const hub = create('section', 'tikus-arcade-hub');
      const intro = create('header', 'tikus-arcade-hub__intro');
      intro.append(
        create('p', 'tikus-arcade-hub__kicker', 'CHOOSE YOUR CHALLENGE'),
        create('h3', 'tikus-arcade-hub__headline', 'Two games. One house. No spoilers.'),
        create('p', 'tikus-arcade-hub__copy', 'Both games are non-canonical arcade diversions inspired by the visual world of TIKUS.')
      );

      const grid = create('div', 'tikus-arcade-hub__grid');
      this.getGames().forEach((game, index) => {
        const card = create('button', `tikus-game-card tikus-game-card--${game.accent}`);
        card.type = 'button';
        card.dataset.gameId = game.id;
        card.style.setProperty('--game-card-index', String(index));
        card.setAttribute('aria-label', `Play ${game.title}. ${game.description}`);

        const visual = create('span', 'tikus-game-card__visual');
        visual.setAttribute('aria-hidden', 'true');
        if (game.id === 'rush') {
          visual.innerHTML = `
            <span class="tikus-game-card__rings"></span>
            <span class="tikus-game-card__mouse tikus-game-card__mouse--one"></span>
            <span class="tikus-game-card__mouse tikus-game-card__mouse--two"></span>
            <span class="tikus-game-card__spark"></span>`;
        } else {
          visual.innerHTML = `
            <span class="tikus-game-card__lanes"></span>
            <span class="tikus-game-card__falling-shape tikus-game-card__falling-shape--one"></span>
            <span class="tikus-game-card__falling-shape tikus-game-card__falling-shape--two"></span>
            <span class="tikus-game-card__pulse"></span>`;
        }

        const body = create('span', 'tikus-game-card__body');
        body.append(
          create('span', 'tikus-game-card__eyebrow', game.eyebrow),
          create('strong', 'tikus-game-card__title', game.title),
          create('span', 'tikus-game-card__description', game.description)
        );
        const meta = create('span', 'tikus-game-card__meta');
        meta.innerHTML = `<span>${game.duration}</span><span>${game.controls}</span><span>Best ${game.readBest()}</span>`;
        body.append(meta, create('span', 'tikus-game-card__cta', 'Play now →'));
        card.append(visual, body);
        card.addEventListener('click', () => this.launch(game.id));
        grid.append(card);
      });

      hub.append(intro, grid);
      this.content.replaceChildren(hub);
    }

    launch(gameId) {
      const game = global.TikusGames?.[gameId];
      if (!game) return;
      if (this.currentGame?.destroy) this.currentGame.destroy();
      this.dialog.dataset.arcadeView = gameId;
      this.surface.classList.add('is-playing');
      this.content.replaceChildren();
      this.currentGame = game.mount(this.content, {
        reducedMotion: this.reducedMotion,
        onExit: () => {
          this.renderHub();
          this.focusFirst();
        }
      });
      this.currentGame?.focus?.();
    }

    open(trigger) {
      if (!this.dialog) return;
      this.trigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
      this.renderHub();
      this.setPageInert(true);
      this.dialog.showModal();
      document.documentElement.classList.add('has-arcade-dialog');
      this.focusFirst();
    }

    close() {
      if (this.dialog?.open) this.dialog.close();
    }

    focusFirst() {
      requestAnimationFrame(() => {
        const target = this.dialog.querySelector('[data-game-id]') || this.dialog.querySelector('button:not([disabled])');
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
        .filter((element) => !element.hidden && element.offsetParent !== null);
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
      this.renderHub();
      this.setPageInert(false);
      document.documentElement.classList.remove('has-arcade-dialog');
      const trigger = this.trigger;
      this.trigger = null;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    }
  }

  const patchSucceeded = patchArcadeHotspot();
  if (!patchSucceeded) {
    console.warn('TIKUS Arcade could not preserve the required three-hotspot Sitting Room layout.');
  }

  let controller = null;
  global.TikusArcade = Object.freeze({
    open(trigger) {
      controller?.open(trigger);
    },
    close() {
      controller?.close();
    },
    get isReady() {
      return Boolean(controller);
    }
  });

  function init() {
    controller = new ArcadeController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
