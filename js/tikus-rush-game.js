(function registerTikusRush(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-rush-best-v2';
  const DURATION_SECONDS = 30;
  const GREY_POINTS = 2;
  const GOLD_POINTS = 10;
  const GOLD_CHANCE = 0.16;
  const MAX_ACTIVE_MICE = 5;

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
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
      // Private browsing can reject storage. The current score still works.
    }
  }

  function mouseSvg(type) {
    const gold = type === 'gold';
    const body = gold ? '#d6a83e' : '#8c8984';
    const light = gold ? '#ffe28a' : '#d5d0c8';
    const dark = gold ? '#73440e' : '#4c4845';
    return `
      <svg viewBox="0 0 128 72" role="img" aria-hidden="true" focusable="false">
        <path d="M111 43c10 0 14 6 12 11-3 7-14 9-24 4" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="62" cy="42" rx="42" ry="24" fill="${body}"/>
        <circle cx="34" cy="24" r="13" fill="${dark}"/>
        <circle cx="35" cy="25" r="8" fill="${light}"/>
        <path d="M28 43c-11 3-18 9-21 16 10 0 19-2 26-7" fill="${light}"/>
        <circle cx="51" cy="37" r="3.5" fill="#151212"/>
        <path d="M13 45 3 40M14 49 2 50M16 53 5 59" stroke="#efe5d2" stroke-width="2" stroke-linecap="round"/>
        ${gold ? '<path d="m65 20 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#fff1a8" opacity=".9"/>' : ''}
      </svg>`;
  }

  function mount(container, context = {}) {
    const reducedMotion = Boolean(context.reducedMotion);
    const onExit = typeof context.onExit === 'function' ? context.onExit : () => {};

    let score = 0;
    let best = readBest();
    let remaining = DURATION_SECONDS;
    let running = false;
    let combo = 0;
    let maxCombo = 0;
    let caughtGrey = 0;
    let caughtGold = 0;
    let spawnTimer = 0;
    let clockTimer = 0;
    let startTime = 0;
    let mouseId = 0;
    let activeMice = new Map();
    let isPaused = false;
    let hiddenAt = 0;

    const root = create('section', 'rush');
    root.dataset.rushRoot = '';

    const header = create('header', 'rush__header');
    const heading = create('div', 'rush__heading');
    heading.append(
      create('p', 'rush__eyebrow', '30-SECOND CHALLENGE'),
      create('h2', 'rush__title', 'Tikus Rush')
    );
    const backButton = create('button', 'rush__back', '← Sitting Room');
    backButton.type = 'button';
    backButton.addEventListener('click', onExit);
    header.append(heading, backButton);

    const hud = create('div', 'rush__hud');
    const scorePanel = create('div', 'rush__hud-item');
    const scoreLabel = create('span', 'rush__hud-label', 'Score');
    const scoreValue = create('strong', 'rush__hud-value', '0');
    scorePanel.append(scoreLabel, scoreValue);
    const timePanel = create('div', 'rush__hud-item rush__hud-item--time');
    const timeLabel = create('span', 'rush__hud-label', 'Time');
    const timeValue = create('strong', 'rush__hud-value', String(DURATION_SECONDS));
    timePanel.append(timeLabel, timeValue);
    const comboPanel = create('div', 'rush__hud-item rush__hud-item--combo');
    const comboLabel = create('span', 'rush__hud-label', 'Streak');
    const comboValue = create('strong', 'rush__hud-value', '0');
    comboPanel.append(comboLabel, comboValue);
    const bestPanel = create('div', 'rush__hud-item');
    const bestLabel = create('span', 'rush__hud-label', 'Best');
    const bestValue = create('strong', 'rush__hud-value', String(best));
    bestPanel.append(bestLabel, bestValue);
    hud.append(scorePanel, timePanel, comboPanel, bestPanel);

    const arena = create('div', 'rush__arena');
    arena.setAttribute('aria-label', 'Mouse-catching arena');
    arena.tabIndex = -1;
    const rings = create('div', 'rush__rings');
    rings.setAttribute('aria-hidden', 'true');
    const beams = create('div', 'rush__beams');
    beams.setAttribute('aria-hidden', 'true');
    const grain = create('div', 'rush__grain');
    grain.setAttribute('aria-hidden', 'true');
    const dust = create('div', 'rush__dust');
    dust.setAttribute('aria-hidden', 'true');
    const miceLayer = create('div', 'rush__mice');
    const effectsLayer = create('div', 'rush__effects');
    effectsLayer.setAttribute('aria-hidden', 'true');
    const announcer = create('div', 'rush__announcer');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');

    const intro = create('div', 'rush__overlay');
    const introCard = create('div', 'rush__card');
    introCard.append(
      create('p', 'rush__card-kicker', 'THE HOUSE IS CRAWLING'),
      create('p', 'rush__description', 'Catch as many mice as possible before time runs out. They dart in unpredictable directions, but the pace stays playful and forgiving.')
    );
    const rules = create('div', 'rush__rules');
    const greyRule = create('div', 'rush__rule');
    greyRule.innerHTML = `${mouseSvg('grey')}<span>Grey mouse <strong>+${GREY_POINTS}</strong></span>`;
    const goldRule = create('div', 'rush__rule rush__rule--gold');
    goldRule.innerHTML = `${mouseSvg('gold')}<span>Gold mouse <strong>+${GOLD_POINTS}</strong></span>`;
    rules.append(greyRule, goldRule);
    const startButton = create('button', 'rush__primary', 'Start the rush');
    startButton.type = 'button';
    introCard.append(rules, startButton);
    intro.append(introCard);

    const result = create('div', 'rush__overlay rush__overlay--result');
    result.hidden = true;
    const resultCard = create('div', 'rush__card rush__card--result');
    const resultKicker = create('p', 'rush__card-kicker', 'TIME IS UP');
    const resultTitle = create('h3', 'rush__result-title', 'The mice escaped.');
    const finalScore = create('p', 'rush__final-score', '0');
    const breakdown = create('p', 'rush__breakdown');
    const bestMessage = create('p', 'rush__best-message');
    bestMessage.setAttribute('aria-live', 'polite');
    const resultActions = create('div', 'rush__actions');
    const replayButton = create('button', 'rush__primary', 'Play again');
    replayButton.type = 'button';
    const gamesButton = create('button', 'rush__secondary', 'Return to Sitting Room');
    gamesButton.type = 'button';
    gamesButton.addEventListener('click', onExit);
    resultActions.append(replayButton, gamesButton);
    resultCard.append(resultKicker, resultTitle, finalScore, breakdown, bestMessage, resultActions);
    result.append(resultCard);

    arena.append(rings, beams, grain, dust, miceLayer, effectsLayer, announcer, intro, result);
    root.append(header, hud, arena);
    container.replaceChildren(root);

    function updateHud() {
      scoreValue.textContent = String(score);
      timeValue.textContent = String(Math.max(0, Math.ceil(remaining)));
      comboValue.textContent = String(combo);
      bestValue.textContent = String(best);
      root.style.setProperty('--rush-progress', String(clamp(1 - remaining / DURATION_SECONDS, 0, 1)));
      timePanel.classList.toggle('is-warning', remaining <= 10 && running);
      root.classList.toggle('is-final', remaining <= 10 && running);
    }

    function createBurst(x, y, type, points) {
      if (reducedMotion) return;
      const burst = create('span', `rush__burst rush__burst--${type}`);
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;
      const label = create('strong', 'rush__score-pop', `+${points}`);
      burst.append(label);
      for (let index = 0; index < 7; index += 1) {
        const particle = create('i', 'rush__particle');
        particle.style.setProperty('--particle-angle', `${index * (360 / 7)}deg`);
        particle.style.setProperty('--particle-distance', `${28 + Math.random() * 30}px`);
        burst.append(particle);
      }
      effectsLayer.append(burst);
      window.setTimeout(() => burst.remove(), 850);
    }

    function removeMouse(id, escaped = false) {
      const record = activeMice.get(id);
      if (!record || record.removing) return;
      record.removing = true;
      window.clearTimeout(record.expiry);
      record.animation?.cancel();
      activeMice.delete(id);
      if (escaped && running) {
        // A single escape only softens the streak instead of wiping it out.
        combo = Math.max(0, combo - 1);
        updateHud();
      }
      record.button.remove();
    }

    function catchMouse(id, event) {
      if (!running) return;
      const record = activeMice.get(id);
      if (!record || record.caught) return;
      record.caught = true;
      record.button.classList.add('is-caught');
      const rect = arena.getBoundingClientRect();
      const mouseRect = record.button.getBoundingClientRect();
      const x = mouseRect.left - rect.left + mouseRect.width / 2;
      const y = mouseRect.top - rect.top + mouseRect.height / 2;
      const points = record.type === 'gold' ? GOLD_POINTS : GREY_POINTS;
      score += points;
      combo += 1;
      maxCombo = Math.max(maxCombo, combo);
      if (record.type === 'gold') {
        caughtGold += 1;
        const flash = create('span', 'rush__gold-flash');
        effectsLayer.append(flash);
        window.setTimeout(() => flash.remove(), 420);
      } else {
        caughtGrey += 1;
      }
      createBurst(x, y, record.type, points);
      announcer.textContent = `${record.type === 'gold' ? 'Gold' : 'Grey'} mouse caught. ${points} points. Score ${score}.`;
      removeMouse(id);
      updateHud();
      if (combo > 0 && combo % 8 === 0) {
        const callout = create('span', 'rush__callout', `${combo} STREAK`);
        effectsLayer.append(callout);
        window.setTimeout(() => callout.remove(), 900);
      }
      event?.preventDefault();
    }

    function edgePoint(edge, width, height, mouseSize) {
      const pad = mouseSize * 0.8;
      const safeX = () => randomBetween(0, Math.max(0, width - mouseSize));
      const safeY = () => randomBetween(0, Math.max(0, height - mouseSize));
      if (edge === 'left') return { x: -pad, y: safeY() };
      if (edge === 'right') return { x: width + pad, y: safeY() };
      if (edge === 'top') return { x: safeX(), y: -pad };
      return { x: safeX(), y: height + pad };
    }

    function catmullRom(p0, p1, p2, p3, t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      };
    }

    function buildMousePath(width, height, mouseSize, scale) {
      const edges = ['left', 'right', 'top', 'bottom'];
      const startEdge = edges[Math.floor(Math.random() * edges.length)];
      const possibleEnds = edges.filter((edge) => edge !== startEdge);
      const endEdge = possibleEnds[Math.floor(Math.random() * possibleEnds.length)];
      const start = edgePoint(startEdge, width, height, mouseSize);
      const end = edgePoint(endEdge, width, height, mouseSize);
      const safeWidth = Math.max(1, width - mouseSize);
      const safeHeight = Math.max(1, height - mouseSize);

      // A few broad control points create an erratic route. Sampling a Catmull–Rom
      // spline through them keeps every turn continuous instead of snapping at corners.
      const controls = [
        start,
        { x: randomBetween(safeWidth * 0.08, safeWidth * 0.92), y: randomBetween(safeHeight * 0.08, safeHeight * 0.92) },
        { x: randomBetween(safeWidth * 0.06, safeWidth * 0.94), y: randomBetween(safeHeight * 0.06, safeHeight * 0.94) },
        { x: randomBetween(safeWidth * 0.08, safeWidth * 0.92), y: randomBetween(safeHeight * 0.08, safeHeight * 0.92) },
        end
      ];
      const padded = [controls[0], ...controls, controls[controls.length - 1]];
      const samples = [];
      const samplesPerSegment = 9;

      for (let segment = 0; segment < controls.length - 1; segment += 1) {
        for (let step = 0; step < samplesPerSegment; step += 1) {
          if (segment > 0 && step === 0) continue;
          samples.push(catmullRom(
            padded[segment],
            padded[segment + 1],
            padded[segment + 2],
            padded[segment + 3],
            step / samplesPerSegment
          ));
        }
      }
      samples.push(end);

      const distances = [0];
      let pathLength = 0;
      for (let index = 1; index < samples.length; index += 1) {
        pathLength += Math.hypot(samples[index].x - samples[index - 1].x, samples[index].y - samples[index - 1].y);
        distances.push(pathLength);
      }

      const overallFacing = end.x >= start.x ? -1 : 1;
      const keyframes = samples.map((point, index) => {
        const previous = samples[Math.max(0, index - 1)];
        const next = samples[Math.min(samples.length - 1, index + 1)];
        const dx = next.x - previous.x;
        const dy = next.y - previous.y;
        const lean = clamp(Math.atan2(dy, Math.max(18, Math.abs(dx))) * 180 / Math.PI * 0.45, -18, 18);
        const fade = index === 0 || index === samples.length - 1 ? 0 : 1;
        return {
          offset: pathLength > 0 ? distances[index] / pathLength : index / Math.max(1, samples.length - 1),
          opacity: fade,
          transform: `translate3d(${point.x}px, ${point.y}px, 0) scaleX(${overallFacing}) scale(${scale}) rotate(${lean}deg)`
        };
      });
      if (keyframes.length > 3) {
        keyframes[1].opacity = 1;
        keyframes[keyframes.length - 2].opacity = 1;
      }
      return { keyframes, pathLength };
    }

    function animateMouse(button, progress, scale) {
      if (reducedMotion) {
        const width = Math.max(1, arena.clientWidth - button.offsetWidth);
        const height = Math.max(1, arena.clientHeight - button.offsetHeight);
        const x = randomBetween(0, width);
        const y = randomBetween(0, height);
        const duration = 4800;
        const animation = button.animate([
          { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
          { opacity: 1, offset: 0.12, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
          { opacity: 1, offset: 0.84, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
          { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }
        ], { duration, fill: 'forwards', easing: 'linear' });
        return { animation, duration };
      }

      const path = buildMousePath(arena.clientWidth, arena.clientHeight, button.offsetWidth, scale);
      const pixelsPerSecond = 172 + progress * 28;
      const duration = clamp((path.pathLength / pixelsPerSecond) * 1000, 5600, 9800);
      const animation = button.animate(path.keyframes, {
        duration,
        fill: 'forwards',
        easing: 'linear'
      });
      return { animation, duration };
    }

    function spawnMouse() {
      if (!running || activeMice.size >= MAX_ACTIVE_MICE) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = clamp(elapsed / DURATION_SECONDS, 0, 1);
      const type = Math.random() < GOLD_CHANCE ? 'gold' : 'grey';
      const button = create('button', `rush__mouse rush__mouse--${type}`);
      button.type = 'button';
      button.innerHTML = mouseSvg(type);
      button.setAttribute('aria-label', `${type === 'gold' ? 'Gold' : 'Grey'} mouse, worth ${type === 'gold' ? GOLD_POINTS : GREY_POINTS} points`);
      const id = ++mouseId;
      const scale = randomBetween(0.78, 1.12);
      let travel = reducedMotion ? 4800 : 5600;

      const handlePointer = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        catchMouse(id, event);
      };
      button.addEventListener('pointerdown', handlePointer);
      // Keyboard activation dispatches click with detail 0. Pointer clicks are already handled above.
      button.addEventListener('click', (event) => {
        if (event.detail === 0) catchMouse(id, event);
      });
      miceLayer.append(button);

      let animation = null;
      if (typeof button.animate === 'function') {
        const motion = animateMouse(button, progress, scale);
        animation = motion.animation;
        travel = motion.duration;
        animation.addEventListener('finish', () => removeMouse(id, true), { once: true });
      } else {
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        button.classList.add(`rush__mouse--fallback-${direction}`);
        button.style.setProperty('--mouse-duration', `${travel}ms`);
        button.style.setProperty('--mouse-scale', String(scale));
        button.style.setProperty('--mouse-top', `${randomBetween(8, 78)}%`);
        button.style.setProperty('--mouse-wobble', `${randomBetween(-90, 90)}px`);
        button.addEventListener('animationend', () => removeMouse(id, true), { once: true });
      }

      const expiryDelay = travel + 350;
      const expiry = window.setTimeout(() => removeMouse(id, true), expiryDelay);
      activeMice.set(id, { id, button, type, expiry, expiryAt: performance.now() + expiryDelay, animation, caught: false, removing: false });

      if (progress > 0.72 && activeMice.size < MAX_ACTIVE_MICE - 1 && Math.random() < 0.08) {
        window.setTimeout(() => {
          if (running && !isPaused) spawnMouse();
        }, randomBetween(180, 300));
      }
    }

    function scheduleSpawn() {
      if (!running) return;
      const progress = clamp((performance.now() - startTime) / (DURATION_SECONDS * 1000), 0, 1);
      const delay = Math.max(620, 960 - progress * 270 + Math.random() * 210);
      spawnTimer = window.setTimeout(() => {
        spawnMouse();
        scheduleSpawn();
      }, delay);
    }

    function pauseForHidden() {
      if (!running || isPaused) return;
      isPaused = true;
      hiddenAt = performance.now();
      window.clearTimeout(spawnTimer);
      window.clearInterval(clockTimer);
      activeMice.forEach((record) => {
        record.animation?.pause();
        window.clearTimeout(record.expiry);
      });
    }

    function resumeFromHidden() {
      if (!running || !isPaused) return;
      isPaused = false;
      const hiddenDuration = Math.max(0, performance.now() - hiddenAt);
      startTime += hiddenDuration;
      activeMice.forEach((record) => {
        record.animation?.play();
        const remainingExpiry = Math.max(50, record.expiryAt - hiddenAt);
        record.expiryAt = performance.now() + remainingExpiry;
        record.expiry = window.setTimeout(() => removeMouse(record.id, true), remainingExpiry);
      });
      scheduleSpawn();
      clockTimer = window.setInterval(updateClock, 100);
    }

    function handleVisibilityChange() {
      if (document.hidden) pauseForHidden();
      else resumeFromHidden();
    }

    function updateClock() {
      remaining = DURATION_SECONDS - (performance.now() - startTime) / 1000;
      if (remaining <= 0) {
        finishGame();
        return;
      }
      updateHud();
    }

    function finishGame() {
      if (!running) return;
      running = false;
      isPaused = false;
      remaining = 0;
      window.clearTimeout(spawnTimer);
      window.clearInterval(clockTimer);
      Array.from(activeMice.keys()).forEach((id) => removeMouse(id));
      const previousBest = best;
      if (score > best) {
        best = score;
        writeBest(best);
      }
      finalScore.textContent = String(score);
      breakdown.textContent = `${caughtGrey} grey · ${caughtGold} gold · best streak ${maxCombo}`;
      bestMessage.textContent = score > previousBest ? 'New house record.' : `Best score: ${best}`;
      result.hidden = false;
      intro.hidden = true;
      root.classList.add('is-finished');
      updateHud();
      replayButton.focus({ preventScroll: true });
    }

    function startGame() {
      score = 0;
      remaining = DURATION_SECONDS;
      combo = 0;
      maxCombo = 0;
      caughtGrey = 0;
      caughtGold = 0;
      Array.from(activeMice.keys()).forEach((id) => removeMouse(id));
      intro.hidden = true;
      result.hidden = true;
      root.classList.remove('is-finished', 'is-gold-hit');
      running = true;
      isPaused = false;
      startTime = performance.now();
      updateHud();
      spawnMouse();
      scheduleSpawn();
      clockTimer = window.setInterval(updateClock, 100);
      arena.focus({ preventScroll: true });
    }

    startButton.addEventListener('click', startGame);
    replayButton.addEventListener('click', startGame);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    updateHud();

    return {
      focus() {
        startButton.focus({ preventScroll: true });
      },
      destroy() {
        running = false;
        isPaused = false;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.clearTimeout(spawnTimer);
        window.clearInterval(clockTimer);
        Array.from(activeMice.keys()).forEach((id) => removeMouse(id));
        container.replaceChildren();
      }
    };
  }

  global.TikusGames = global.TikusGames || {};
  global.TikusGames.rush = Object.freeze({
    id: 'rush',
    title: 'Tikus Rush',
    eyebrow: '30-SECOND ARCADE',
    description: 'Catch grey and gold mice as they dart along unpredictable paths at a playful pace.',
    duration: '30 sec',
    controls: 'Tap, click or keyboard',
    accent: 'mouse',
    readBest,
    mount
  });
})(window);
