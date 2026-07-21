(function registerTikusArcadeGame(global) {
  'use strict';

  const STYLE_PATH = 'css/game.css?v=arcade-v1';
  const STORAGE_KEY = 'tikus-arcade-best-v1';
  const HOTSPOT_ID = 'logic-game';
  const GAME_DURATION_SECONDS = 30;
  const GREY_POINTS = 2;
  const GOLD_POINTS = 10;
  const GOLD_CHANCE = 0.13;

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof textContent === 'string') element.textContent = textContent;
    return element;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function injectStylesheet() {
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) =>
      /(?:^|\/)css\/game\.css(?:\?|$)/.test(link.getAttribute('href') || '')
    );

    if (existing) {
      existing.href = STYLE_PATH;
      existing.dataset.tikusGameStyles = 'true';
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLE_PATH;
    link.dataset.tikusGameStyles = 'true';
    document.head.append(link);
  }

  function replaceSittingRoomHotspot() {
    const content = global.TIKUS_CONTENT;
    const room = content && content.scenes && content.scenes['sitting-room'];

    if (!room || !Array.isArray(room.hotspots) || room.hotspots.length === 0) return false;

    let existingIndex = room.hotspots.findIndex((hotspot) =>
      hotspot && (
        hotspot.id === HOTSPOT_ID ||
        hotspot.id === 'main-sofa' ||
        hotspot.type === 'game'
      )
    );

    if (existingIndex < 0) existingIndex = 0;

    const previous = room.hotspots[existingIndex] || {};
    room.hotspots[existingIndex] = {
      ...previous,
      id: HOTSPOT_ID,
      type: 'game',
      gameId: 'tikus-rush',
      x: Number.isFinite(previous.x) ? previous.x : 72,
      y: Number.isFinite(previous.y) ? previous.y : 68,
      label: 'Play Tikus Rush, a 30-second mouse-catching arcade game',
      subject: 'Arcade game',
      eyebrow: '30 SECOND CHALLENGE',
      title: 'Tikus Rush',
      body: 'Catch as many mice as possible before time runs out. Grey mice are worth 2 points. Rare gold mice are worth 10 points.'
    };

    return true;
  }

  function mouseSvg(type) {
    const isGold = type === 'gold';
    const body = isGold ? '#d6a83e' : '#8f8a80';
    const light = isGold ? '#f3d878' : '#c9c2b6';
    const ear = isGold ? '#8f5b15' : '#5f5953';

    return `
      <svg viewBox="0 0 120 72" aria-hidden="true" focusable="false">
        <path d="M25 37 C10 35, 3 42, 8 55 C12 65, 25 61, 28 52" fill="none" stroke="#1a1110" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="61" cy="36" rx="36" ry="25" fill="${body}" stroke="#1a1110" stroke-width="4"/>
        <path d="M76 18 C93 18, 108 27, 113 36 C108 46, 93 54, 76 54 C86 46, 86 26, 76 18Z" fill="${body}" stroke="#1a1110" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="83" cy="18" r="11" fill="${ear}" stroke="#1a1110" stroke-width="4"/>
        <circle cx="83" cy="54" r="11" fill="${ear}" stroke="#1a1110" stroke-width="4"/>
        <circle cx="83" cy="18" r="4.5" fill="${light}"/>
        <circle cx="83" cy="54" r="4.5" fill="${light}"/>
        <ellipse cx="55" cy="29" rx="16" ry="8" fill="${light}" opacity=".43"/>
        <circle cx="98" cy="29" r="3.2" fill="#120b0b"/>
        <circle cx="98" cy="43" r="3.2" fill="#120b0b"/>
        <circle cx="113" cy="36" r="4.5" fill="#120b0b"/>
        <path d="M106 31 L117 25 M108 34 L119 32 M106 41 L117 47 M108 38 L119 40" stroke="#f3eadc" stroke-width="2" stroke-linecap="round"/>
        ${isGold ? '<path d="M52 22 l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#fff2b4" stroke="#6c4310" stroke-width="2"/>' : ''}
      </svg>`;
  }

  function createGameDialog() {
    const existing = document.getElementById('logic-game-dialog');
    if (existing) return existing;

    const dialog = createElement('dialog', 'arcade-dialog');
    dialog.id = 'logic-game-dialog';
    dialog.setAttribute('aria-labelledby', 'arcade-title');
    dialog.setAttribute('aria-describedby', 'arcade-description');

    const shell = createElement('div', 'arcade');
    shell.dataset.arcadeRoot = '';

    const header = createElement('header', 'arcade__header');
    const heading = createElement('div', 'arcade__heading');
    const eyebrow = createElement('p', 'arcade__eyebrow', 'A TIKUS ARCADE CHALLENGE');
    const title = createElement('h2', 'arcade__title', 'Tikus Rush');
    title.id = 'arcade-title';
    heading.append(eyebrow, title);

    const closeButton = createElement('button', 'arcade__close', '×');
    closeButton.type = 'button';
    closeButton.dataset.arcadeClose = '';
    closeButton.setAttribute('aria-label', 'Close game and return to the Sitting Room');
    header.append(heading, closeButton);

    const hud = createElement('div', 'arcade__hud');
    hud.setAttribute('aria-label', 'Game status');

    const scorePanel = createElement('div', 'arcade__hud-item');
    scorePanel.innerHTML = '<span class="arcade__hud-label">Score</span><strong class="arcade__hud-value" data-arcade-score>0</strong>';
    const timePanel = createElement('div', 'arcade__hud-item arcade__hud-item--time');
    timePanel.innerHTML = `<span class="arcade__hud-label">Time</span><strong class="arcade__hud-value" data-arcade-time>${GAME_DURATION_SECONDS}</strong>`;
    const bestPanel = createElement('div', 'arcade__hud-item');
    bestPanel.innerHTML = '<span class="arcade__hud-label">Best</span><strong class="arcade__hud-value" data-arcade-best>0</strong>';
    hud.append(scorePanel, timePanel, bestPanel);

    const arena = createElement('section', 'arcade__arena');
    arena.dataset.arcadeArena = '';
    arena.setAttribute('aria-label', 'Mouse-catching play area');

    const rings = createElement('div', 'arcade__rings');
    rings.setAttribute('aria-hidden', 'true');
    const grain = createElement('div', 'arcade__grain');
    grain.setAttribute('aria-hidden', 'true');
    const miceLayer = createElement('div', 'arcade__mice');
    miceLayer.dataset.arcadeMice = '';

    const intro = createElement('div', 'arcade__overlay arcade__overlay--intro');
    intro.dataset.arcadeIntro = '';
    const introCard = createElement('div', 'arcade__card');
    const description = createElement('p', 'arcade__description', 'Mice are loose inside Samasihat. Catch as many as you can before the 30-second timer reaches zero.');
    description.id = 'arcade-description';

    const rules = createElement('div', 'arcade__rules');
    const greyRule = createElement('div', 'arcade__rule');
    greyRule.innerHTML = `<span class="arcade__rule-mouse arcade__rule-mouse--grey">${mouseSvg('grey')}</span><span><strong>Grey mouse</strong><small>2 points</small></span>`;
    const goldRule = createElement('div', 'arcade__rule');
    goldRule.innerHTML = `<span class="arcade__rule-mouse arcade__rule-mouse--gold">${mouseSvg('gold')}</span><span><strong>Gold mouse ★</strong><small>10 points</small></span>`;
    rules.append(greyRule, goldRule);

    const startButton = createElement('button', 'arcade__primary', 'Start 30-second game');
    startButton.type = 'button';
    startButton.dataset.arcadeStart = '';
    introCard.append(description, rules, startButton);
    intro.append(introCard);

    const result = createElement('div', 'arcade__overlay arcade__overlay--result');
    result.dataset.arcadeResult = '';
    result.hidden = true;
    const resultCard = createElement('div', 'arcade__card arcade__card--result');
    const resultEyebrow = createElement('p', 'arcade__result-eyebrow', 'TIME IS UP');
    const resultTitle = createElement('h3', 'arcade__result-title', 'You caught the rush.');
    const finalScore = createElement('p', 'arcade__final-score');
    finalScore.innerHTML = '<span>Final score</span><strong data-arcade-final-score>0</strong>';
    const breakdown = createElement('p', 'arcade__breakdown');
    breakdown.dataset.arcadeBreakdown = '';
    const bestMessage = createElement('p', 'arcade__best-message');
    bestMessage.dataset.arcadeBestMessage = '';
    bestMessage.setAttribute('aria-live', 'polite');
    const resultActions = createElement('div', 'arcade__result-actions');
    const replayButton = createElement('button', 'arcade__primary', 'Play again');
    replayButton.type = 'button';
    replayButton.dataset.arcadeReplay = '';
    const returnButton = createElement('button', 'arcade__secondary', 'Return to Sitting Room');
    returnButton.type = 'button';
    returnButton.dataset.arcadeClose = '';
    resultActions.append(replayButton, returnButton);
    resultCard.append(resultEyebrow, resultTitle, finalScore, breakdown, bestMessage, resultActions);
    result.append(resultCard);

    const keyboardHelp = createElement('p', 'arcade__keyboard-help', 'Tap or click a mouse to catch it. Keyboard players can Tab to a mouse and press Enter or Space.');

    arena.append(rings, grain, miceLayer, intro, result);
    shell.append(header, hud, arena, keyboardHelp);
    dialog.append(shell);
    document.body.append(dialog);
    return dialog;
  }

  class TikusArcadeGame {
    constructor(dialog) {
      this.dialog = dialog;
      this.root = dialog.querySelector('[data-arcade-root]');
      this.arena = dialog.querySelector('[data-arcade-arena]');
      this.miceLayer = dialog.querySelector('[data-arcade-mice]');
      this.intro = dialog.querySelector('[data-arcade-intro]');
      this.result = dialog.querySelector('[data-arcade-result]');
      this.scoreElement = dialog.querySelector('[data-arcade-score]');
      this.timeElement = dialog.querySelector('[data-arcade-time]');
      this.bestElement = dialog.querySelector('[data-arcade-best]');
      this.finalScoreElement = dialog.querySelector('[data-arcade-final-score]');
      this.breakdownElement = dialog.querySelector('[data-arcade-breakdown]');
      this.bestMessageElement = dialog.querySelector('[data-arcade-best-message]');
      this.startButton = dialog.querySelector('[data-arcade-start]');
      this.replayButton = dialog.querySelector('[data-arcade-replay]');
      this.lastTrigger = null;
      this.isPlaying = false;
      this.score = 0;
      this.greyCaught = 0;
      this.goldCaught = 0;
      this.best = this.readBest();
      this.activeMice = new Set();
      this.spawnTimeout = 0;
      this.timerFrame = 0;
      this.endAt = 0;
      this.lastShownSecond = GAME_DURATION_SECONDS;
      this.reducedMotionQuery = global.matchMedia ? global.matchMedia('(prefers-reduced-motion: reduce)') : null;
      this.boundVisibility = this.handleVisibility.bind(this);
      this.bindEvents();
      this.renderBest();
    }

    bindEvents() {
      this.dialog.addEventListener('click', (event) => {
        const closeButton = event.target.closest('[data-arcade-close]');
        if (closeButton) {
          this.close();
          return;
        }

        if (event.target.closest('[data-arcade-start]') || event.target.closest('[data-arcade-replay]')) {
          this.start();
        }
      });

      this.dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        this.close();
      });

      this.dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.close();
          return;
        }
        if (event.key === 'Tab') this.trapFocus(event);
      });

      document.addEventListener('visibilitychange', this.boundVisibility);
    }

    open(trigger) {
      this.lastTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
      this.resetToIntro();
      this.renderBest();
      document.documentElement.classList.add('has-arcade-dialog');
      document.body.classList.add('has-arcade-dialog');

      if (typeof this.dialog.showModal === 'function') {
        if (!this.dialog.open) this.dialog.showModal();
      } else {
        this.dialog.setAttribute('open', '');
      }

      global.requestAnimationFrame(() => this.startButton.focus());
    }

    close() {
      this.stopRound();
      if (this.dialog.open && typeof this.dialog.close === 'function') {
        this.dialog.close();
      } else {
        this.dialog.removeAttribute('open');
      }
      document.documentElement.classList.remove('has-arcade-dialog');
      document.body.classList.remove('has-arcade-dialog');

      const focusTarget = this.lastTrigger;
      this.lastTrigger = null;
      if (focusTarget && typeof focusTarget.focus === 'function') {
        global.requestAnimationFrame(() => focusTarget.focus());
      }
    }

    resetToIntro() {
      this.stopRound();
      this.score = 0;
      this.greyCaught = 0;
      this.goldCaught = 0;
      this.scoreElement.textContent = '0';
      this.timeElement.textContent = String(GAME_DURATION_SECONDS);
      this.intro.hidden = false;
      this.result.hidden = true;
      this.root.classList.remove('is-playing', 'is-finished', 'is-new-best');
    }

    start() {
      this.stopRound();
      this.score = 0;
      this.greyCaught = 0;
      this.goldCaught = 0;
      this.scoreElement.textContent = '0';
      this.timeElement.textContent = String(GAME_DURATION_SECONDS);
      this.intro.hidden = true;
      this.result.hidden = true;
      this.root.classList.remove('is-finished', 'is-new-best');
      this.root.classList.add('is-playing');
      this.isPlaying = true;
      this.lastShownSecond = GAME_DURATION_SECONDS;
      this.endAt = performance.now() + GAME_DURATION_SECONDS * 1000;
      this.scheduleSpawn(80);
      this.tickTimer();
      this.arena.focus({ preventScroll: true });
    }

    stopRound() {
      this.isPlaying = false;
      global.clearTimeout(this.spawnTimeout);
      global.cancelAnimationFrame(this.timerFrame);
      this.spawnTimeout = 0;
      this.timerFrame = 0;
      this.activeMice.forEach((mouse) => this.removeMouse(mouse));
      this.activeMice.clear();
      this.miceLayer.replaceChildren();
    }

    tickTimer() {
      if (!this.isPlaying) return;
      const remainingMs = Math.max(0, this.endAt - performance.now());
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      if (remainingSeconds !== this.lastShownSecond) {
        this.lastShownSecond = remainingSeconds;
        this.timeElement.textContent = String(remainingSeconds);
        this.timeElement.parentElement.classList.toggle('is-urgent', remainingSeconds <= 5);
      }

      if (remainingMs <= 0) {
        this.finish();
        return;
      }

      this.timerFrame = global.requestAnimationFrame(() => this.tickTimer());
    }

    scheduleSpawn(delay) {
      global.clearTimeout(this.spawnTimeout);
      if (!this.isPlaying) return;

      this.spawnTimeout = global.setTimeout(() => {
        if (!this.isPlaying) return;
        const elapsed = GAME_DURATION_SECONDS * 1000 - Math.max(0, this.endAt - performance.now());
        const progress = clamp(elapsed / (GAME_DURATION_SECONDS * 1000), 0, 1);
        const targetActive = Math.round(3 + progress * 3);

        if (this.activeMice.size < targetActive) this.spawnMouse();
        if (progress > 0.45 && this.activeMice.size < targetActive - 1 && Math.random() > 0.52) {
          this.spawnMouse();
        }

        const nextDelay = 500 - progress * 185 + Math.random() * 130;
        this.scheduleSpawn(nextDelay);
      }, delay);
    }

    spawnMouse() {
      const bounds = this.arena.getBoundingClientRect();
      if (bounds.width < 40 || bounds.height < 40) return;

      const type = Math.random() < GOLD_CHANCE ? 'gold' : 'grey';
      const points = type === 'gold' ? GOLD_POINTS : GREY_POINTS;
      const mouse = createElement('button', `arcade-mouse arcade-mouse--${type}`);
      mouse.type = 'button';
      mouse.dataset.mouseType = type;
      mouse.dataset.points = String(points);
      mouse.setAttribute('aria-label', `${type === 'gold' ? 'Gold' : 'Grey'} mouse, worth ${points} points`);
      mouse.innerHTML = mouseSvg(type) + `<span class="arcade-mouse__points" aria-hidden="true">${type === 'gold' ? '★ 10' : '2'}</span>`;

      const geometry = this.createPath(bounds);
      mouse.style.setProperty('--mouse-size', `${geometry.size}px`);
      mouse.style.setProperty('--start-x', `${geometry.startX}px`);
      mouse.style.setProperty('--start-y', `${geometry.startY}px`);
      mouse.style.setProperty('--end-x', `${geometry.endX}px`);
      mouse.style.setProperty('--end-y', `${geometry.endY}px`);
      mouse.style.setProperty('--mouse-angle', `${geometry.angle}deg`);
      mouse.style.setProperty('--run-duration', `${geometry.duration}ms`);
      mouse.style.setProperty('--bob-duration', `${360 + Math.random() * 180}ms`);

      mouse.addEventListener('click', (event) => this.catchMouse(mouse, event));
      mouse.addEventListener('animationend', (event) => {
        if (event.animationName === 'arcade-mouse-run' || event.animationName === 'arcade-mouse-pop-in') {
          this.removeMouse(mouse);
        }
      });

      this.activeMice.add(mouse);
      this.miceLayer.append(mouse);
      global.requestAnimationFrame(() => mouse.classList.add(this.prefersReducedMotion() ? 'is-static' : 'is-running'));

      if (this.prefersReducedMotion()) {
        global.setTimeout(() => this.removeMouse(mouse), geometry.duration);
      }
    }

    createPath(bounds) {
      const width = bounds.width;
      const height = bounds.height;
      const size = clamp(Math.min(width, height) * 0.12, 48, 78);
      const margin = size * 1.1;

      if (this.prefersReducedMotion()) {
        const x = Math.random() * Math.max(1, width - size);
        const y = Math.random() * Math.max(1, height - size);
        return {
          size,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          angle: Math.random() > 0.5 ? 0 : 180,
          duration: 1250 + Math.random() * 450
        };
      }

      const edge = Math.floor(Math.random() * 4);
      let startX;
      let startY;
      let endX;
      let endY;

      if (edge === 0 || edge === 1) {
        startX = edge === 0 ? -margin : width + margin;
        endX = edge === 0 ? width + margin : -margin;
        startY = Math.random() * Math.max(1, height - size);
        endY = clamp(startY + (Math.random() - 0.5) * height * 0.62, 0, Math.max(0, height - size));
      } else {
        startY = edge === 2 ? -margin : height + margin;
        endY = edge === 2 ? height + margin : -margin;
        startX = Math.random() * Math.max(1, width - size);
        endX = clamp(startX + (Math.random() - 0.5) * width * 0.72, 0, Math.max(0, width - size));
      }

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.hypot(dx, dy);
      const elapsed = GAME_DURATION_SECONDS * 1000 - Math.max(0, this.endAt - performance.now());
      const progress = clamp(elapsed / (GAME_DURATION_SECONDS * 1000), 0, 1);
      const speed = (width < 560 ? 175 : 220) + progress * 105 + Math.random() * 85;
      const duration = clamp((distance / speed) * 1000, 1550, 4700);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return { size, startX, startY, endX, endY, angle, duration };
    }

    catchMouse(mouse, event) {
      if (!this.isPlaying || !this.activeMice.has(mouse) || mouse.classList.contains('is-caught')) return;

      const points = Number(mouse.dataset.points) || 0;
      const type = mouse.dataset.mouseType;
      this.score += points;
      if (type === 'gold') this.goldCaught += 1;
      else this.greyCaught += 1;
      this.scoreElement.textContent = String(this.score);
      this.scoreElement.classList.remove('is-bumped');
      void this.scoreElement.offsetWidth;
      this.scoreElement.classList.add('is-bumped');

      mouse.classList.add('is-caught');
      mouse.disabled = true;
      this.showPointBurst(mouse, points, event);
      global.setTimeout(() => this.removeMouse(mouse), 170);
    }

    showPointBurst(mouse, points, event) {
      const arenaRect = this.arena.getBoundingClientRect();
      const mouseRect = mouse.getBoundingClientRect();
      const burst = createElement('span', `arcade__point-burst${points === GOLD_POINTS ? ' arcade__point-burst--gold' : ''}`, `+${points}`);
      const clientX = event && Number.isFinite(event.clientX) && event.clientX > 0 ? event.clientX : mouseRect.left + mouseRect.width / 2;
      const clientY = event && Number.isFinite(event.clientY) && event.clientY > 0 ? event.clientY : mouseRect.top + mouseRect.height / 2;
      burst.style.left = `${clientX - arenaRect.left}px`;
      burst.style.top = `${clientY - arenaRect.top}px`;
      this.arena.append(burst);
      burst.addEventListener('animationend', () => burst.remove(), { once: true });
    }

    removeMouse(mouse) {
      if (!mouse) return;
      this.activeMice.delete(mouse);
      if (mouse.isConnected) mouse.remove();
    }

    finish() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      global.clearTimeout(this.spawnTimeout);
      global.cancelAnimationFrame(this.timerFrame);
      this.timeElement.textContent = '0';
      this.timeElement.parentElement.classList.remove('is-urgent');
      this.activeMice.forEach((mouse) => {
        mouse.disabled = true;
        mouse.classList.add('is-finished');
        global.setTimeout(() => this.removeMouse(mouse), 220);
      });

      const previousBest = this.best;
      const isNewBest = this.score > previousBest;
      if (isNewBest) {
        this.best = this.score;
        this.writeBest(this.best);
      }

      this.renderBest();
      this.finalScoreElement.textContent = String(this.score);
      this.breakdownElement.textContent = `${this.greyCaught} grey mice × ${GREY_POINTS} points · ${this.goldCaught} gold mice × ${GOLD_POINTS} points`;
      this.bestMessageElement.textContent = isNewBest
        ? 'New best score.'
        : previousBest > 0
          ? `Best score: ${previousBest}.`
          : 'Play again to set a higher score.';
      this.root.classList.remove('is-playing');
      this.root.classList.add('is-finished');
      this.root.classList.toggle('is-new-best', isNewBest);
      this.result.hidden = false;
      global.requestAnimationFrame(() => this.replayButton.focus());
    }

    renderBest() {
      this.bestElement.textContent = String(this.best);
    }

    readBest() {
      try {
        const raw = global.localStorage.getItem(STORAGE_KEY);
        const value = Number.parseInt(raw || '0', 10);
        return Number.isFinite(value) && value > 0 ? value : 0;
      } catch (error) {
        return 0;
      }
    }

    writeBest(value) {
      try {
        global.localStorage.setItem(STORAGE_KEY, String(value));
      } catch (error) {
        // The game remains fully playable when storage is unavailable.
      }
    }

    prefersReducedMotion() {
      return Boolean(this.reducedMotionQuery && this.reducedMotionQuery.matches);
    }

    handleVisibility() {
      if (!this.isPlaying || document.visibilityState !== 'visible') return;
      if (performance.now() >= this.endAt) this.finish();
    }

    trapFocus(event) {
      const focusable = Array.from(this.dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => !element.hidden && element.offsetParent !== null);

      if (focusable.length === 0) return;
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
  }

  function patchHotspotModal(game) {
    const microsite = global.TikusMicrosite;
    const modal = microsite && microsite.modal;
    if (!modal || typeof modal.open !== 'function' || modal.__tikusArcadePatched) return false;

    const originalOpen = modal.open.bind(modal);
    modal.open = function openPatched(content, trigger) {
      if (content && (
        content.id === HOTSPOT_ID ||
        content.type === 'game' ||
        content.gameId === 'tikus-rush'
      )) {
        game.open(trigger);
        return undefined;
      }
      return originalOpen(content, trigger);
    };
    modal.__tikusArcadePatched = true;
    return true;
  }

  function installFallbackClick(game) {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-hotspot-id="logic-game"], [data-hotspot-id="main-sofa"], [data-game-id="tikus-rush"]');
      if (!trigger) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      game.open(trigger);
    }, true);
  }

  function initialise() {
    injectStylesheet();
    replaceSittingRoomHotspot();
    const dialog = createGameDialog();
    const game = new TikusArcadeGame(dialog);
    installFallbackClick(game);

    let attempts = 0;
    const tryPatch = () => {
      if (patchHotspotModal(game)) return;
      attempts += 1;
      if (attempts < 120) global.requestAnimationFrame(tryPatch);
    };
    tryPatch();

    global.TikusArcadeGame = game;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})(window);
