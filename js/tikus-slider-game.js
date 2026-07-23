(function registerTikusSlider(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-slider-best-v1';
  const GRID = 3;
  const EMPTY = 8;
  const SOLVED = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, EMPTY]);

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function readBestRecord() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || !Number.isFinite(parsed.moves) || !Number.isFinite(parsed.time)) return null;
      return { moves: Math.max(0, parsed.moves), time: Math.max(0, parsed.time) };
    } catch (error) {
      return null;
    }
  }

  function readBest() {
    const best = readBestRecord();
    return best ? `${best.moves} moves` : '—';
  }

  function writeBest(record) {
    const current = readBestRecord();
    const isBetter = !current
      || record.moves < current.moves
      || (record.moves === current.moves && record.time < current.time);
    if (!isBetter) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (error) {
      // Storage can be unavailable in private browsing. Gameplay still works.
    }
    return true;
  }

  function positionFor(index) {
    return { row: Math.floor(index / GRID), col: index % GRID };
  }

  function adjacentIndices(index) {
    const { row, col } = positionFor(index);
    const neighbors = [];
    if (row > 0) neighbors.push(index - GRID);
    if (row < GRID - 1) neighbors.push(index + GRID);
    if (col > 0) neighbors.push(index - 1);
    if (col < GRID - 1) neighbors.push(index + 1);
    return neighbors;
  }

  function backgroundFor(tileId) {
    const row = Math.floor(tileId / GRID);
    const col = tileId % GRID;
    return `${col * 50}% ${row * 50}%`;
  }

  function mount(container, context = {}) {
    const reducedMotion = Boolean(context.reducedMotion);
    const onExit = typeof context.onExit === 'function' ? context.onExit : () => {};

    let cells = [...SOLVED];
    let moves = 0;
    let elapsed = 0;
    let timerId = 0;
    let playing = false;
    let pausedByVisibility = false;
    let destroyed = false;
    const tiles = new Map();

    const root = create('section', 'slider-game');
    root.dataset.sliderRoot = '';

    const header = create('header', 'slider-game__header');
    const heading = create('div', 'slider-game__heading');
    heading.append(
      create('p', 'slider-game__eyebrow', '3 × 3 PAINTING PUZZLE'),
      create('h2', 'slider-game__title', 'Tikus Slider')
    );
    const backButton = create('button', 'slider-game__back', '← Sitting Room');
    backButton.type = 'button';
    backButton.addEventListener('click', onExit);
    header.append(heading, backButton);

    const intro = create('p', 'slider-game__intro', 'Restore the Samasihat painting. Select a tile beside the empty space, or focus the board and use the arrow keys.');

    const layout = create('div', 'slider-game__layout');
    const stageWrap = create('div', 'slider-game__stage-wrap');
    const board = create('div', 'slider-game__board');
    board.dataset.sliderBoard = '';
    board.tabIndex = 0;
    board.setAttribute('role', 'group');
    board.setAttribute('aria-label', 'Three by three sliding picture puzzle');
    const frameShine = create('div', 'slider-game__frame-shine');
    frameShine.setAttribute('aria-hidden', 'true');
    stageWrap.append(board, frameShine);

    const controls = create('aside', 'slider-game__controls');
    controls.setAttribute('aria-label', 'Puzzle controls');

    const stats = create('dl', 'slider-game__stats');
    const movesStat = create('div');
    const movesTerm = create('dt', '', 'Moves');
    const movesValue = create('dd', '', '0');
    movesStat.append(movesTerm, movesValue);
    const timeStat = create('div');
    const timeTerm = create('dt', '', 'Time');
    const timeValue = create('dd', '', '00:00');
    timeStat.append(timeTerm, timeValue);
    const bestStat = create('div', 'slider-game__best-stat');
    const bestTerm = create('dt', '', 'Best');
    const bestValue = create('dd', '', readBest());
    bestStat.append(bestTerm, bestValue);
    stats.append(movesStat, timeStat, bestStat);

    const actions = create('div', 'slider-game__actions');
    const shuffleButton = create('button', 'slider-game__button slider-game__button--primary', 'Shuffle & Start');
    shuffleButton.type = 'button';
    const previewButton = create('button', 'slider-game__button', 'Hold to Preview');
    previewButton.type = 'button';
    previewButton.setAttribute('aria-pressed', 'false');
    const resetButton = create('button', 'slider-game__button', 'Reset');
    resetButton.type = 'button';
    actions.append(shuffleButton, previewButton, resetButton);

    const status = create('p', 'slider-game__status', 'The painting is ready. Shuffle to begin.');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');

    const help = create('details', 'slider-game__help');
    const helpSummary = create('summary', '', 'How to play');
    const helpText = create('p', '', 'Move a tile into the empty square until the full painting is restored. Arrow keys move the adjacent tile toward the empty square while the board is focused.');
    help.append(helpSummary, helpText);
    controls.append(stats, actions, status, help);
    layout.append(stageWrap, controls);

    const completion = create('div', 'slider-game__completion');
    completion.hidden = true;
    completion.setAttribute('role', 'dialog');
    completion.setAttribute('aria-modal', 'true');
    completion.setAttribute('aria-labelledby', 'slider-complete-title');
    const completionCard = create('div', 'slider-game__completion-card');
    const completionArt = create('div', 'slider-game__completion-art');
    completionArt.setAttribute('aria-hidden', 'true');
    const completionKicker = create('p', 'slider-game__eyebrow', 'PAINTING RESTORED');
    const completionTitle = create('h3', 'slider-game__completion-title', 'Puzzle Complete');
    completionTitle.id = 'slider-complete-title';
    const completionResult = create('p', 'slider-game__completion-result', 'You solved it.');
    const completionActions = create('div', 'slider-game__completion-actions');
    const playAgainButton = create('button', 'slider-game__button slider-game__button--primary', 'Play Again');
    playAgainButton.type = 'button';
    const closeButton = create('button', 'slider-game__button', 'Return to Sitting Room');
    closeButton.type = 'button';
    completionActions.append(playAgainButton, closeButton);
    completionCard.append(completionArt, completionKicker, completionTitle, completionResult, completionActions);
    completion.append(completionCard);

    root.append(header, intro, layout, completion);
    container.replaceChildren(root);

    function render() {
      const emptyIndex = cells.indexOf(EMPTY);
      const movable = new Set(adjacentIndices(emptyIndex).map((index) => cells[index]));

      cells.forEach((id, index) => {
        if (id === EMPTY) return;
        const tile = tiles.get(id);
        const { row, col } = positionFor(index);
        tile.style.setProperty('--slider-row', row);
        tile.style.setProperty('--slider-col', col);
        tile.classList.toggle('is-movable', movable.has(id));
        tile.setAttribute('aria-disabled', movable.has(id) ? 'false' : 'true');
      });

      movesValue.textContent = String(moves);
      timeValue.textContent = formatTime(elapsed);
    }

    function createTiles() {
      board.replaceChildren();
      tiles.clear();

      for (let id = 0; id < EMPTY; id += 1) {
        const tile = create('button', 'slider-game__tile');
        tile.type = 'button';
        tile.dataset.tile = String(id);
        tile.style.backgroundPosition = backgroundFor(id);
        tile.setAttribute('aria-label', `Painting tile ${id + 1}`);
        tile.addEventListener('pointerdown', (event) => {
          if (event.pointerType) {
            event.preventDefault();
            moveTile(id);
          }
        });
        tile.addEventListener('click', (event) => {
          if (event.detail === 0) moveTile(id);
        });
        board.append(tile);
        tiles.set(id, tile);
      }
      render();
    }

    function startTimer() {
      if (timerId || !playing || destroyed) return;
      timerId = window.setInterval(() => {
        elapsed += 1;
        timeValue.textContent = formatTime(elapsed);
      }, 1000);
    }

    function stopTimer() {
      if (timerId) window.clearInterval(timerId);
      timerId = 0;
    }

    function isSolved() {
      return cells.every((value, index) => value === SOLVED[index]);
    }

    function swap(a, b) {
      [cells[a], cells[b]] = [cells[b], cells[a]];
    }

    function moveTile(tileId, options = {}) {
      const { silent = false } = options;
      if (destroyed || completion.hidden === false) return false;
      const tileIndex = cells.indexOf(tileId);
      const emptyIndex = cells.indexOf(EMPTY);
      if (!adjacentIndices(emptyIndex).includes(tileIndex)) return false;

      swap(tileIndex, emptyIndex);
      if (!silent) {
        if (!playing) {
          playing = true;
          status.textContent = 'Puzzle in progress.';
          startTimer();
        }
        moves += 1;
      }
      render();
      if (!silent && isSolved()) completePuzzle();
      return true;
    }

    function shuffledBoard() {
      cells = [...SOLVED];
      let previousEmpty = -1;
      for (let step = 0; step < 180; step += 1) {
        const emptyIndex = cells.indexOf(EMPTY);
        let options = adjacentIndices(emptyIndex).filter((index) => index !== previousEmpty);
        if (!options.length) options = adjacentIndices(emptyIndex);
        const selected = options[Math.floor(Math.random() * options.length)];
        previousEmpty = emptyIndex;
        swap(emptyIndex, selected);
      }
      if (isSolved()) swap(7, 8);
    }

    function hideCompletion() {
      completion.hidden = true;
      layout.removeAttribute('inert');
      header.removeAttribute('inert');
      intro.removeAttribute('inert');
    }

    function shuffle() {
      stopTimer();
      hideCompletion();
      moves = 0;
      elapsed = 0;
      playing = true;
      pausedByVisibility = false;
      shuffledBoard();
      status.textContent = 'Puzzle shuffled. Restore the painting.';
      render();
      startTimer();
      board.focus({ preventScroll: true });
    }

    function reset() {
      stopTimer();
      hideCompletion();
      cells = [...SOLVED];
      moves = 0;
      elapsed = 0;
      playing = false;
      pausedByVisibility = false;
      status.textContent = 'The painting has been reset. Shuffle to begin.';
      render();
      shuffleButton.focus({ preventScroll: true });
    }

    function completePuzzle() {
      stopTimer();
      playing = false;
      const isBest = writeBest({ moves, time: elapsed });
      bestValue.textContent = readBest();
      status.textContent = `Painting restored in ${moves} moves and ${formatTime(elapsed)}.`;
      completionResult.textContent = `You restored the painting in ${moves} moves and ${formatTime(elapsed)}.${isBest ? ' New best result.' : ''}`;
      layout.setAttribute('inert', '');
      header.setAttribute('inert', '');
      intro.setAttribute('inert', '');
      completion.hidden = false;
      if (!reducedMotion) root.classList.add('is-complete');
      window.setTimeout(() => {
        root.classList.remove('is-complete');
        playAgainButton.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 260);
    }

    function setPreview(active) {
      board.classList.toggle('is-previewing', active);
      previewButton.setAttribute('aria-pressed', String(active));
    }

    function preventBoardScroll(event) {
      if (event.cancelable) event.preventDefault();
    }

    function handleArrowKey(event) {
      const emptyIndex = cells.indexOf(EMPTY);
      const { row, col } = positionFor(emptyIndex);
      let tileIndex = -1;
      if (event.key === 'ArrowUp' && row < GRID - 1) tileIndex = emptyIndex + GRID;
      if (event.key === 'ArrowDown' && row > 0) tileIndex = emptyIndex - GRID;
      if (event.key === 'ArrowLeft' && col < GRID - 1) tileIndex = emptyIndex + 1;
      if (event.key === 'ArrowRight' && col > 0) tileIndex = emptyIndex - 1;
      if (tileIndex >= 0) {
        event.preventDefault();
        moveTile(cells[tileIndex]);
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        if (playing && timerId) {
          pausedByVisibility = true;
          stopTimer();
          status.textContent = 'Puzzle paused while this tab is hidden.';
        }
        return;
      }
      if (pausedByVisibility && playing) {
        pausedByVisibility = false;
        status.textContent = 'Puzzle resumed.';
        startTimer();
      }
    }

    function startPreview(event) {
      if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
      if (event.type === 'keydown') event.preventDefault();
      setPreview(true);
    }

    function stopPreview() {
      setPreview(false);
    }

    shuffleButton.addEventListener('click', shuffle);
    resetButton.addEventListener('click', reset);
    playAgainButton.addEventListener('click', shuffle);
    closeButton.addEventListener('click', onExit);
    board.addEventListener('keydown', handleArrowKey);
    board.addEventListener('touchmove', preventBoardScroll, { passive: false });
    previewButton.addEventListener('pointerdown', startPreview);
    previewButton.addEventListener('keydown', startPreview);
    ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur'].forEach((type) => {
      previewButton.addEventListener(type, stopPreview);
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    createTiles();

    return {
      focus() {
        shuffleButton.focus({ preventScroll: true });
      },
      destroy() {
        destroyed = true;
        playing = false;
        stopTimer();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        board.removeEventListener('touchmove', preventBoardScroll);
        container.replaceChildren();
      }
    };
  }

  global.TikusGames = global.TikusGames || {};
  global.TikusGames.slider = Object.freeze({
    id: 'slider',
    title: 'Tikus Slider',
    eyebrow: '3 × 3 PAINTING PUZZLE',
    description: 'Restore the Samasihat painting by sliding eight tiles into place.',
    duration: 'Untimed',
    controls: 'Tap adjacent tiles or use arrow keys',
    accent: 'puzzle',
    readBest,
    mount
  });
})(window);
