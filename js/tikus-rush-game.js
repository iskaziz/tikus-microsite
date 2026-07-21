(function registerTikusRush(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-rush-best-v2';
  const DURATION_SECONDS = 30;
  const GREY_POINTS = 2;
  const GOLD_POINTS = 10;
  const GOLD_CHANCE = 0.14;

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
    let caughtGrey = 0;
    let caughtGold = 0;
    let spawnTimer = 0;
    let clockTimer = 0;
    let startTime = 0;
    let mouseId = 0;
    let activeMice = new Map();

    const root = create('section', 'rush');
    root.dataset.rushRoot = '';

    const header = create('header', 'rush__header');
    const heading = create('div', 'rush__heading');
    heading.append(
      create('p', 'rush__eyebrow', '30-SECOND CHALLENGE'),
      create('h2', 'rush__title', 'Tikus Rush')
    );
    const backButton = create('button', 'rush__back', '← Games');
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
      create('p', 'rush__description', 'Catch as many mice as possible before the timer reaches zero. The room gets faster and more chaotic as time runs out.')
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
    const gamesButton = create('button', 'rush__secondary', 'Choose another game');
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
      if (!record) return;
      window.clearTimeout(record.expiry);
      activeMice.delete(id);
      if (escaped && running) {
        combo = 0;
        updateHud();
      }
      record.button.remove();
    }

    function catchMouse(id, event) {
      if (!running) return;
      const record = activeMice.get(id);
      if (!record) return;
      const rect = arena.getBoundingClientRect();
      const mouseRect = record.button.getBoundingClientRect();
      const x = mouseRect.left - rect.left + mouseRect.width / 2;
      const y = mouseRect.top - rect.top + mouseRect.height / 2;
      const points = record.type === 'gold' ? GOLD_POINTS : GREY_POINTS;
      score += points;
      combo += 1;
      if (record.type === 'gold') {
        caughtGold += 1;
        root.classList.remove('is-gold-hit');
        void root.offsetWidth;
        root.classList.add('is-gold-hit');
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

    function spawnMouse() {
      if (!running) return;
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = clamp(elapsed / DURATION_SECONDS, 0, 1);
      const type = Math.random() < GOLD_CHANCE ? 'gold' : 'grey';
      const direction = Math.random() > 0.5 ? 'right' : 'left';
      const button = create('button', `rush__mouse rush__mouse--${type} rush__mouse--${direction}`);
      button.type = 'button';
      button.innerHTML = mouseSvg(type);
      button.setAttribute('aria-label', `${type === 'gold' ? 'Gold' : 'Grey'} mouse, worth ${type === 'gold' ? GOLD_POINTS : GREY_POINTS} points`);
      const id = ++mouseId;
      const top = 10 + Math.random() * 72;
      const scale = 0.82 + Math.random() * 0.42;
      const travel = reducedMotion ? 1600 : Math.max(1050, 2600 - progress * 1350 + Math.random() * 520);
      button.style.setProperty('--mouse-top', `${top}%`);
      button.style.setProperty('--mouse-scale', String(scale));
      button.style.setProperty('--mouse-duration', `${travel}ms`);
      button.style.setProperty('--mouse-wobble', `${(Math.random() - 0.5) * 28}px`);
      button.addEventListener('click', (event) => catchMouse(id, event));
      button.addEventListener('animationend', () => removeMouse(id, true), { once: true });
      miceLayer.append(button);
      const expiry = window.setTimeout(() => removeMouse(id, true), travel + 250);
      activeMice.set(id, { button, type, expiry });

      if (progress > 0.52 && Math.random() < 0.18) {
        window.setTimeout(() => {
          if (running) spawnMouse();
        }, 90 + Math.random() * 110);
      }
    }

    function scheduleSpawn() {
      if (!running) return;
      const progress = clamp((performance.now() - startTime) / (DURATION_SECONDS * 1000), 0, 1);
      const delay = Math.max(210, 680 - progress * 390 + Math.random() * 180);
      spawnTimer = window.setTimeout(() => {
        spawnMouse();
        scheduleSpawn();
      }, delay);
    }

    function finishGame() {
      if (!running) return;
      running = false;
      remaining = 0;
      window.clearTimeout(spawnTimer);
      window.clearInterval(clockTimer);
      activeMice.forEach((_, id) => removeMouse(id));
      const previousBest = best;
      if (score > best) {
        best = score;
        writeBest(best);
      }
      finalScore.textContent = String(score);
      breakdown.textContent = `${caughtGrey} grey · ${caughtGold} gold · longest final streak ${combo}`;
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
      caughtGrey = 0;
      caughtGold = 0;
      activeMice.forEach((_, id) => removeMouse(id));
      intro.hidden = true;
      result.hidden = true;
      root.classList.remove('is-finished', 'is-gold-hit');
      running = true;
      startTime = performance.now();
      updateHud();
      spawnMouse();
      scheduleSpawn();
      clockTimer = window.setInterval(() => {
        remaining = DURATION_SECONDS - (performance.now() - startTime) / 1000;
        if (remaining <= 0) {
          finishGame();
          return;
        }
        updateHud();
      }, 100);
      arena.focus({ preventScroll: true });
    }

    startButton.addEventListener('click', startGame);
    replayButton.addEventListener('click', startGame);
    updateHud();

    return {
      focus() {
        startButton.focus({ preventScroll: true });
      },
      destroy() {
        running = false;
        window.clearTimeout(spawnTimer);
        window.clearInterval(clockTimer);
        activeMice.forEach((_, id) => removeMouse(id));
        container.replaceChildren();
      }
    };
  }

  global.TikusGames = global.TikusGames || {};
  global.TikusGames.rush = Object.freeze({
    id: 'rush',
    title: 'Tikus Rush',
    eyebrow: '30-SECOND ARCADE',
    description: 'Catch grey and gold mice as the room accelerates into a frantic final rush.',
    duration: '30 sec',
    controls: 'Tap, click or keyboard',
    accent: 'mouse',
    readBest,
    mount
  });
})(window);
