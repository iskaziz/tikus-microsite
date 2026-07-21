(function registerTikusRhythmGame(global) {
  'use strict';

  const STYLE_PATH = 'css/rhythm-game.css?v=rhythm-v1';
  const STORAGE_KEY = 'tikus-rhythm-best-v1';
  const HOTSPOT_ID = 'rhythm-game';
  const GAME_ID = 'tikus-beat';
  const GAME_DURATION_MS = 60_000;
  const HIT_WINDOW_MS = 420;

  /*
   * Replace the placeholder shapes later by setting an image path.
   * Example: { id: 'knife', label: 'Knife', text: '', image: 'assets/images/ui/knife.webp' }
   */
  const SYMBOLS = Object.freeze([
    Object.freeze({ id: 'circle', label: 'Circle', text: '●', image: '' }),
    Object.freeze({ id: 'triangle', label: 'Triangle', text: '▲', image: '' }),
    Object.freeze({ id: 'square', label: 'Square', text: '■', image: '' }),
    Object.freeze({ id: 'diamond', label: 'Diamond', text: '◆', image: '' }),
    Object.freeze({ id: 'star', label: 'Star', text: '★', image: '' })
  ]);

  const KEY_TO_LANE = Object.freeze({
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    a: 0,
    s: 1,
    d: 2,
    f: 3,
    g: 4
  });

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof textContent === 'string') element.textContent = textContent;
    return element;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function easeInCubic(value) {
    return value * value * value;
  }

  function injectStylesheet() {
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) =>
      /(?:^|\/)css\/rhythm-game\.css(?:\?|$)/.test(link.getAttribute('href') || '')
    );

    if (existing) {
      existing.href = STYLE_PATH;
      existing.dataset.tikusRhythmStyles = 'true';
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLE_PATH;
    link.dataset.tikusRhythmStyles = 'true';
    document.head.append(link);
  }

  function addRhythmHotspot() {
    const content = global.TIKUS_CONTENT;
    const room = content && content.scenes && content.scenes['sitting-room'];
    if (!room || !Array.isArray(room.hotspots)) return false;

    const existing = room.hotspots.find((hotspot) => hotspot && hotspot.id === HOTSPOT_ID);
    if (existing) return true;

    room.hotspots.push({
      id: HOTSPOT_ID,
      type: 'rhythm-game',
      gameId: GAME_ID,
      x: 55,
      y: 78,
      label: 'Play Tikus Beat, a 60-second five-lane rhythm game',
      subject: 'Rhythm game',
      eyebrow: '60 SECOND CHALLENGE',
      title: 'Tikus Beat',
      body: 'Match each falling symbol with the correct control before it passes the strike line. The tempo becomes faster throughout the round.'
    });

    return true;
  }

  function refreshActiveScene() {
    const microsite = global.TikusMicrosite;
    const scenes = microsite && microsite.scenes;
    if (!scenes || !scenes.state || scenes.state.sceneId !== 'sitting-room') return;

    const room = global.TIKUS_CONTENT && global.TIKUS_CONTENT.scenes['sitting-room'];
    if (!room) return;

    if (typeof scenes.renderHotspots === 'function') {
      scenes.renderHotspots(room.hotspots);
    }
    if (typeof scenes.syncInteractiveBounds === 'function') {
      scenes.syncInteractiveBounds();
    }
  }

  function createSymbolVisual(symbol, className) {
    const wrapper = createElement('span', className || 'rhythm-symbol');
    wrapper.setAttribute('aria-hidden', 'true');

    if (symbol.image) {
      const image = document.createElement('img');
      image.src = symbol.image;
      image.alt = '';
      image.decoding = 'async';
      image.draggable = false;
      wrapper.append(image);
    } else {
      wrapper.textContent = symbol.text;
    }

    return wrapper;
  }

  function createGameDialog() {
    const existing = document.getElementById('rhythm-game-dialog');
    if (existing) return existing;

    const dialog = createElement('dialog', 'rhythm-dialog');
    dialog.id = 'rhythm-game-dialog';
    dialog.setAttribute('aria-labelledby', 'rhythm-title');
    dialog.setAttribute('aria-describedby', 'rhythm-description');

    const game = createElement('section', 'rhythm-game');
    game.dataset.rhythmRoot = '';

    const background = createElement('div', 'rhythm-game__background');
    background.setAttribute('aria-hidden', 'true');
    background.append(
      createElement('span', 'rhythm-game__rings'),
      createElement('span', 'rhythm-game__grain')
    );

    const header = createElement('header', 'rhythm-game__header');
    const heading = createElement('div', 'rhythm-game__heading');
    const eyebrow = createElement('p', 'rhythm-game__eyebrow', 'A TIKUS RHYTHM CHALLENGE');
    const title = createElement('h2', 'rhythm-game__title', 'Tikus Beat');
    title.id = 'rhythm-title';
    heading.append(eyebrow, title);

    const closeButton = createElement('button', 'rhythm-game__close', '×');
    closeButton.type = 'button';
    closeButton.dataset.rhythmClose = '';
    closeButton.setAttribute('aria-label', 'Close Tikus Beat and return to the Sitting Room');
    header.append(heading, closeButton);

    const hud = createElement('div', 'rhythm-hud');
    hud.setAttribute('aria-label', 'Game status');
    hud.innerHTML = `
      <div class="rhythm-hud__item">
        <span class="rhythm-hud__label">Score</span>
        <strong class="rhythm-hud__value" data-rhythm-score>0</strong>
      </div>
      <div class="rhythm-hud__item rhythm-hud__item--time">
        <span class="rhythm-hud__label">Time</span>
        <strong class="rhythm-hud__value" data-rhythm-time>60</strong>
      </div>
      <div class="rhythm-hud__item">
        <span class="rhythm-hud__label">Combo</span>
        <strong class="rhythm-hud__value" data-rhythm-combo>0</strong>
      </div>
      <div class="rhythm-hud__item">
        <span class="rhythm-hud__label">Tempo</span>
        <strong class="rhythm-hud__value" data-rhythm-tempo>1.0×</strong>
      </div>`;

    const playArea = createElement('div', 'rhythm-play-area');

    const field = createElement('div', 'rhythm-field');
    field.dataset.rhythmField = '';
    field.setAttribute('aria-label', 'Five rhythm lanes. Match falling symbols at the strike line.');

    const lanes = createElement('div', 'rhythm-lanes');
    lanes.dataset.rhythmLanes = '';

    SYMBOLS.forEach((symbol, index) => {
      const lane = createElement('div', 'rhythm-lane');
      lane.dataset.rhythmLane = String(index);
      lane.style.setProperty('--lane-index', String(index));

      const laneLabel = createElement('span', 'rhythm-lane__label', symbol.label);
      laneLabel.setAttribute('aria-hidden', 'true');
      lane.append(laneLabel);
      lanes.append(lane);
    });

    const hitZone = createElement('div', 'rhythm-hit-zone');
    hitZone.setAttribute('aria-hidden', 'true');
    hitZone.innerHTML = '<span></span><strong>STRIKE</strong><span></span>';

    const feedback = createElement('div', 'rhythm-feedback');
    feedback.dataset.rhythmFeedback = '';
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');

    field.append(lanes, hitZone, feedback);

    const controls = createElement('div', 'rhythm-controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Rhythm symbol controls');

    SYMBOLS.forEach((symbol, index) => {
      const button = createElement('button', 'rhythm-control');
      button.type = 'button';
      button.dataset.rhythmControl = String(index);
      button.style.setProperty('--lane-index', String(index));
      button.setAttribute('aria-label', `Play ${symbol.label}. Keyboard ${index + 1} or ${'ASDFG'[index]}.`);

      const visual = createSymbolVisual(symbol, 'rhythm-control__symbol');
      const key = createElement('span', 'rhythm-control__key', `${index + 1} · ${'ASDFG'[index]}`);
      button.append(visual, key);
      controls.append(button);
    });

    playArea.append(field, controls);

    const intro = createElement('div', 'rhythm-overlay rhythm-overlay--intro');
    intro.dataset.rhythmIntro = '';
    const introCard = createElement('article', 'rhythm-card');
    const description = createElement(
      'p',
      'rhythm-card__description',
      'Five symbols fall through five lanes. Tap the matching symbol as it reaches the strike line. The pace accelerates for the full 60-second round.'
    );
    description.id = 'rhythm-description';

    const legend = createElement('div', 'rhythm-legend');
    SYMBOLS.forEach((symbol) => {
      const item = createElement('span', 'rhythm-legend__item');
      item.append(createSymbolVisual(symbol, 'rhythm-legend__symbol'), document.createTextNode(symbol.label));
      legend.append(item);
    });

    const startButton = createElement('button', 'rhythm-button rhythm-button--primary', 'Start 60-second game');
    startButton.type = 'button';
    startButton.dataset.rhythmStart = '';

    const help = createElement(
      'p',
      'rhythm-card__help',
      'Touch or click the five controls. Keyboard players may use 1–5 or A–G. Escape closes the game.'
    );
    introCard.append(description, legend, startButton, help);
    intro.append(introCard);

    const countdown = createElement('div', 'rhythm-overlay rhythm-overlay--countdown');
    countdown.dataset.rhythmCountdown = '';
    countdown.hidden = true;
    const countdownValue = createElement('strong', 'rhythm-countdown', '3');
    countdownValue.dataset.rhythmCountdownValue = '';
    countdown.append(countdownValue);

    const result = createElement('div', 'rhythm-overlay rhythm-overlay--result');
    result.dataset.rhythmResult = '';
    result.hidden = true;
    const resultCard = createElement('article', 'rhythm-card rhythm-card--result');
    const resultEyebrow = createElement('p', 'rhythm-card__eyebrow', 'ROUND COMPLETE');
    const resultTitle = createElement('h3', 'rhythm-card__title', 'The beat stopped.');
    const finalScore = createElement('p', 'rhythm-result-score');
    finalScore.innerHTML = 'Final score <strong data-rhythm-final-score>0</strong>';
    const resultStats = createElement('p', 'rhythm-result-stats');
    resultStats.dataset.rhythmResultStats = '';
    const bestMessage = createElement('p', 'rhythm-result-best');
    bestMessage.dataset.rhythmBestMessage = '';
    bestMessage.setAttribute('aria-live', 'polite');

    const resultActions = createElement('div', 'rhythm-result-actions');
    const replayButton = createElement('button', 'rhythm-button rhythm-button--primary', 'Play again');
    replayButton.type = 'button';
    replayButton.dataset.rhythmReplay = '';
    const returnButton = createElement('button', 'rhythm-button rhythm-button--secondary', 'Return to Sitting Room');
    returnButton.type = 'button';
    returnButton.dataset.rhythmClose = '';
    resultActions.append(replayButton, returnButton);

    resultCard.append(resultEyebrow, resultTitle, finalScore, resultStats, bestMessage, resultActions);
    result.append(resultCard);

    const liveStatus = createElement('p', 'visually-hidden');
    liveStatus.dataset.rhythmStatus = '';
    liveStatus.setAttribute('aria-live', 'polite');
    liveStatus.setAttribute('aria-atomic', 'true');

    game.append(background, header, hud, playArea, intro, countdown, result, liveStatus);
    dialog.append(game);
    document.body.append(dialog);
    return dialog;
  }

  class TikusRhythmGame {
    constructor(dialog) {
      this.dialog = dialog;
      this.root = dialog.querySelector('[data-rhythm-root]');
      this.field = dialog.querySelector('[data-rhythm-field]');
      this.lanes = Array.from(dialog.querySelectorAll('[data-rhythm-lane]'));
      this.controls = Array.from(dialog.querySelectorAll('[data-rhythm-control]'));
      this.scoreValue = dialog.querySelector('[data-rhythm-score]');
      this.timeValue = dialog.querySelector('[data-rhythm-time]');
      this.comboValue = dialog.querySelector('[data-rhythm-combo]');
      this.tempoValue = dialog.querySelector('[data-rhythm-tempo]');
      this.feedback = dialog.querySelector('[data-rhythm-feedback]');
      this.intro = dialog.querySelector('[data-rhythm-intro]');
      this.countdown = dialog.querySelector('[data-rhythm-countdown]');
      this.countdownValue = dialog.querySelector('[data-rhythm-countdown-value]');
      this.result = dialog.querySelector('[data-rhythm-result]');
      this.finalScore = dialog.querySelector('[data-rhythm-final-score]');
      this.resultStats = dialog.querySelector('[data-rhythm-result-stats]');
      this.bestMessage = dialog.querySelector('[data-rhythm-best-message]');
      this.liveStatus = dialog.querySelector('[data-rhythm-status]');
      this.startButton = dialog.querySelector('[data-rhythm-start]');
      this.replayButton = dialog.querySelector('[data-rhythm-replay]');
      this.closeButtons = Array.from(dialog.querySelectorAll('[data-rhythm-close]'));
      this.notes = new Map();
      this.noteCounter = 0;
      this.animationFrame = 0;
      this.countdownTimers = [];
      this.isPlaying = false;
      this.isCountingDown = false;
      this.trigger = null;
      this.lastFocused = null;
      this.lastLane = -1;
      this.lastSpawnAtByLane = new Array(SYMBOLS.length).fill(-Infinity);
      this.prefersReducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.boundFrame = this.frame.bind(this);
      this.boundKeydown = this.handleKeydown.bind(this);
      this.bindEvents();
      this.resetStats();
    }

    bindEvents() {
      this.startButton.addEventListener('click', () => this.beginCountdown());
      this.replayButton.addEventListener('click', () => this.beginCountdown());
      this.closeButtons.forEach((button) => button.addEventListener('click', () => this.close()));
      this.controls.forEach((button, index) => {
        button.addEventListener('click', () => this.pressLane(index));
      });

      this.dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        this.close();
      });

      this.dialog.addEventListener('click', (event) => {
        if (event.target === this.dialog) this.close();
      });

      document.addEventListener('keydown', this.boundKeydown);
    }

    open(trigger) {
      this.trigger = trigger instanceof HTMLElement ? trigger : null;
      this.lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.stopRound();
      this.showIntro();
      this.updateBestDisplay();
      document.body.classList.add('rhythm-game-open');

      if (!this.dialog.open) this.dialog.showModal();
      global.requestAnimationFrame(() => this.startButton.focus());
    }

    close() {
      this.stopRound();
      this.clearNotes();
      document.body.classList.remove('rhythm-game-open');
      if (this.dialog.open) this.dialog.close();

      const focusTarget = this.trigger && this.trigger.isConnected ? this.trigger : this.lastFocused;
      if (focusTarget && focusTarget.isConnected) {
        global.requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
      }
    }

    showIntro() {
      this.intro.hidden = false;
      this.countdown.hidden = true;
      this.result.hidden = true;
      this.root.classList.remove('is-playing', 'is-finished', 'is-counting-down');
      this.clearNotes();
      this.resetStats();
      this.renderHud(0);
      this.feedback.textContent = '';
      this.liveStatus.textContent = 'Tikus Beat ready. Start a 60-second rhythm game.';
    }

    beginCountdown() {
      if (this.isPlaying || this.isCountingDown) return;

      this.stopRound();
      this.resetStats();
      this.renderHud(0);
      this.clearNotes();
      this.intro.hidden = true;
      this.result.hidden = true;
      this.countdown.hidden = false;
      this.root.classList.add('is-counting-down');
      this.isCountingDown = true;

      const sequence = ['3', '2', '1', 'GO'];
      sequence.forEach((value, index) => {
        const timer = global.setTimeout(() => {
          this.countdownValue.textContent = value;
          this.countdownValue.classList.remove('is-popping');
          void this.countdownValue.offsetWidth;
          this.countdownValue.classList.add('is-popping');

          if (value === 'GO') {
            const startTimer = global.setTimeout(() => this.startRound(), 360);
            this.countdownTimers.push(startTimer);
          }
        }, index * 620);
        this.countdownTimers.push(timer);
      });
    }

    startRound() {
      this.clearCountdownTimers();
      this.isCountingDown = false;
      this.isPlaying = true;
      this.root.classList.remove('is-counting-down', 'is-finished');
      this.root.classList.add('is-playing');
      this.countdown.hidden = true;
      this.startedAt = performance.now();
      this.endsAt = this.startedAt + GAME_DURATION_MS;
      this.nextSpawnAt = this.startedAt + 220;
      this.lastLane = -1;
      this.lastSpawnAtByLane.fill(-Infinity);
      this.liveStatus.textContent = 'Round started. Match the falling symbols.';
      this.animationFrame = global.requestAnimationFrame(this.boundFrame);
    }

    stopRound() {
      this.isPlaying = false;
      this.isCountingDown = false;
      this.clearCountdownTimers();
      if (this.animationFrame) {
        global.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = 0;
      }
      this.root.classList.remove('is-playing', 'is-counting-down');
      this.controls.forEach((button) => button.classList.remove('is-pressed'));
    }

    clearCountdownTimers() {
      this.countdownTimers.forEach((timer) => global.clearTimeout(timer));
      this.countdownTimers = [];
    }

    resetStats() {
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.hits = 0;
      this.perfects = 0;
      this.greats = 0;
      this.goods = 0;
      this.okays = 0;
      this.misses = 0;
    }

    frame(now) {
      if (!this.isPlaying) return;

      const remaining = Math.max(0, this.endsAt - now);
      const progress = clamp((now - this.startedAt) / GAME_DURATION_MS, 0, 1);

      while (now >= this.nextSpawnAt && now < this.endsAt) {
        this.spawnNote(now, progress);
        const interval = this.spawnInterval(progress);
        const jitter = interval * (Math.random() * 0.18 - 0.09);
        this.nextSpawnAt += Math.max(225, interval + jitter);
      }

      this.updateNotes(now);
      this.renderHud(remaining, progress);

      if (remaining <= 0) {
        this.finishRound();
        return;
      }

      this.animationFrame = global.requestAnimationFrame(this.boundFrame);
    }

    spawnInterval(progress) {
      const shaped = easeInCubic(progress);
      return lerp(880, 315, shaped);
    }

    travelDuration(progress) {
      const shaped = easeInCubic(progress);
      return lerp(2920, 1120, shaped);
    }

    chooseLane(now) {
      const available = SYMBOLS.map((_, index) => index).filter((index) => {
        return now - this.lastSpawnAtByLane[index] > 340;
      });

      const pool = available.length ? available : SYMBOLS.map((_, index) => index);
      let lane = pool[Math.floor(Math.random() * pool.length)];

      if (lane === this.lastLane && pool.length > 1 && Math.random() < 0.74) {
        const alternatives = pool.filter((index) => index !== this.lastLane);
        lane = alternatives[Math.floor(Math.random() * alternatives.length)];
      }

      return lane;
    }

    spawnNote(now, progress) {
      const laneIndex = this.chooseLane(now);
      const lane = this.lanes[laneIndex];
      if (!lane) return;

      const symbol = SYMBOLS[laneIndex];
      const note = createElement('span', 'rhythm-note');
      note.dataset.rhythmNote = String(this.noteCounter);
      note.dataset.lane = String(laneIndex);
      note.style.setProperty('--lane-index', String(laneIndex));
      note.setAttribute('aria-hidden', 'true');
      note.append(createSymbolVisual(symbol, 'rhythm-note__symbol'));

      const duration = this.travelDuration(progress);
      const fieldHeight = Math.max(320, this.field.clientHeight);
      const startY = -72;
      const endY = fieldHeight + 80;
      const hitY = fieldHeight * 0.79;
      const distance = endY - startY;
      const hitProgress = clamp((hitY - startY) / distance, 0.1, 0.9);
      const noteId = this.noteCounter;

      const model = {
        id: noteId,
        lane: laneIndex,
        element: note,
        spawnedAt: now,
        duration,
        startY,
        endY,
        hitAt: now + duration * hitProgress,
        resolved: false
      };

      this.notes.set(noteId, model);
      this.noteCounter += 1;
      this.lastLane = laneIndex;
      this.lastSpawnAtByLane[laneIndex] = now;
      lane.append(note);
    }

    updateNotes(now) {
      this.notes.forEach((note) => {
        if (note.resolved) return;

        const progress = clamp((now - note.spawnedAt) / note.duration, 0, 1.05);
        const y = lerp(note.startY, note.endY, progress);
        note.element.style.transform = `translate3d(-50%, ${y}px, 0)`;

        if (now > note.hitAt + HIT_WINDOW_MS) {
          this.resolveMiss(note, 'Miss');
        }
      });
    }

    pressLane(laneIndex) {
      if (!this.isPlaying) return;

      const now = performance.now();
      const control = this.controls[laneIndex];
      if (control) {
        control.classList.remove('is-pressed');
        void control.offsetWidth;
        control.classList.add('is-pressed');
        global.setTimeout(() => control.classList.remove('is-pressed'), 110);
      }

      let candidate = null;
      let smallestDelta = Infinity;

      this.notes.forEach((note) => {
        if (note.resolved || note.lane !== laneIndex) return;
        const delta = Math.abs(now - note.hitAt);
        if (delta < smallestDelta) {
          smallestDelta = delta;
          candidate = note;
        }
      });

      if (!candidate || smallestDelta > HIT_WINDOW_MS) {
        this.combo = 0;
        this.misses += 1;
        this.showFeedback('Wrong', 'miss');
        this.renderHud(Math.max(0, this.endsAt - now));
        return;
      }

      const judgement = this.judgementFor(smallestDelta);
      this.resolveHit(candidate, judgement);
    }

    judgementFor(delta) {
      if (delta <= 95) return { label: 'Perfect', className: 'perfect', points: 100 };
      if (delta <= 170) return { label: 'Great', className: 'great', points: 75 };
      if (delta <= 275) return { label: 'Good', className: 'good', points: 50 };
      return { label: 'Okay', className: 'okay', points: 25 };
    }

    resolveHit(note, judgement) {
      if (note.resolved) return;
      note.resolved = true;
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.hits += 1;

      if (judgement.className === 'perfect') this.perfects += 1;
      if (judgement.className === 'great') this.greats += 1;
      if (judgement.className === 'good') this.goods += 1;
      if (judgement.className === 'okay') this.okays += 1;

      const comboMultiplier = 1 + Math.min(0.75, Math.floor(this.combo / 10) * 0.1);
      const awarded = Math.round(judgement.points * comboMultiplier);
      this.score += awarded;

      note.element.classList.add('is-hit', `is-${judgement.className}`);
      note.element.setAttribute('aria-hidden', 'true');
      this.showFeedback(`${judgement.label} +${awarded}`, judgement.className);
      this.removeNoteAfterAnimation(note);
      this.renderHud(Math.max(0, this.endsAt - performance.now()));
    }

    resolveMiss(note, label) {
      if (note.resolved) return;
      note.resolved = true;
      this.combo = 0;
      this.misses += 1;
      note.element.classList.add('is-missed');
      note.element.setAttribute('aria-hidden', 'true');
      this.showFeedback(label, 'miss');
      this.removeNoteAfterAnimation(note);
    }

    removeNoteAfterAnimation(note) {
      const delay = this.prefersReducedMotion ? 0 : 180;
      global.setTimeout(() => {
        note.element.remove();
        this.notes.delete(note.id);
      }, delay);
    }

    showFeedback(message, className) {
      this.feedback.textContent = message;
      this.feedback.className = `rhythm-feedback is-${className}`;
      this.feedback.classList.remove('is-visible');
      void this.feedback.offsetWidth;
      this.feedback.classList.add('is-visible');
    }

    renderHud(remainingMs, progressOverride) {
      const remainingSeconds = Math.ceil(Math.max(0, remainingMs) / 1000);
      const progress = typeof progressOverride === 'number'
        ? progressOverride
        : clamp((performance.now() - (this.startedAt || performance.now())) / GAME_DURATION_MS, 0, 1);
      const tempo = lerp(1, 2.45, easeInCubic(progress));

      this.scoreValue.textContent = String(this.score);
      this.timeValue.textContent = String(remainingSeconds || (this.isPlaying ? 0 : 60));
      this.comboValue.textContent = String(this.combo);
      this.tempoValue.textContent = `${tempo.toFixed(1)}×`;
      this.root.classList.toggle('is-warning', this.isPlaying && remainingSeconds <= 10);
    }

    finishRound() {
      if (!this.isPlaying) return;
      this.stopRound();
      this.root.classList.add('is-finished');

      this.notes.forEach((note) => {
        if (!note.resolved) {
          note.resolved = true;
          this.misses += 1;
        }
      });
      this.clearNotes();

      const attempts = this.hits + this.misses;
      const accuracy = attempts > 0 ? Math.round((this.hits / attempts) * 100) : 0;
      const previousBest = this.readBestScore();
      const isNewBest = this.score > previousBest;

      if (isNewBest) this.writeBestScore(this.score);

      this.finalScore.textContent = String(this.score);
      this.resultStats.textContent = `${accuracy}% accuracy · ${this.hits} hits · ${this.misses} misses · best combo ${this.maxCombo}`;
      this.bestMessage.textContent = isNewBest
        ? `New best score: ${this.score}`
        : `Best score: ${previousBest}`;
      this.bestMessage.classList.toggle('is-new-best', isNewBest);

      this.result.hidden = false;
      this.intro.hidden = true;
      this.countdown.hidden = true;
      this.liveStatus.textContent = `Round complete. Score ${this.score}. Accuracy ${accuracy} percent.`;
      global.requestAnimationFrame(() => this.replayButton.focus());
    }

    clearNotes() {
      this.notes.forEach((note) => note.element.remove());
      this.notes.clear();
      this.noteCounter = 0;
    }

    readBestScore() {
      try {
        const value = Number(global.localStorage.getItem(STORAGE_KEY));
        return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
      } catch (error) {
        return 0;
      }
    }

    writeBestScore(score) {
      try {
        global.localStorage.setItem(STORAGE_KEY, String(score));
      } catch (error) {
        // Local storage is optional. The round remains fully playable without it.
      }
    }

    updateBestDisplay() {
      const best = this.readBestScore();
      this.bestMessage.textContent = best > 0 ? `Best score: ${best}` : '';
    }

    handleKeydown(event) {
      if (!this.dialog.open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        return;
      }

      const laneIndex = KEY_TO_LANE[String(event.key).toLowerCase()];
      if (Number.isInteger(laneIndex)) {
        event.preventDefault();
        this.pressLane(laneIndex);
        return;
      }

      if (event.key !== 'Tab') return;
      this.trapFocus(event);
    }

    trapFocus(event) {
      const focusable = Array.from(
        this.dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((element) => !element.closest('[hidden]') && element.offsetParent !== null);

      if (!focusable.length) return;
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
    if (!modal || typeof modal.open !== 'function' || modal.__tikusRhythmPatched) return false;

    const originalOpen = modal.open.bind(modal);
    modal.open = function openRhythmPatched(content, trigger) {
      if (content && (
        content.id === HOTSPOT_ID ||
        content.type === 'rhythm-game' ||
        content.gameId === GAME_ID
      )) {
        game.open(trigger);
        return undefined;
      }

      return originalOpen(content, trigger);
    };

    modal.__tikusRhythmPatched = true;
    return true;
  }

  function installFallbackClick(game) {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest(
        '[data-hotspot-id="rhythm-game"], [data-game-id="tikus-beat"]'
      );
      if (!trigger) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      game.open(trigger);
    }, true);
  }

  function initialise() {
    injectStylesheet();
    addRhythmHotspot();

    const dialog = createGameDialog();
    const game = new TikusRhythmGame(dialog);
    installFallbackClick(game);
    refreshActiveScene();

    let attempts = 0;
    const tryPatch = () => {
      if (patchHotspotModal(game)) return;
      attempts += 1;
      if (attempts < 120) global.requestAnimationFrame(tryPatch);
    };

    tryPatch();
    global.TikusRhythmGame = game;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})(window);
