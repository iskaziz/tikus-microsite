(function registerTikusBeat(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-beat-best-v2';
  const DURATION_SECONDS = 60;
  const PERFECT_WINDOW_MS = 185;
  const GOOD_WINDOW_MS = 470;
  const INPUT_BUFFER_MS = 220;
  const MISS_GRACE_MS = 170;
  const LANE_KEYS = [
    ['1', 'a'],
    ['2', 's'],
    ['3', 'd'],
    ['4', 'f'],
    ['5', 'g']
  ];
  const SHAPES = ['circle', 'triangle', 'square', 'diamond', 'cross'];

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function readBest() {
    try {
      return Math.max(0, Number.parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0);
    } catch (error) {
      return 0;
    }
  }

  function writeBest(score) {
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch (error) {
      // Keep play functional if storage is unavailable.
    }
  }

  function shapeMarkup(shape) {
    return `<span class="beat-shape beat-shape--${shape}" aria-hidden="true"></span>`;
  }

  function mount(container, context = {}) {
    const reducedMotion = Boolean(context.reducedMotion);
    const onExit = typeof context.onExit === 'function' ? context.onExit : () => {};

    let score = 0;
    let best = readBest();
    let combo = 0;
    let maxCombo = 0;
    let remaining = DURATION_SECONDS;
    let running = false;
    let startTime = 0;
    let spawnTimer = 0;
    let clockTimer = 0;
    let noteId = 0;
    let notes = new Map();
    let bufferedInputs = new Map();
    let judgements = { perfect: 0, good: 0, miss: 0 };
    let lastTempoTier = 0;
    let blastMilestone = 0;
    let isPaused = false;
    let hiddenAt = 0;

    const root = create('section', 'beat');
    root.dataset.beatRoot = '';
    root.tabIndex = -1;

    const header = create('header', 'beat__header');
    const heading = create('div', 'beat__heading');
    heading.append(
      create('p', 'beat__eyebrow', '60-SECOND RHYTHM'),
      create('h2', 'beat__title', 'Tikus Beat')
    );
    const backButton = create('button', 'beat__back', '← Games');
    backButton.type = 'button';
    backButton.addEventListener('click', onExit);
    header.append(heading, backButton);

    const hud = create('div', 'beat__hud');
    function hudItem(label, value, modifier = '') {
      const item = create('div', `beat__hud-item ${modifier}`.trim());
      const labelEl = create('span', 'beat__hud-label', label);
      const valueEl = create('strong', 'beat__hud-value', value);
      item.append(labelEl, valueEl);
      return { item, value: valueEl };
    }
    const scoreHud = hudItem('Score', '0');
    const comboHud = hudItem('Combo', '0', 'beat__hud-item--combo');
    const timeHud = hudItem('Time', String(DURATION_SECONDS), 'beat__hud-item--time');
    const tempoHud = hudItem('Tempo', 'Easy');
    const bestHud = hudItem('Best', String(best));
    hud.append(scoreHud.item, comboHud.item, timeHud.item, tempoHud.item, bestHud.item);

    const stage = create('div', 'beat__stage');
    stage.setAttribute('aria-label', 'Five-lane rhythm game');
    const backdrop = create('div', 'beat__backdrop');
    backdrop.setAttribute('aria-hidden', 'true');
    const pulseField = create('div', 'beat__pulse-field');
    pulseField.setAttribute('aria-hidden', 'true');
    const orbitField = create('div', 'beat__orbit-field');
    orbitField.setAttribute('aria-hidden', 'true');
    const scanlines = create('div', 'beat__scanlines');
    scanlines.setAttribute('aria-hidden', 'true');
    const lightSweep = create('div', 'beat__light-sweep');
    lightSweep.setAttribute('aria-hidden', 'true');
    const lanes = create('div', 'beat__lanes');
    const effects = create('div', 'beat__effects');
    effects.setAttribute('aria-hidden', 'true');
    const judgement = create('div', 'beat__judgement');
    judgement.setAttribute('aria-live', 'polite');
    judgement.setAttribute('aria-atomic', 'true');
    const announcer = create('div', 'visually-hidden');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');

    const laneElements = [];
    SHAPES.forEach((shape, laneIndex) => {
      const lane = create('div', 'beat__lane');
      lane.dataset.lane = String(laneIndex);
      const rail = create('div', 'beat__rail');
      const notesLayer = create('div', 'beat__notes');
      const hitZone = create('div', 'beat__hit-zone');
      const receptor = create('button', 'beat__receptor');
      receptor.type = 'button';
      receptor.dataset.lane = String(laneIndex);
      receptor.innerHTML = `${shapeMarkup(shape)}<span class="beat__key">${laneIndex + 1}<small>${LANE_KEYS[laneIndex][1].toUpperCase()}</small></span>`;
      receptor.setAttribute('aria-label', `Lane ${laneIndex + 1}, ${shape}. Keys ${laneIndex + 1} or ${LANE_KEYS[laneIndex][1].toUpperCase()}`);
      receptor.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        hitLane(laneIndex);
      });
      // Enter and Space activate the button through a synthetic click with detail 0.
      receptor.addEventListener('click', (event) => {
        if (event.detail === 0) hitLane(laneIndex);
      });
      hitZone.append(receptor);
      lane.append(rail, notesLayer, hitZone);
      lanes.append(lane);
      laneElements.push({ lane, notesLayer, receptor });
    });

    const intro = create('div', 'beat__overlay');
    const introCard = create('div', 'beat__card');
    introCard.append(
      create('p', 'beat__card-kicker', 'FOLLOW THE FALLING SHAPES'),
      create('p', 'beat__description', 'Tap the matching lane as a shape reaches the crimson hit area. The notes move at a gentler pace, and early taps receive a small input buffer.')
    );
    const keyGuide = create('div', 'beat__key-guide');
    SHAPES.forEach((shape, index) => {
      const item = create('div', 'beat__key-guide-item');
      item.innerHTML = `${shapeMarkup(shape)}<span>${index + 1} / ${LANE_KEYS[index][1].toUpperCase()}</span>`;
      keyGuide.append(item);
    });
    const startButton = create('button', 'beat__primary', 'Start the beat');
    startButton.type = 'button';
    introCard.append(keyGuide, startButton);
    intro.append(introCard);

    const result = create('div', 'beat__overlay beat__overlay--result');
    result.hidden = true;
    const resultCard = create('div', 'beat__card beat__card--result');
    const resultKicker = create('p', 'beat__card-kicker', 'FINAL BEAT');
    const resultTitle = create('h3', 'beat__result-title', 'The rhythm fades.');
    const finalScore = create('p', 'beat__final-score', '0');
    const breakdown = create('p', 'beat__breakdown');
    const bestMessage = create('p', 'beat__best-message');
    bestMessage.setAttribute('aria-live', 'polite');
    const actions = create('div', 'beat__actions');
    const replayButton = create('button', 'beat__primary', 'Play again');
    replayButton.type = 'button';
    const gamesButton = create('button', 'beat__secondary', 'Choose another game');
    gamesButton.type = 'button';
    gamesButton.addEventListener('click', onExit);
    actions.append(replayButton, gamesButton);
    resultCard.append(resultKicker, resultTitle, finalScore, breakdown, bestMessage, actions);
    result.append(resultCard);

    stage.append(backdrop, pulseField, orbitField, scanlines, lightSweep, lanes, effects, judgement, announcer, intro, result);
    root.append(header, hud, stage);
    container.replaceChildren(root);

    function tempoLabel(progress) {
      if (progress < 0.25) return 'Easy';
      if (progress < 0.5) return 'Steady';
      if (progress < 0.75) return 'Upbeat';
      return 'Finale';
    }

    function updateHud() {
      const progress = clamp(1 - remaining / DURATION_SECONDS, 0, 1);
      scoreHud.value.textContent = String(score);
      comboHud.value.textContent = String(combo);
      timeHud.value.textContent = String(Math.max(0, Math.ceil(remaining)));
      tempoHud.value.textContent = tempoLabel(progress);
      bestHud.value.textContent = String(best);
      root.style.setProperty('--beat-progress', String(progress));
      root.classList.toggle('is-final', remaining <= 10 && running);
      timeHud.item.classList.toggle('is-warning', remaining <= 10 && running);
      comboHud.item.classList.toggle('is-hot', combo >= 10);
    }

    function showCallout(text, modifier = '') {
      if (reducedMotion) return;
      const callout = create('span', `beat__callout ${modifier}`.trim(), text);
      effects.append(callout);
      window.setTimeout(() => callout.remove(), 900);
    }

    function pressReceptor(laneIndex) {
      const receptor = laneElements[laneIndex].receptor;
      receptor.getAnimations().forEach((animation) => animation.cancel());
      if (reducedMotion || typeof receptor.animate !== 'function') return;
      receptor.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(0.18rem) scale(0.95)', offset: 0.35 },
        { transform: 'translateY(0) scale(1)' }
      ], { duration: 160, easing: 'ease-out' });
    }

    function pulseLane(laneIndex, type) {
      const { lane } = laneElements[laneIndex];
      const feedback = create('span', `beat__lane-feedback beat__lane-feedback--${type}`);
      lane.append(feedback);
      window.setTimeout(() => feedback.remove(), reducedMotion ? 80 : 280);
      pressReceptor(laneIndex);
    }

    function setJudgement(text, type) {
      judgement.textContent = text;
      judgement.className = `beat__judgement beat__judgement--${type}`;
      judgement.getAnimations().forEach((animation) => animation.cancel());
      if (reducedMotion || typeof judgement.animate !== 'function') {
        judgement.style.opacity = '1';
        window.setTimeout(() => { judgement.style.opacity = '0'; }, 120);
        return;
      }
      judgement.animate([
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.72)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.06)', offset: 0.28 },
        { opacity: 0, transform: 'translate(-50%, -5rem) scale(0.96)' }
      ], { duration: 520, easing: 'ease-out' });
    }

    function removeNote(id) {
      const note = notes.get(id);
      if (!note) return;
      window.clearTimeout(note.missTimer);
      note.element.remove();
      notes.delete(id);
    }

    function createShapeExplosion(note, index, total, stageRect, fragment) {
      if (reducedMotion) return;
      const noteRect = note.element.getBoundingClientRect();
      const burst = create('span', 'beat__shape-burst');
      burst.style.left = `${noteRect.left - stageRect.left + noteRect.width / 2}px`;
      burst.style.top = `${noteRect.top - stageRect.top + noteRect.height / 2}px`;
      burst.style.setProperty('--burst-angle', `${(index / Math.max(1, total)) * 360 + Math.random() * 24}deg`);
      burst.style.setProperty('--burst-distance', `${38 + Math.random() * 48}px`);
      burst.innerHTML = shapeMarkup(note.shape);
      for (let particleIndex = 0; particleIndex < 3; particleIndex += 1) {
        const particle = create('i', 'beat__shape-particle');
        particle.style.setProperty('--particle-angle', `${particleIndex * 120 + Math.random() * 18}deg`);
        particle.style.setProperty('--particle-distance', `${26 + Math.random() * 38}px`);
        burst.append(particle);
      }
      fragment.append(burst);
      window.setTimeout(() => burst.remove(), 680);
    }

    function triggerComboBlast() {
      const visibleNotes = Array.from(notes.values());
      const stageRect = stage.getBoundingClientRect();
      const fragment = document.createDocumentFragment();
      visibleNotes.forEach((note, index) => {
        createShapeExplosion(note, index, visibleNotes.length, stageRect, fragment);
        removeNote(note.id);
      });
      effects.append(fragment);
      const shockwave = create('span', 'beat__combo-blast');
      effects.append(shockwave);
      window.setTimeout(() => shockwave.remove(), reducedMotion ? 80 : 680);
      showCallout('20 HIT BLAST', 'beat__callout--blast');
      announcer.textContent = 'Twenty hit streak. Every visible shape cleared.';
    }

    function registerMiss(id) {
      const note = notes.get(id);
      if (!note || !running) return;
      removeNote(id);
      // A miss trims the combo rather than erasing all progress.
      combo = Math.max(0, combo - 3);
      judgements.miss += 1;
      pulseLane(note.lane, 'miss');
      setJudgement('MISS', 'miss');
      updateHud();
    }

    function closestNoteForLane(laneIndex) {
      let closest = null;
      notes.forEach((note) => {
        if (note.lane !== laneIndex) return;
        const animation = note.animation || note.element.getAnimations()[0];
        const currentTime = Number(animation?.currentTime) || 0;
        const distance = Math.abs(note.travel - currentTime);
        if (!closest || distance < closest.distance) closest = { note, distance };
      });
      return closest;
    }

    function scoreNote(laneIndex, closest) {
      const { note, distance } = closest;
      bufferedInputs.delete(laneIndex);
      removeNote(note.id);
      let type = 'good';
      let points = 80;
      if (distance <= PERFECT_WINDOW_MS) {
        type = 'perfect';
        points = 100;
        judgements.perfect += 1;
      } else {
        judgements.good += 1;
      }
      combo += 1;
      maxCombo = Math.max(maxCombo, combo);
      const comboBonus = Math.min(50, Math.floor(combo / 5) * 5);
      score += points + comboBonus;
      pulseLane(laneIndex, type);
      setJudgement(type === 'perfect' ? 'PERFECT' : 'GOOD', type);
      announcer.textContent = `${type}. Combo ${combo}. Score ${score}.`;
      if (combo > 0 && combo % 10 === 0) {
        showCallout(`${combo} COMBO`, 'beat__callout--combo');
        if (!reducedMotion) {
          const comboFlash = create('span', 'beat__combo-flash-layer');
          effects.append(comboFlash);
          window.setTimeout(() => comboFlash.remove(), 430);
        }
      }
      const reachedBlast = Math.floor(combo / 20);
      if (reachedBlast > blastMilestone) {
        blastMilestone = reachedBlast;
        triggerComboBlast();
      }
      updateHud();
    }

    function hitLane(laneIndex, fromBuffer = false) {
      if (!running) return;
      const now = performance.now();
      const closest = closestNoteForLane(laneIndex);
      if (closest && closest.distance <= GOOD_WINDOW_MS) {
        scoreNote(laneIndex, closest);
        return;
      }

      // Empty or slightly early taps are not punished. Keep them briefly as an input buffer.
      pressReceptor(laneIndex);
      if (!fromBuffer) bufferedInputs.set(laneIndex, now + INPUT_BUFFER_MS);
    }

    function resolveBufferedInputs() {
      if (!running || bufferedInputs.size === 0) return;
      const now = performance.now();
      bufferedInputs.forEach((expiry, laneIndex) => {
        if (expiry < now) {
          bufferedInputs.delete(laneIndex);
          return;
        }
        const closest = closestNoteForLane(laneIndex);
        if (closest && closest.distance <= GOOD_WINDOW_MS) scoreNote(laneIndex, closest);
      });
    }

    function spawnNote() {
      if (!running) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = clamp(elapsed / DURATION_SECONDS, 0, 1);
      const lane = Math.floor(Math.random() * SHAPES.length);
      const travel = reducedMotion ? 3350 : Math.max(2850, 3850 - progress * 900);
      const targetOffset = travel;
      const id = ++noteId;
      const element = create('button', `beat__note beat__note--${SHAPES[lane]}`);
      element.type = 'button';
      element.tabIndex = -1;
      element.innerHTML = shapeMarkup(SHAPES[lane]);
      element.setAttribute('aria-hidden', 'true');
      element.style.setProperty('--note-duration', `${travel}ms`);
      element.style.setProperty('--note-drift', `${(Math.random() - 0.5) * 12}px`);
      element.style.setProperty('--note-travel', `${Math.max(220, stage.clientHeight * 0.80 + 80)}px`);
      laneElements[lane].notesLayer.append(element);
      const animation = element.getAnimations()[0] || null;
      notes.set(id, { id, lane, shape: SHAPES[lane], element, travel: targetOffset, animation, missTimer: 0 });
      element.addEventListener('animationend', () => {
        const note = notes.get(id);
        if (!note || !running) return;
        const missDelay = GOOD_WINDOW_MS + MISS_GRACE_MS;
        note.missTimer = window.setTimeout(() => registerMiss(id), missDelay);
        note.missTimerAt = performance.now() + missDelay;
      }, { once: true });
    }

    function scheduleSpawn() {
      if (!running) return;
      const progress = clamp((performance.now() - startTime) / (DURATION_SECONDS * 1000), 0, 1);
      const delay = Math.max(690, 1120 - progress * 390);
      spawnTimer = window.setTimeout(() => {
        spawnNote();
        if (progress > 0.78 && Math.random() < 0.08) {
          window.setTimeout(() => running && !isPaused && spawnNote(), delay * 0.58);
        }
        scheduleSpawn();
      }, delay);
    }

    function announceTempo(progress) {
      const tier = Math.min(3, Math.floor(progress * 4));
      if (tier <= lastTempoTier) return;
      lastTempoTier = tier;
      const labels = ['PICKING UP', 'UPBEAT', 'FINAL PUSH'];
      showCallout(labels[tier - 1] || 'PICKING UP', 'beat__callout--tempo');
      if (!reducedMotion && typeof lanes.animate === 'function') {
        lanes.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.012)', offset: 0.35 },
          { transform: 'scale(1)' }
        ], { duration: 460, easing: 'ease-out' });
      }
    }

    function pauseForHidden() {
      if (!running || isPaused) return;
      isPaused = true;
      hiddenAt = performance.now();
      window.clearTimeout(spawnTimer);
      window.clearInterval(clockTimer);
      notes.forEach((note) => {
        note.animation?.pause();
        window.clearTimeout(note.missTimer);
      });
    }

    function resumeFromHidden() {
      if (!running || !isPaused) return;
      isPaused = false;
      const hiddenDuration = Math.max(0, performance.now() - hiddenAt);
      startTime += hiddenDuration;
      notes.forEach((note) => {
        note.animation?.play();
        if (note.missTimerAt) {
          const remainingMiss = Math.max(50, note.missTimerAt - hiddenAt);
          note.missTimerAt = performance.now() + remainingMiss;
          note.missTimer = window.setTimeout(() => registerMiss(note.id), remainingMiss);
        }
      });
      bufferedInputs.forEach((expiry, laneIndex) => {
        bufferedInputs.set(laneIndex, expiry + hiddenDuration);
      });
      scheduleSpawn();
      clockTimer = window.setInterval(() => {
        remaining = DURATION_SECONDS - (performance.now() - startTime) / 1000;
        const progress = clamp(1 - remaining / DURATION_SECONDS, 0, 1);
        resolveBufferedInputs();
        announceTempo(progress);
        if (remaining <= 0) {
          finishGame();
          return;
        }
        updateHud();
      }, 50);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pauseForHidden();
      } else {
        resumeFromHidden();
      }
    }

    function finishGame() {
      if (!running) return;
      running = false;
      isPaused = false;
      remaining = 0;
      window.clearTimeout(spawnTimer);
      window.clearInterval(clockTimer);
      bufferedInputs.clear();
      Array.from(notes.keys()).forEach(removeNote);
      const previousBest = best;
      if (score > best) {
        best = score;
        writeBest(best);
      }
      finalScore.textContent = String(score);
      breakdown.textContent = `${judgements.perfect} perfect · ${judgements.good} good · ${judgements.miss} miss · max combo ${maxCombo}`;
      bestMessage.textContent = score > previousBest ? 'New rhythm record.' : `Best score: ${best}`;
      result.hidden = false;
      intro.hidden = true;
      root.classList.add('is-finished');
      updateHud();
      replayButton.focus({ preventScroll: true });
    }

    function startGame() {
      score = 0;
      combo = 0;
      maxCombo = 0;
      remaining = DURATION_SECONDS;
      judgements = { perfect: 0, good: 0, miss: 0 };
      lastTempoTier = 0;
      blastMilestone = 0;
      bufferedInputs.clear();
      Array.from(notes.keys()).forEach(removeNote);
      intro.hidden = true;
      result.hidden = true;
      root.classList.remove('is-finished', 'is-combo-flash', 'is-tempo-shift', 'is-shape-blast');
      running = true;
      isPaused = false;
      startTime = performance.now();
      updateHud();
      spawnNote();
      scheduleSpawn();
      clockTimer = window.setInterval(() => {
        remaining = DURATION_SECONDS - (performance.now() - startTime) / 1000;
        const progress = clamp(1 - remaining / DURATION_SECONDS, 0, 1);
        resolveBufferedInputs();
        announceTempo(progress);
        if (remaining <= 0) {
          finishGame();
          return;
        }
        updateHud();
      }, 50);
      root.focus({ preventScroll: true });
    }

    function handleKeydown(event) {
      if (!running || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const key = event.key.toLowerCase();
      const lane = LANE_KEYS.findIndex((keys) => keys.includes(key));
      if (lane < 0) return;
      event.preventDefault();
      hitLane(lane);
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startButton.addEventListener('click', startGame);
    replayButton.addEventListener('click', startGame);
    updateHud();

    return {
      focus() {
        startButton.focus({ preventScroll: true });
      },
      destroy() {
        running = false;
        isPaused = false;
        window.clearTimeout(spawnTimer);
        window.clearInterval(clockTimer);
        bufferedInputs.clear();
        Array.from(notes.keys()).forEach(removeNote);
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        container.replaceChildren();
      }
    };
  }

  global.TikusGames = global.TikusGames || {};
  global.TikusGames.beat = Object.freeze({
    id: 'beat',
    title: 'Tikus Beat',
    eyebrow: '60-SECOND RHYTHM',
    description: 'Match five falling shapes through a gentler, more forgiving rhythm curve.',
    duration: '60 sec',
    controls: 'Tap lanes or use 1–5 / A/S/D/F/G',
    accent: 'rhythm',
    readBest,
    mount
  });
})(window);
