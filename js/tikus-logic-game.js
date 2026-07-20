(function registerTikusLogicGame(global) {
  'use strict';

  const STORAGE_KEY = 'tikus-logic-game-progress-v5';
  const MAX_PATCH_ATTEMPTS = 80;
  const STATE_ORDER = ['blank', 'maybe', 'no', 'yes'];
  const STATE_SYMBOLS = {
    blank: '',
    maybe: '○',
    no: '×',
    yes: '✓'
  };
  const STATE_NAMES = {
    blank: 'unknown',
    maybe: 'possible',
    no: 'ruled out',
    yes: 'confirmed'
  };

  const LEVELS = [
    {
      id: 'level-1',
      label: 'Level 1',
      shortTitle: 'Blackout',
      title: 'Blackout in the Sitting Room',
      description: 'Mark the deduction grids to work out where each person was and what they were carrying when the lights dipped.',
      sceneNote: 'The sitting room becomes an investigation board lit by lamp flicker, drifting dust and the storm outside.',
      sheetNotes: {
        rooms: 'Track who was seen in each part of the house.',
        objects: 'Track what each person was holding.'
      },
      characters: [
        { id: 'mimi', name: 'Mimi', role: 'Retreat co-founder' },
        { id: 'jay', name: 'Jay', role: 'Retreat co-founder' },
        { id: 'madam-boey', name: 'Madam Boey', role: 'Guest' },
        { id: 'guy', name: 'Guy', role: 'Traveller' }
      ],
      rooms: [
        { id: 'sitting-room', name: 'Sitting Room' },
        { id: 'kitchen', name: 'Kitchen' },
        { id: 'orchid-room', name: 'Orchid Room' },
        { id: 'veranda', name: 'Veranda' }
      ],
      objects: [
        { id: 'lantern', name: 'Lantern' },
        { id: 'guest-ledger', name: 'Guest ledger' },
        { id: 'teacup', name: 'Teacup' },
        { id: 'house-keys', name: 'House keys' }
      ],
      clues: [
        'The person carrying the lantern was not in the Kitchen or on the Veranda.',
        'Mimi was not in the Sitting Room, and she was checking neither the lantern nor the house keys.',
        'Madam Boey stayed away from the Kitchen and was carrying the teacup.',
        'Jay was closest to the rain and was holding the house keys.',
        'The guest ledger was being reviewed in the same room where meals are prepared.'
      ],
      hints: [
        'Jay can be fixed immediately: Veranda and house keys.',
        'If the guest ledger is in the Kitchen, Mimi is the best fit because she has neither lantern nor house keys.',
        'That leaves Guy with the lantern in the Sitting Room and Madam Boey with the teacup in the Orchid Room.'
      ],
      solution: {
        mimi: { room: 'kitchen', object: 'guest-ledger' },
        jay: { room: 'veranda', object: 'house-keys' },
        'madam-boey': { room: 'orchid-room', object: 'teacup' },
        guy: { room: 'sitting-room', object: 'lantern' }
      }
    },
    {
      id: 'level-2',
      label: 'Level 2',
      shortTitle: 'Back Door',
      title: 'Rain at the Back Door',
      description: 'Use the two deduction grids to map each person to the room and object tied to a noisy disturbance at the back of the house.',
      sceneNote: 'The storm sharpens here: colder light, harder rain and a more urgent atmosphere across the board.',
      sheetNotes: {
        rooms: 'Place each person around the back-of-house spaces.',
        objects: 'Match each person to the item they were seen with.'
      },
      characters: [
        { id: 'saladin', name: 'Saladin', role: 'Guest' },
        { id: 'alayna', name: 'Alayna', role: 'Guest' },
        { id: 'major-mansor', name: 'Major Mansor', role: 'Guest' },
        { id: 'inspektor-mislan', name: 'Inspektor Mislan', role: 'Police inspector' }
      ],
      rooms: [
        { id: 'kitchen', name: 'Kitchen' },
        { id: 'rear-corridor', name: 'Rear Corridor' },
        { id: 'dining-end', name: 'Dining End' },
        { id: 'store-nook', name: 'Store Nook' }
      ],
      objects: [
        { id: 'torch', name: 'Torch' },
        { id: 'umbrella', name: 'Umbrella' },
        { id: 'radio', name: 'Radio' },
        { id: 'parcel', name: 'Parcel' }
      ],
      clues: [
        'The umbrella ended up nearest the rain, but not in the Rear Corridor.',
        'Inspektor Mislan was not at the Dining End, and he kept the umbrella close.',
        'The radio was not in the Kitchen or the Store Nook.',
        'Major Mansor did not carry the parcel, and he stood somewhere more enclosed than Saladin.',
        'Saladin was not in the Kitchen.'
      ],
      hints: [
        'Because Inspektor Mislan keeps the umbrella and the umbrella is nearest the rain, try placing him in the Kitchen.',
        'The radio can only fit the Dining End, which points cleanly to Alayna.',
        'That leaves Major Mansor in the Store Nook with the torch, and Saladin in the Rear Corridor with the parcel.'
      ],
      solution: {
        saladin: { room: 'rear-corridor', object: 'parcel' },
        alayna: { room: 'dining-end', object: 'radio' },
        'major-mansor': { room: 'store-nook', object: 'torch' },
        'inspektor-mislan': { room: 'kitchen', object: 'umbrella' }
      }
    },
    {
      id: 'level-3',
      label: 'Level 3',
      shortTitle: 'After Midnight',
      title: 'The Late-Night Call',
      description: 'Complete the final pair of grids to reconstruct who was stationed where during a tense late-night moment and what each person had with them.',
      sceneNote: 'Longer shadows, a quieter glow and the sense of a house holding its breath shape the final board.',
      sheetNotes: {
        rooms: 'Rebuild the late-night positions around the house.',
        objects: 'Finish the final inventory of what each person carried.'
      },
      characters: [
        { id: 'mimi', name: 'Mimi', role: 'Retreat co-founder' },
        { id: 'jay', name: 'Jay', role: 'Retreat co-founder' },
        { id: 'major-mansor', name: 'Major Mansor', role: 'Guest' },
        { id: 'man', name: 'Man', role: 'A mysterious figure' }
      ],
      rooms: [
        { id: 'front-steps', name: 'Front Steps' },
        { id: 'reading-corner', name: 'Reading Corner' },
        { id: 'pantry', name: 'Pantry' },
        { id: 'orchid-room', name: 'Orchid Room' }
      ],
      objects: [
        { id: 'matchbox', name: 'Matchbox' },
        { id: 'thermos', name: 'Thermos' },
        { id: 'envelope', name: 'Envelope' },
        { id: 'raincoat', name: 'Raincoat' }
      ],
      clues: [
        'The raincoat was taken to the Front Steps.',
        'Mimi kept away from the Front Steps and was the only one handling paper.',
        'The thermos was not near the Pantry or the Reading Corner.',
        'Major Mansor was not in the Orchid Room and carried the matchbox.',
        'The Man was not on the Front Steps.'
      ],
      hints: [
        'The Front Steps and raincoat belong together, and Mimi cannot be there.',
        'Mimi’s paper clue points directly to the envelope in the Reading Corner.',
        'That leaves the thermos for the Man in the Orchid Room and the matchbox for Major Mansor in the Pantry.'
      ],
      solution: {
        mimi: { room: 'reading-corner', object: 'envelope' },
        jay: { room: 'front-steps', object: 'raincoat' },
        'major-mansor': { room: 'pantry', object: 'matchbox' },
        man: { room: 'orchid-room', object: 'thermos' }
      }
    }
  ];

  class TikusLogicGame {
    constructor() {
      this.dialog = null;
      this.elements = {};
      this.trigger = null;
      this.inertRecords = [];
      this.currentIndex = 0;
      this.progress = this.loadProgress();
      this.isPatched = false;

      this.handleCancel = this.handleCancel.bind(this);
      this.handleDialogClick = this.handleDialogClick.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
    }

    init() {
      this.patchHotspot();
      this.injectDialog();
      this.patchModalWhenReady();
    }

    patchHotspot() {
      const content = global.TIKUS_CONTENT;
      const sittingRoom = content && content.scenes && content.scenes['sitting-room'];
      if (!sittingRoom || !Array.isArray(sittingRoom.hotspots)) {
        return;
      }

      const hotspotIndex = sittingRoom.hotspots.findIndex((item) => item.id === 'main-sofa');
      if (hotspotIndex === -1) {
        return;
      }

      sittingRoom.hotspots[hotspotIndex] = {
        id: 'logic-game',
        x: 72,
        y: 68,
        label: 'Play the Gelap di Samasihat logic game',
        subject: 'Logic game',
        eyebrow: 'GELAP DI SAMASIHAT',
        title: 'Play the logic game',
        body: 'A spoiler-safe, non-canonical deduction board with three atmospheric levels.',
        type: 'game'
      };
    }

    injectDialog() {
      const dialog = document.createElement('dialog');
      dialog.className = 'game-dialog';
      dialog.id = 'logic-game-dialog';
      dialog.setAttribute('aria-labelledby', 'game-dialog-title');
      dialog.innerHTML = `
        <div class="game-dialog__surface" data-theme="level-1">
          <div class="game-dialog__inner">
            <div class="game-dialog__play-area" data-game-play-area>
              <header class="game-dialog__header">
                <div class="game-dialog__titleblock">
                  <p class="game-dialog__kicker">Gelap di Samasihat</p>
                  <h2 class="game-dialog__title" id="game-dialog-title">Blackout in the Sitting Room</h2>
                  <p class="game-dialog__description" data-game-description></p>
                  <p class="game-dialog__disclaimer">A spoiler-safe, non-canonical investigation game inspired by the world of TIKUS.</p>
                </div>
                <button class="game-dialog__close" type="button" data-game-close aria-label="Close logic game">×</button>
              </header>

              <nav class="game-level-tabs" aria-label="Logic game levels" data-game-level-tabs></nav>

              <div class="game-progress">
                <span data-game-progress-text>0 of 3 levels solved</span>
                <div class="game-progress__meter" aria-hidden="true">
                  <div class="game-progress__fill" data-game-progress-fill></div>
                </div>
              </div>

              <div class="game-layout">
                <section class="game-board" aria-labelledby="game-board-heading">
                  <div class="game-board__toplight" aria-hidden="true"></div>
                  <div class="game-board__rain" aria-hidden="true"></div>
                  <div class="game-board__dust" aria-hidden="true"></div>
                  <div class="game-board__inner">
                    <div class="game-board__headline">
                      <div>
                        <h3 id="game-board-heading" data-game-board-title></h3>
                        <p data-game-board-note></p>
                      </div>
                      <p data-game-board-objective></p>
                    </div>
                    <div class="game-board__sheets" data-game-sheets></div>
                  </div>
                </section>

                <aside class="game-sidepanel">
                  <section class="game-clue-panel" aria-labelledby="game-clues-heading">
                    <h4 id="game-clues-heading">Clue cards</h4>
                    <ol class="game-clue-list" data-game-clue-list></ol>
                    <div class="game-clue-panel__hint" data-game-hint-box>No hint shown yet.</div>
                  </section>

                  <section class="game-status-panel" aria-labelledby="game-status-heading">
                    <h4 id="game-status-heading">Case status</h4>
                    <p>Mark each square by clicking it: blank, maybe, ruled out or confirmed.</p>
                    <div class="game-status-panel__result" data-game-result data-tone="neutral">Complete both grids and check the board.</div>
                    <div class="game-status-panel__stamp" data-game-stamp aria-hidden="true">Case noted</div>
                  </section>

                  <section class="game-legend-panel" aria-labelledby="game-legend-heading">
                    <h4 id="game-legend-heading">Marking key</h4>
                    <ul class="game-legend-list">
                      <li><b>○</b><span>Possible match</span></li>
                      <li><b>×</b><span>Ruled out</span></li>
                      <li><b>✓</b><span>Confirmed match</span></li>
                    </ul>
                  </section>

                  <section class="game-actions-panel" aria-labelledby="game-actions-heading">
                    <h4 id="game-actions-heading">Board controls</h4>
                    <p>Confirming a square automatically rules out the rest of its row and column in that grid.</p>
                    <div class="game-actions">
                      <button class="game-button" type="button" data-game-action="hint">Show next hint</button>
                      <button class="game-button" type="button" data-game-action="reset">Reset level</button>
                      <button class="game-button game-button--primary" type="button" data-game-action="check">Check board</button>
                      <button class="game-button" type="button" data-game-action="next">Next level</button>
                    </div>
                  </section>
                </aside>
              </div>

              <p class="game-dialog__footer">Tip: Tab into any square and press Enter or Space to cycle its state.</p>
            </div>

            <section class="game-intro" data-game-intro aria-labelledby="game-intro-title" aria-describedby="game-intro-body" hidden>
              <div class="game-intro__card">
                <p class="game-intro__eyebrow">How to play</p>
                <h3 class="game-intro__title" id="game-intro-title">Read the clues. Mark the board. Solve the room.</h3>
                <p class="game-intro__body" id="game-intro-body">This mini-game is a spoiler-safe deduction puzzle. You will use two paper grids to decide where each person was and what they were carrying.</p>
                <div class="game-intro__notes">
                  <article class="game-intro__note">
                    <strong>1. Mark each square</strong>
                    <p>Click or press Enter on a square to cycle it through blank, <b>○</b> possible, <b>×</b> ruled out and <b>✓</b> confirmed.</p>
                  </article>
                  <article class="game-intro__note">
                    <strong>2. Use the clue cards</strong>
                    <p>Every clue narrows the options. When a square is confirmed, the rest of that row and column in the same grid are ruled out automatically.</p>
                  </article>
                  <article class="game-intro__note">
                    <strong>3. Check the case board</strong>
                    <p>Each person needs one confirmed room and one confirmed object. When both grids are complete, use <b>Check board</b>.</p>
                  </article>
                </div>
                <div class="game-intro__actions">
                  <button class="game-intro__button game-intro__button--primary" type="button" data-game-intro-start>Start level</button>
                  <button class="game-intro__button" type="button" data-game-intro-close>Close</button>
                </div>
              </div>
            </section>

            <div class="game-solve-flash" data-game-solve-flash aria-hidden="true">
              <div class="game-solve-flash__rings"></div>
              <div class="game-solve-flash__label">Case Closed</div>
            </div>

            <section class="game-level-summary" data-game-summary aria-labelledby="game-summary-title" aria-describedby="game-summary-body" hidden>
              <div class="game-level-summary__card">
                <p class="game-level-summary__eyebrow">Case board complete</p>
                <h3 class="game-level-summary__title" id="game-summary-title" data-game-summary-title>Level complete</h3>
                <p class="game-level-summary__body" id="game-summary-body" data-game-summary-body></p>
                <ul class="game-level-summary__list" data-game-summary-list></ul>
                <div class="game-level-summary__actions">
                  <button class="game-level-summary__button game-level-summary__button--primary" type="button" data-game-summary-continue>Continue</button>
                  <button class="game-level-summary__button" type="button" data-game-summary-review>Review board</button>
                </div>
              </div>
            </section>

            <p class="game-live-region" aria-live="polite" aria-atomic="true" data-game-live></p>
          </div>
        </div>
      `;

      document.body.appendChild(dialog);
      this.dialog = dialog;
      this.elements.surface = dialog.querySelector('.game-dialog__surface');
      this.elements.playArea = dialog.querySelector('[data-game-play-area]');
      this.elements.intro = dialog.querySelector('[data-game-intro]');
      this.elements.introStart = dialog.querySelector('[data-game-intro-start]');
      this.elements.title = dialog.querySelector('#game-dialog-title');
      this.elements.description = dialog.querySelector('[data-game-description]');
      this.elements.levelTabs = dialog.querySelector('[data-game-level-tabs]');
      this.elements.progressText = dialog.querySelector('[data-game-progress-text]');
      this.elements.progressFill = dialog.querySelector('[data-game-progress-fill]');
      this.elements.boardTitle = dialog.querySelector('[data-game-board-title]');
      this.elements.boardNote = dialog.querySelector('[data-game-board-note]');
      this.elements.boardObjective = dialog.querySelector('[data-game-board-objective]');
      this.elements.sheets = dialog.querySelector('[data-game-sheets]');
      this.elements.clueList = dialog.querySelector('[data-game-clue-list]');
      this.elements.hintBox = dialog.querySelector('[data-game-hint-box]');
      this.elements.result = dialog.querySelector('[data-game-result]');
      this.elements.board = dialog.querySelector('.game-board');
      this.elements.stamp = dialog.querySelector('[data-game-stamp]');
      this.elements.solveFlash = dialog.querySelector('[data-game-solve-flash]');
      this.elements.summary = dialog.querySelector('[data-game-summary]');
      this.elements.summaryTitle = dialog.querySelector('[data-game-summary-title]');
      this.elements.summaryBody = dialog.querySelector('[data-game-summary-body]');
      this.elements.summaryList = dialog.querySelector('[data-game-summary-list]');
      this.elements.summaryContinue = dialog.querySelector('[data-game-summary-continue]');
      this.elements.live = dialog.querySelector('[data-game-live]');

      dialog.addEventListener('cancel', this.handleCancel);
      dialog.addEventListener('click', this.handleDialogClick);
      dialog.addEventListener('keydown', this.handleKeydown);
    }

    patchModalWhenReady(attempt = 0) {
      if (this.isPatched) {
        return;
      }

      if (global.TikusMicrosite && global.TikusMicrosite.modal) {
        const modal = global.TikusMicrosite.modal;
        const originalOpen = modal.open.bind(modal);

        modal.open = (content, trigger) => {
          if (content && content.type === 'game') {
            this.open(trigger);
            return;
          }
          originalOpen(content, trigger);
        };

        this.isPatched = true;
        return;
      }

      if (attempt < MAX_PATCH_ATTEMPTS) {
        window.setTimeout(() => this.patchModalWhenReady(attempt + 1), 100);
      }
    }

    open(trigger) {
      this.trigger = trigger || null;
      this.currentIndex = this.firstAvailableIndex();
      this.renderCurrentLevel();
      this.showIntro();
      this.setBackgroundInert(true);
      document.body.classList.add('has-open-dialog');

      if (typeof this.dialog.showModal === 'function') {
        this.dialog.showModal();
      } else {
        this.dialog.setAttribute('open', 'open');
      }

      window.requestAnimationFrame(() => this.elements.introStart && this.elements.introStart.focus());
    }

    close() {
      if (!this.dialog.open) {
        return;
      }

      if (typeof this.dialog.close === 'function') {
        this.dialog.close();
      } else {
        this.dialog.removeAttribute('open');
      }

      this.hideIntro();
      this.hideLevelSummary({ restorePlayArea: false });
      if (this.elements.solveFlash) {
        this.elements.solveFlash.classList.remove('is-active');
      }
      this.setBackgroundInert(false);
      document.body.classList.remove('has-open-dialog');

      const trigger = this.trigger;
      this.trigger = null;
      if (trigger instanceof HTMLElement && document.contains(trigger)) {
        window.requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
      }
    }

    showIntro() {
      this.elements.intro.hidden = false;
      this.elements.playArea.inert = true;
      this.elements.playArea.setAttribute('aria-hidden', 'true');
      window.requestAnimationFrame(() => {
        this.elements.intro.classList.add('is-visible');
      });
    }

    hideIntro() {
      this.elements.intro.classList.remove('is-visible');
      this.elements.intro.hidden = true;
      this.elements.playArea.inert = false;
      this.elements.playArea.removeAttribute('aria-hidden');
    }

    handleCancel(event) {
      event.preventDefault();
      this.close();
    }

    handleDialogClick(event) {
      if (event.target === this.dialog) {
        this.close();
        return;
      }

      const introStart = event.target.closest('[data-game-intro-start]');
      if (introStart) {
        this.hideIntro();
        const nextFocus = this.elements.levelTabs.querySelector('button:not(:disabled)') || this.dialog.querySelector('[data-grid-cell]');
        if (nextFocus) {
          nextFocus.focus();
        }
        return;
      }

      const introClose = event.target.closest('[data-game-intro-close]');
      if (introClose) {
        this.close();
        return;
      }

      const summaryContinue = event.target.closest('[data-game-summary-continue]');
      if (summaryContinue) {
        this.continueFromSummary();
        return;
      }

      const summaryReview = event.target.closest('[data-game-summary-review]');
      if (summaryReview) {
        this.reviewCompletedBoard();
        return;
      }

      const cellButton = event.target.closest('[data-grid-cell]');
      if (cellButton) {
        this.cycleGridCell(cellButton);
        return;
      }

      const levelButton = event.target.closest('[data-game-level]');
      if (levelButton) {
        const index = Number(levelButton.dataset.gameLevel);
        if (!Number.isNaN(index) && this.isLevelUnlocked(index)) {
          this.currentIndex = index;
          this.renderCurrentLevel();
        }
        return;
      }

      const closeButton = event.target.closest('[data-game-close]');
      if (closeButton) {
        this.close();
        return;
      }

      const actionButton = event.target.closest('[data-game-action]');
      if (!actionButton) {
        return;
      }

      switch (actionButton.dataset.gameAction) {
        case 'hint':
          this.showNextHint();
          break;
        case 'reset':
          this.resetCurrentLevel();
          break;
        case 'check':
          this.checkCurrentLevel();
          break;
        case 'next':
          this.moveToNextLevel();
          break;
        default:
          break;
      }
    }

    handleKeydown(event) {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-grid-cell]')) {
        event.preventDefault();
        this.cycleGridCell(event.target);
        return;
      }

      if (event.key === 'Tab') {
        this.trapFocus(event);
      }
    }

    cycleGridCell(button) {
      const level = this.getCurrentLevel();
      const gridType = button.dataset.gridType;
      const rowId = button.dataset.rowId;
      const columnId = button.dataset.columnId;
      const boardState = this.getBoardState(level.id);
      const gridState = boardState[gridType];
      const currentState = gridState[rowId][columnId];
      const nextState = STATE_ORDER[(STATE_ORDER.indexOf(currentState) + 1) % STATE_ORDER.length];

      gridState[rowId][columnId] = nextState;

      if (nextState === 'yes') {
        Object.keys(gridState[rowId]).forEach((otherColumn) => {
          if (otherColumn !== columnId) {
            gridState[rowId][otherColumn] = 'no';
          }
        });

        Object.keys(gridState).forEach((otherRow) => {
          if (otherRow !== rowId) {
            gridState[otherRow][columnId] = 'no';
          }
        });
      }

      this.persistProgress();
      this.renderSheets(level, boardState);
      this.updateResultForInteraction(nextState, rowId, columnId, gridType);
      const refocus = this.dialog.querySelector(`[data-grid-type="${gridType}"][data-row-id="${rowId}"][data-column-id="${columnId}"]`);
      if (refocus) {
        refocus.focus();
      }
    }

    updateResultForInteraction(nextState, rowId, columnId, gridType) {
      const level = this.getCurrentLevel();
      const collection = gridType === 'rooms' ? level.rooms : level.objects;
      const item = collection.find((entry) => entry.id === columnId);
      const character = level.characters.find((entry) => entry.id === rowId);
      if (!item || !character) {
        return;
      }

      this.elements.result.dataset.tone = 'neutral';
      this.elements.result.textContent = `${character.name}: ${item.name} marked as ${STATE_NAMES[nextState]}.`;
      this.announce(`${character.name}, ${item.name}, ${STATE_NAMES[nextState]}.`);
    }

    getCurrentLevel() {
      return LEVELS[this.currentIndex];
    }

    loadProgress() {
      try {
        const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
        return {
          solved: Array.isArray(parsed.solved) ? parsed.solved : [],
          boards: parsed.boards && typeof parsed.boards === 'object' ? parsed.boards : {},
          hints: parsed.hints && typeof parsed.hints === 'object' ? parsed.hints : {}
        };
      } catch (error) {
        return { solved: [], boards: {}, hints: {} };
      }
    }

    persistProgress() {
      try {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
      } catch (error) {
        // Ignore storage errors.
      }
    }

    firstAvailableIndex() {
      const firstLocked = LEVELS.findIndex((_, index) => !this.isLevelUnlocked(index));
      if (firstLocked === -1) {
        return 0;
      }
      return Math.max(0, firstLocked - 1);
    }

    isLevelSolved(levelId) {
      return this.progress.solved.includes(levelId);
    }

    isLevelUnlocked(index) {
      if (index === 0) {
        return true;
      }
      return this.isLevelSolved(LEVELS[index - 1].id);
    }

    createBlankGridState(level, entries, columns) {
      return entries.reduce((entryAccumulator, entry) => {
        entryAccumulator[entry.id] = columns.reduce((columnAccumulator, column) => {
          columnAccumulator[column.id] = 'blank';
          return columnAccumulator;
        }, {});
        return entryAccumulator;
      }, {});
    }

    getBoardState(levelId) {
      if (!this.progress.boards[levelId]) {
        const level = LEVELS.find((item) => item.id === levelId);
        this.progress.boards[levelId] = {
          rooms: this.createBlankGridState(level, level.characters, level.rooms),
          objects: this.createBlankGridState(level, level.characters, level.objects)
        };
      }
      return this.progress.boards[levelId];
    }

    getHintIndex(levelId) {
      return Number(this.progress.hints[levelId] || 0);
    }

    setHintIndex(levelId, nextIndex) {
      this.progress.hints[levelId] = nextIndex;
      this.persistProgress();
    }

    renderCurrentLevel() {
      const level = this.getCurrentLevel();
      const boardState = this.getBoardState(level.id);
      this.elements.surface.dataset.theme = level.id;
      this.elements.title.textContent = level.title;
      this.elements.description.textContent = level.description;
      this.elements.boardTitle.textContent = level.title;
      this.elements.boardNote.textContent = level.sceneNote;
      this.elements.boardObjective.textContent = `${level.characters.length} people · ${level.rooms.length} rooms · ${level.objects.length} objects`;
      this.elements.hintBox.textContent = this.getHintIndex(level.id) > 0
        ? level.hints[this.getHintIndex(level.id) - 1]
        : 'No hint shown yet.';
      this.elements.result.dataset.tone = this.isLevelSolved(level.id) ? 'success' : 'neutral';
      this.elements.result.textContent = this.isLevelSolved(level.id)
        ? 'Level already solved. Revisit the board or move to the next one.'
        : 'Complete both grids and check the board.';
      this.elements.stamp.textContent = this.isLevelSolved(level.id)
        ? (level.id === 'level-3' ? 'House mapped' : 'Case closed')
        : 'Case noted';
      this.elements.stamp.classList.toggle('is-visible', this.isLevelSolved(level.id));
      this.renderLevelTabs();
      this.renderProgress();
      this.renderClues(level);
      this.renderSheets(level, boardState);
    }

    renderLevelTabs() {
      const fragment = document.createDocumentFragment();
      LEVELS.forEach((level, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'game-level-tab';
        button.dataset.gameLevel = String(index);
        button.disabled = !this.isLevelUnlocked(index);
        if (index === this.currentIndex) {
          button.classList.add('is-active');
          button.setAttribute('aria-current', 'true');
        }
        if (this.isLevelSolved(level.id)) {
          button.classList.add('is-solved');
        }
        button.innerHTML = `<strong>${level.label}</strong><small>${level.shortTitle}</small>`;
        fragment.appendChild(button);
      });
      this.elements.levelTabs.replaceChildren(fragment);
    }

    renderProgress() {
      const solvedCount = this.progress.solved.length;
      this.elements.progressText.textContent = `${solvedCount} of ${LEVELS.length} levels solved`;
      this.elements.progressFill.style.width = `${(solvedCount / LEVELS.length) * 100}%`;
    }

    renderClues(level) {
      const fragment = document.createDocumentFragment();
      level.clues.forEach((clue, index) => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>Clue ${index + 1}</strong><span>${clue}</span>`;
        fragment.appendChild(item);
      });
      this.elements.clueList.replaceChildren(fragment);
    }

    renderSheets(level, boardState) {
      const roomSheet = this.createGridSheet({
        gridType: 'rooms',
        title: 'Character × Room',
        subtitle: 'Who was where?',
        note: level.sheetNotes.rooms,
        rows: level.characters,
        columns: level.rooms,
        states: boardState.rooms
      });

      const objectSheet = this.createGridSheet({
        gridType: 'objects',
        title: 'Character × Object',
        subtitle: 'Who carried what?',
        note: level.sheetNotes.objects,
        rows: level.characters,
        columns: level.objects,
        states: boardState.objects
      });

      this.elements.sheets.replaceChildren(roomSheet, objectSheet);
    }

    createGridSheet({ gridType, title, subtitle, note, rows, columns, states }) {
      const sheet = document.createElement('section');
      sheet.className = 'game-grid-sheet';

      const table = document.createElement('table');
      table.className = 'game-grid';
      table.setAttribute('aria-label', `${title} deduction grid`);

      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      const corner = document.createElement('th');
      corner.className = 'game-grid__corner';
      corner.scope = 'col';
      corner.textContent = 'Character';
      headRow.appendChild(corner);

      columns.forEach((column) => {
        const header = document.createElement('th');
        header.className = 'game-grid__column';
        header.scope = 'col';
        header.innerHTML = `
          <span class="game-grid__column-inner">
            <span class="game-grid__icon" data-icon="${column.id}" aria-hidden="true"></span>
            <span class="game-grid__column-label">${column.name}</span>
          </span>
        `;
        headRow.appendChild(header);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      rows.forEach((row) => {
        const tr = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.className = 'game-grid__row';
        rowHeader.scope = 'row';
        rowHeader.innerHTML = `<strong>${row.name}</strong><span>${row.role}</span>`;
        tr.appendChild(rowHeader);

        columns.forEach((column) => {
          const td = document.createElement('td');
          const state = states[row.id][column.id];
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'game-grid__cell-button';
          button.dataset.gridCell = 'true';
          button.dataset.gridType = gridType;
          button.dataset.rowId = row.id;
          button.dataset.columnId = column.id;
          button.dataset.state = state;
          button.setAttribute('aria-label', `${row.name} and ${column.name}: ${STATE_NAMES[state]}`);
          button.textContent = STATE_SYMBOLS[state];
          td.appendChild(button);
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      sheet.innerHTML = `
        <span class="game-grid-sheet__tape game-grid-sheet__tape--left" aria-hidden="true"></span>
        <span class="game-grid-sheet__tape game-grid-sheet__tape--right" aria-hidden="true"></span>
        <div class="game-grid-sheet__content">
          <div class="game-grid-sheet__heading">
            <h4>${title}</h4>
            <p>${subtitle}</p>
          </div>
          <p class="game-grid-sheet__scribble">${note}</p>
          <div class="game-grid-wrap"></div>
          <div class="game-grid-sheet__legend">
            <span><em>○</em>Possible</span>
            <span><em>×</em>Ruled out</span>
            <span><em>✓</em>Confirmed</span>
          </div>
        </div>
      `;
      sheet.querySelector('.game-grid-wrap').appendChild(table);
      return sheet;
    }

    showNextHint() {
      const level = this.getCurrentLevel();
      const current = this.getHintIndex(level.id);
      const next = Math.min(current + 1, level.hints.length);
      this.setHintIndex(level.id, next);
      this.elements.hintBox.textContent = level.hints[next - 1] || level.hints[level.hints.length - 1] || 'No hints available.';
      this.announce(`Hint ${next} shown for ${level.label}.`);
    }

    resetCurrentLevel() {
      const level = this.getCurrentLevel();
      this.progress.boards[level.id] = {
        rooms: this.createBlankGridState(level, level.characters, level.rooms),
        objects: this.createBlankGridState(level, level.characters, level.objects)
      };
      this.progress.hints[level.id] = 0;
      this.persistProgress();
      this.elements.hintBox.textContent = 'No hint shown yet.';
      this.elements.result.dataset.tone = 'neutral';
      this.elements.result.textContent = 'Level reset. Start marking the grids again.';
      this.elements.stamp.classList.remove('is-visible', 'is-bursting');
      if (this.elements.solveFlash) {
        this.elements.solveFlash.classList.remove('is-active');
      }
      this.renderSheets(level, this.progress.boards[level.id]);
      this.announce(`${level.label} reset.`);
    }

    evaluateGrid(gridState, rows, solution, key) {
      let fullyCorrect = true;
      let correctMatches = 0;
      let confirmedCount = 0;
      const confirmedTargets = [];

      rows.forEach((row) => {
        const states = gridState[row.id];
        const yesColumns = Object.keys(states).filter((columnId) => states[columnId] === 'yes');
        confirmedCount += yesColumns.length;
        yesColumns.forEach((columnId) => confirmedTargets.push(columnId));

        if (yesColumns.length !== 1 || yesColumns[0] !== solution[row.id][key]) {
          fullyCorrect = false;
        } else {
          correctMatches += 1;
        }
      });

      if (new Set(confirmedTargets).size !== confirmedTargets.length) {
        fullyCorrect = false;
      }

      return { fullyCorrect, correctMatches, confirmedCount };
    }

    checkCurrentLevel() {
      const level = this.getCurrentLevel();
      const boardState = this.getBoardState(level.id);
      const roomResult = this.evaluateGrid(boardState.rooms, level.characters, level.solution, 'room');
      const objectResult = this.evaluateGrid(boardState.objects, level.characters, level.solution, 'object');

      if (roomResult.confirmedCount < level.characters.length || objectResult.confirmedCount < level.characters.length) {
        this.elements.result.dataset.tone = 'warning';
        this.elements.result.textContent = 'Each character needs one confirmed room and one confirmed object before the board can be checked.';
        this.elements.stamp.classList.remove('is-visible', 'is-bursting');
        if (this.elements.solveFlash) {
          this.elements.solveFlash.classList.remove('is-active');
        }
        this.triggerWrongFeedback();
        this.announce('Not enough confirmed squares to check the board.');
        return;
      }

      if (roomResult.fullyCorrect && objectResult.fullyCorrect) {
        if (!this.isLevelSolved(level.id)) {
          this.progress.solved.push(level.id);
          this.progress.solved = LEVELS.map((item) => item.id).filter((id) => this.progress.solved.includes(id));
        }
        this.persistProgress();
        this.elements.result.dataset.tone = 'success';
        this.elements.result.textContent = level.id === 'level-3'
          ? 'Correct. You completed the final board and solved all three levels.'
          : 'Correct. This board lines up perfectly. You can move to the next level.';
        this.triggerSolvedTransition(level);
        window.setTimeout(() => this.showLevelSummary(level), 680);
        this.announce(`${level.label} solved.`);
        return;
      }

      const totalCorrect = roomResult.correctMatches + objectResult.correctMatches;
      const totalExpected = level.characters.length * 2;
      this.elements.result.dataset.tone = 'warning';
      this.elements.result.textContent = `Not quite. ${totalCorrect} of ${totalExpected} confirmed row matches are correct across both grids.`;
      this.elements.stamp.classList.remove('is-visible', 'is-bursting');
      this.triggerWrongFeedback();
      this.announce(`${level.label} not solved yet.`);
    }

    triggerWrongFeedback() {
      if (!this.elements.board || !this.elements.result) {
        return;
      }

      this.elements.board.classList.remove('is-wrong-check');
      this.elements.result.classList.remove('is-wrong-check');
      window.requestAnimationFrame(() => {
        this.elements.board.classList.add('is-wrong-check');
        this.elements.result.classList.add('is-wrong-check');
        window.setTimeout(() => {
          this.elements.board && this.elements.board.classList.remove('is-wrong-check');
          this.elements.result && this.elements.result.classList.remove('is-wrong-check');
        }, 620);
      });
    }

    showLevelSummary(level) {
      if (!this.dialog.open) {
        return;
      }

      if (!this.elements.summary) {
        this.renderLevelTabs();
        this.renderProgress();
        return;
      }

      const nextLevel = LEVELS[this.currentIndex + 1] || null;
      this.elements.summaryTitle.textContent = level.id === 'level-3'
        ? 'All case boards complete'
        : `${level.label} complete`;
      this.elements.summaryBody.textContent = level.id === 'level-3'
        ? 'The final non-canonical puzzle board has been resolved. Review the completed matches or close the game.'
        : `The evidence now forms one consistent arrangement. Review the completed matches before ${nextLevel.label} becomes available.`;
      this.elements.summaryContinue.textContent = nextLevel ? `Continue to ${nextLevel.label}` : 'Close game';

      const fragment = document.createDocumentFragment();
      level.characters.forEach((character) => {
        const answer = level.solution[character.id];
        const room = level.rooms.find((item) => item.id === answer.room);
        const object = level.objects.find((item) => item.id === answer.object);
        const item = document.createElement('li');
        item.innerHTML = `
          <strong>${character.name}</strong>
          <span>${room ? room.name : answer.room}</span>
          <em>${object ? object.name : answer.object}</em>
        `;
        fragment.appendChild(item);
      });
      this.elements.summaryList.replaceChildren(fragment);

      this.elements.playArea.inert = true;
      this.elements.playArea.setAttribute('aria-hidden', 'true');
      this.elements.summary.hidden = false;
      window.requestAnimationFrame(() => {
        this.elements.summary.classList.add('is-visible');
        this.elements.summaryContinue.focus();
      });
    }

    hideLevelSummary(options = {}) {
      const { restorePlayArea = true } = options;
      if (!this.elements.summary) {
        return;
      }
      this.elements.summary.classList.remove('is-visible');
      this.elements.summary.hidden = true;
      if (restorePlayArea) {
        this.elements.playArea.inert = false;
        this.elements.playArea.removeAttribute('aria-hidden');
      }
    }

    continueFromSummary() {
      const nextIndex = this.currentIndex + 1;
      this.hideLevelSummary();
      this.renderLevelTabs();
      this.renderProgress();

      if (nextIndex >= LEVELS.length) {
        this.close();
        return;
      }

      this.currentIndex = nextIndex;
      this.renderCurrentLevel();
      const firstCell = this.dialog.querySelector('[data-grid-cell]');
      if (firstCell) {
        firstCell.focus();
      }
      this.announce(`${LEVELS[this.currentIndex].label} loaded.`);
    }

    reviewCompletedBoard() {
      this.hideLevelSummary();
      this.renderLevelTabs();
      this.renderProgress();
      const checkButton = this.dialog.querySelector('[data-game-action="check"]');
      if (checkButton) {
        checkButton.focus();
      }
      this.announce('Completed board ready for review.');
    }

    moveToNextLevel() {
      const nextIndex = Math.min(this.currentIndex + 1, LEVELS.length - 1);
      if (!this.isLevelUnlocked(nextIndex)) {
        this.elements.result.dataset.tone = 'warning';
        this.elements.result.textContent = 'Solve the current level to unlock the next one.';
        this.announce('Next level is still locked.');
        return;
      }
      this.currentIndex = nextIndex;
      this.renderCurrentLevel();
      this.announce(`${LEVELS[this.currentIndex].label} loaded.`);
    }

    triggerSolvedTransition(level) {
      const stampLabel = level.id === 'level-3' ? 'House mapped' : 'Case closed';
      this.elements.stamp.textContent = stampLabel;
      this.elements.stamp.classList.remove('is-visible', 'is-bursting');
      if (this.elements.solveFlash) {
        const flashLabel = this.elements.solveFlash.querySelector('.game-solve-flash__label');
        if (flashLabel) {
          flashLabel.textContent = stampLabel;
        }
        this.elements.solveFlash.classList.remove('is-active');
      }

      window.requestAnimationFrame(() => {
        this.elements.stamp.classList.add('is-visible', 'is-bursting');
        if (this.elements.solveFlash) {
          this.elements.solveFlash.classList.add('is-active');
          window.setTimeout(() => {
            this.elements.solveFlash && this.elements.solveFlash.classList.remove('is-active');
          }, 760);
        }
        window.setTimeout(() => {
          this.elements.stamp && this.elements.stamp.classList.remove('is-bursting');
        }, 820);
      });
    }

    announce(message) {
      this.elements.live.textContent = message;
    }

    trapFocus(event) {
      const focusable = this.getFocusable();
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

    getFocusable() {
      const selector = [
        'button:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');

      return Array.from(this.dialog.querySelectorAll(selector)).filter((element) => {
        if (element.hasAttribute('hidden')) {
          return false;
        }
        if (element.closest('[inert]')) {
          return false;
        }
        return element.getClientRects().length > 0;
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

  const game = new TikusLogicGame();
  game.init();
  global.TikusLogicGame = game;
})(window);
