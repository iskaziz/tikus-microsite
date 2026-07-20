(function registerTikusLogicGame(global) {
  'use strict';

  const STYLE_PATH = 'css/game.css?v=mobile-v2';
  const STORAGE_KEY = 'tikus-logic-game-progress-v1';
  const HOTSPOT_ID = 'logic-game';
  const DEFAULT_PUZZLE_ID = 'blackout';

  const PUZZLES = Object.freeze({
    blackout: Object.freeze({
      id: 'blackout',
      title: 'Gelap di Samasihat',
      eyebrow: 'A TIKUS LOGIC PUZZLE',
      introduction:
        'The electricity has failed. Use the clues to determine where each person was and which object each person carried.',
      disclaimer:
        'This is a non-canonical puzzle inspired by the world of TIKUS. Its solution does not reveal the film’s murderer or ending.',
      characters: Object.freeze([
        Object.freeze({ id: 'mimi', name: 'Mimi', mark: 'M' }),
        Object.freeze({ id: 'jay', name: 'Jay', mark: 'J' }),
        Object.freeze({ id: 'saladin', name: 'Saladin', mark: 'S' }),
        Object.freeze({ id: 'alayna', name: 'Alayna', mark: 'A' })
      ]),
      locations: Object.freeze([
        Object.freeze({
          id: 'sitting-room',
          name: 'Sitting Room',
          shortName: 'Sitting Room',
          furnishing: 'sofa'
        }),
        Object.freeze({
          id: 'kitchen',
          name: 'Kitchen',
          shortName: 'Kitchen',
          furnishing: 'counter'
        }),
        Object.freeze({
          id: 'orchid-room',
          name: 'Orchid Room',
          shortName: 'Orchid Room',
          furnishing: 'bed'
        }),
        Object.freeze({
          id: 'front-porch',
          name: 'Front Porch',
          shortName: 'Front Porch',
          furnishing: 'steps'
        })
      ]),
      objects: Object.freeze([
        Object.freeze({ id: 'teacup', name: 'Teacup', shortLabel: 'CUP' }),
        Object.freeze({ id: 'flashlight', name: 'Flashlight', shortLabel: 'LIGHT' }),
        Object.freeze({ id: 'sketchbook', name: 'Sketchbook', shortLabel: 'BOOK' }),
        Object.freeze({ id: 'headphones', name: 'Headphones', shortLabel: 'AUDIO' })
      ]),
      clues: Object.freeze([
        'Jay carried the flashlight.',
        'The person wearing the headphones was in the Orchid Room.',
        'Saladin was in the Sitting Room.',
        'The sketchbook was in the same room as Saladin.',
        'Mimi was neither in the Sitting Room nor the Orchid Room.',
        'Alayna was neither in the Kitchen nor on the Front Porch.',
        'The teacup stayed indoors, but it was not in the Sitting Room.',
        'The flashlight was the only object taken outside.'
      ]),
      solution: Object.freeze({
        mimi: Object.freeze({ location: 'kitchen', object: 'teacup' }),
        jay: Object.freeze({ location: 'front-porch', object: 'flashlight' }),
        saladin: Object.freeze({ location: 'sitting-room', object: 'sketchbook' }),
        alayna: Object.freeze({ location: 'orchid-room', object: 'headphones' })
      })
    })
  });

  function injectStylesheet() {
    if (document.querySelector(`link[href="${STYLE_PATH}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLE_PATH;
    link.dataset.tikusGameStyles = 'true';
    document.head.append(link);
  }

  function replaceSittingRoomHotspot() {
    const content = global.TIKUS_CONTENT;
    const room = content && content.scenes && content.scenes['sitting-room'];

    if (!room || !Array.isArray(room.hotspots)) return false;

    const existingIndex = room.hotspots.findIndex(
      (hotspot) => hotspot && (hotspot.id === 'main-sofa' || hotspot.id === HOTSPOT_ID)
    );

    if (existingIndex < 0) return false;

    room.hotspots[existingIndex] = {
      id: HOTSPOT_ID,
      type: 'game',
      gameId: DEFAULT_PUZZLE_ID,
      x: 72,
      y: 68,
      label: 'Play the Gelap di Samasihat logic puzzle',
      subject: 'Logic puzzle',
      eyebrow: 'INTERACTIVE CASE',
      title: 'Gelap di Samasihat',
      body:
        'Reconstruct where four people were during a fictional blackout. This self-contained challenge is inspired by TIKUS but does not reveal the film’s mystery.'
    };

    return true;
  }

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof textContent === 'string') element.textContent = textContent;
    return element;
  }

  function createGameDialog() {
    const existing = document.getElementById('logic-game-dialog');
    if (existing) return existing;

    const dialog = createElement('dialog', 'logic-game-dialog');
    dialog.id = 'logic-game-dialog';
    dialog.setAttribute('aria-labelledby', 'logic-game-title');
    dialog.setAttribute('aria-describedby', 'logic-game-introduction');

    const shell = createElement('div', 'logic-game');
    shell.dataset.gameRoot = '';

    const rings = createElement('div', 'logic-game__rings');
    rings.setAttribute('aria-hidden', 'true');

    const grain = createElement('div', 'logic-game__grain');
    grain.setAttribute('aria-hidden', 'true');

    const header = createElement('header', 'logic-game__header');
    const headingGroup = createElement('div', 'logic-game__heading-group');
    const eyebrow = createElement('p', 'logic-game__eyebrow', 'A TIKUS LOGIC PUZZLE');
    eyebrow.dataset.gameEyebrow = '';
    const title = createElement('h2', 'logic-game__title', 'Gelap di Samasihat');
    title.id = 'logic-game-title';
    title.dataset.gameTitle = '';
    headingGroup.append(eyebrow, title);

    const closeButton = createElement('button', 'logic-game__close', '×');
    closeButton.type = 'button';
    closeButton.dataset.gameClose = '';
    closeButton.setAttribute('aria-label', 'Close game and return to the Sitting Room');
    header.append(headingGroup, closeButton);

    const introBlock = createElement('div', 'logic-game__intro');
    const introduction = createElement('p', 'logic-game__introduction');
    introduction.id = 'logic-game-introduction';
    introduction.dataset.gameIntroduction = '';
    const disclaimer = createElement('p', 'logic-game__disclaimer');
    disclaimer.dataset.gameDisclaimer = '';
    const previousBadge = createElement('p', 'logic-game__previous');
    previousBadge.dataset.gamePrevious = '';
    previousBadge.hidden = true;
    introBlock.append(introduction, disclaimer, previousBadge);

    const body = createElement('div', 'logic-game__body');

    const boardPanel = createElement('section', 'logic-game__board-panel');
    boardPanel.setAttribute('aria-labelledby', 'logic-game-board-title');
    const boardHeadingRow = createElement('div', 'logic-game__subheading-row');
    const boardHeading = createElement('h3', 'logic-game__subheading', 'House plan');
    boardHeading.id = 'logic-game-board-title';
    const selectionStatus = createElement('p', 'logic-game__selection-status');
    selectionStatus.dataset.gameSelectionStatus = '';
    boardHeadingRow.append(boardHeading, selectionStatus);
    const board = createElement('div', 'logic-game__board');
    board.dataset.gameBoard = '';
    board.setAttribute('aria-label', 'Top-down plan of Samasihat');
    boardPanel.append(boardHeadingRow, board);

    const cluePanel = createElement('aside', 'logic-game__clues');
    cluePanel.setAttribute('aria-labelledby', 'logic-game-clues-title');
    const clueHeading = createElement('h3', 'logic-game__subheading', 'Clues');
    clueHeading.id = 'logic-game-clues-title';
    const clueList = createElement('ol', 'logic-game__clue-list');
    clueList.dataset.gameClues = '';
    cluePanel.append(clueHeading, clueList);

    body.append(boardPanel, cluePanel);

    const tray = createElement('section', 'logic-game__tray');
    tray.setAttribute('aria-label', 'Character and object controls');

    const characterGroup = createElement('div', 'logic-game__tray-group');
    const characterHeading = createElement('h3', 'logic-game__subheading', '1. Select a person');
    const characterList = createElement('div', 'logic-game__character-list');
    characterList.dataset.characterTray = '';
    characterGroup.append(characterHeading, characterList);

    const objectGroup = createElement('div', 'logic-game__tray-group');
    const objectHeading = createElement('h3', 'logic-game__subheading', '2. Assign an object');
    const objectList = createElement('div', 'logic-game__object-list');
    objectList.dataset.objectTray = '';
    objectGroup.append(objectHeading, objectList);

    tray.append(characterGroup, objectGroup);

    const solvedPanel = createElement('section', 'logic-game__solved');
    solvedPanel.dataset.gameSolved = '';
    solvedPanel.hidden = true;
    solvedPanel.setAttribute('aria-labelledby', 'logic-game-solved-title');
    const solvedStamp = createElement('span', 'logic-game__solved-stamp', 'CASE SOLVED');
    solvedStamp.setAttribute('aria-hidden', 'true');
    const solvedTitle = createElement('h3', 'logic-game__solved-title', 'The blackout has been reconstructed.');
    solvedTitle.id = 'logic-game-solved-title';
    const solvedCopy = createElement(
      'p',
      'logic-game__solved-copy',
      'You placed every person and object correctly. The solution belongs only to this mini-game.'
    );
    const solvedClose = createElement('button', 'logic-game__return', 'Return to Sitting Room');
    solvedClose.type = 'button';
    solvedClose.dataset.gameClose = '';
    solvedPanel.append(solvedStamp, solvedTitle, solvedCopy, solvedClose);

    const footer = createElement('footer', 'logic-game__footer');
    const status = createElement('p', 'logic-game__status', 'Select a person, then choose a room and an object.');
    status.dataset.gameStatus = '';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');

    const controls = createElement('div', 'logic-game__controls');
    const hintButton = createElement('button', 'logic-game__button logic-game__button--quiet', 'Hint');
    hintButton.type = 'button';
    hintButton.dataset.gameHint = '';
    const resetButton = createElement('button', 'logic-game__button logic-game__button--quiet', 'Reset');
    resetButton.type = 'button';
    resetButton.dataset.gameReset = '';
    const checkButton = createElement('button', 'logic-game__button logic-game__button--primary', 'Check solution');
    checkButton.type = 'button';
    checkButton.dataset.gameCheck = '';
    controls.append(hintButton, resetButton, checkButton);
    footer.append(status, controls);

    shell.append(rings, grain, header, introBlock, body, tray, solvedPanel, footer);
    dialog.append(shell);
    document.body.append(dialog);

    return dialog;
  }

  class LogicGameController {
    constructor(dialog, puzzles) {
      this.dialog = dialog;
      this.puzzles = puzzles;
      this.puzzle = null;
      this.trigger = null;
      this.previousActiveElement = null;
      this.selectedCharacterId = null;
      this.assignments = {};
      this.hintsUsed = 0;
      this.isSolved = false;
      this.previouslySolved = false;

      this.root = dialog.querySelector('[data-game-root]');
      this.title = dialog.querySelector('[data-game-title]');
      this.eyebrow = dialog.querySelector('[data-game-eyebrow]');
      this.introduction = dialog.querySelector('[data-game-introduction]');
      this.disclaimer = dialog.querySelector('[data-game-disclaimer]');
      this.previousBadge = dialog.querySelector('[data-game-previous]');
      this.board = dialog.querySelector('[data-game-board]');
      this.clueList = dialog.querySelector('[data-game-clues]');
      this.characterTray = dialog.querySelector('[data-character-tray]');
      this.objectTray = dialog.querySelector('[data-object-tray]');
      this.selectionStatus = dialog.querySelector('[data-game-selection-status]');
      this.status = dialog.querySelector('[data-game-status]');
      this.solvedPanel = dialog.querySelector('[data-game-solved]');
      this.hintButton = dialog.querySelector('[data-game-hint]');
      this.resetButton = dialog.querySelector('[data-game-reset]');
      this.checkButton = dialog.querySelector('[data-game-check]');

      this.handleCancel = this.handleCancel.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
    }

    init() {
      this.dialog.addEventListener('cancel', this.handleCancel);
      this.dialog.addEventListener('keydown', this.handleKeydown);
      this.dialog.querySelectorAll('[data-game-close]').forEach((button) => {
        button.addEventListener('click', () => this.close());
      });
      this.hintButton.addEventListener('click', () => this.useHint());
      this.resetButton.addEventListener('click', () => this.reset());
      this.checkButton.addEventListener('click', () => this.checkSolution());
    }

    open(puzzleId, trigger) {
      const puzzle = this.puzzles[puzzleId] || this.puzzles[DEFAULT_PUZZLE_ID];
      if (!puzzle) return;

      this.puzzle = puzzle;
      this.trigger = trigger || null;
      this.previousActiveElement = document.activeElement;
      this.previouslySolved = this.readProgress(puzzle.id).completed === true;
      this.reset({ announce: false });
      this.renderStaticContent();
      this.render();
      this.setBackgroundInert(true);

      if (typeof this.dialog.showModal === 'function') {
        this.dialog.showModal();
      } else {
        this.dialog.setAttribute('open', '');
      }

      document.documentElement.classList.add('logic-game-is-open');
      window.requestAnimationFrame(() => {
        const firstCharacter = this.characterTray.querySelector('button');
        if (firstCharacter) firstCharacter.focus();
      });
    }

    close() {
      if (!this.dialog.open && !this.dialog.hasAttribute('open')) return;

      if (typeof this.dialog.close === 'function') {
        this.dialog.close();
      } else {
        this.dialog.removeAttribute('open');
      }

      document.documentElement.classList.remove('logic-game-is-open');
      this.setBackgroundInert(false);

      const focusTarget = this.trigger || this.previousActiveElement;
      this.trigger = null;
      this.previousActiveElement = null;
      if (focusTarget && typeof focusTarget.focus === 'function') {
        window.requestAnimationFrame(() => focusTarget.focus());
      }
    }

    handleCancel(event) {
      event.preventDefault();
      this.close();
    }

    handleKeydown(event) {
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        this.dialog.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hidden && element.offsetParent !== null);

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

    setBackgroundInert(isInert) {
      document.querySelectorAll('[data-dialog-inert]').forEach((element) => {
        if ('inert' in element) {
          element.inert = isInert;
        } else if (isInert) {
          element.setAttribute('aria-hidden', 'true');
        } else {
          element.removeAttribute('aria-hidden');
        }
      });
    }

    reset(options = {}) {
      const { announce = true } = options;
      if (!this.puzzle) return;

      this.assignments = {};
      this.puzzle.characters.forEach((character) => {
        this.assignments[character.id] = { location: null, object: null };
      });
      this.selectedCharacterId = this.puzzle.characters[0].id;
      this.hintsUsed = 0;
      this.isSolved = false;
      this.solvedPanel.hidden = true;
      this.root.classList.remove('is-solved');
      this.hintButton.disabled = false;
      this.checkButton.disabled = false;

      if (announce) {
        this.setStatus('Puzzle reset. Select a person, then choose a room and an object.');
        this.render();
      }
    }

    renderStaticContent() {
      const puzzle = this.puzzle;
      this.title.textContent = puzzle.title;
      this.eyebrow.textContent = puzzle.eyebrow;
      this.introduction.textContent = puzzle.introduction;
      this.disclaimer.textContent = puzzle.disclaimer;
      this.previousBadge.hidden = !this.previouslySolved;
      this.previousBadge.textContent = this.previouslySolved
        ? 'Previously solved on this device. You can play again.'
        : '';

      const clueFragment = document.createDocumentFragment();
      puzzle.clues.forEach((clue, index) => {
        const item = createElement('li', 'logic-game__clue');
        const number = createElement('span', 'logic-game__clue-number', String(index + 1).padStart(2, '0'));
        number.setAttribute('aria-hidden', 'true');
        const text = createElement('span', 'logic-game__clue-text', clue);
        item.append(number, text);
        clueFragment.append(item);
      });
      this.clueList.replaceChildren(clueFragment);
    }

    render() {
      if (!this.puzzle) return;
      this.renderBoard();
      this.renderCharacters();
      this.renderObjects();
      this.renderSelectionStatus();
    }

    renderBoard() {
      const fragment = document.createDocumentFragment();

      this.puzzle.locations.forEach((location) => {
        const occupant = this.puzzle.characters.find(
          (character) => this.assignments[character.id].location === location.id
        );

        const room = createElement('button', `logic-game__room logic-game__room--${location.furnishing}`);
        room.type = 'button';
        room.dataset.locationId = location.id;
        room.setAttribute(
          'aria-label',
          occupant
            ? `${location.name}. ${occupant.name} is here. Place the selected person here.`
            : `${location.name}. Empty. Place the selected person here.`
        );

        const roomLabel = createElement('span', 'logic-game__room-label', location.name);
        const furniture = createElement('span', 'logic-game__furniture');
        furniture.setAttribute('aria-hidden', 'true');
        const occupants = createElement('span', 'logic-game__occupants');

        if (occupant) {
          const token = createElement('span', 'logic-game__map-token');
          token.dataset.characterId = occupant.id;
          const mark = createElement('span', 'logic-game__map-token-mark', occupant.mark);
          const name = createElement('span', 'logic-game__map-token-name', occupant.name);
          token.append(mark, name);
          occupants.append(token);
        } else {
          occupants.append(createElement('span', 'logic-game__empty-room', 'Place person'));
        }

        room.append(roomLabel, furniture, occupants);
        room.addEventListener('click', () => this.assignLocation(location.id));
        fragment.append(room);
      });

      this.board.replaceChildren(fragment);
    }

    renderCharacters() {
      const fragment = document.createDocumentFragment();

      this.puzzle.characters.forEach((character) => {
        const assignment = this.assignments[character.id];
        const location = this.findLocation(assignment.location);
        const object = this.findObject(assignment.object);
        const isSelected = character.id === this.selectedCharacterId;

        const button = createElement('button', 'logic-game__character');
        button.type = 'button';
        button.dataset.characterId = character.id;
        button.setAttribute('aria-pressed', String(isSelected));
        button.setAttribute(
          'aria-label',
          `${character.name}. ${location ? `In ${location.name}` : 'No room assigned'}. ${
            object ? `Carrying ${object.name}` : 'No object assigned'
          }. Select this person.`
        );

        if (isSelected) button.classList.add('is-selected');

        const portrait = createElement('span', 'logic-game__character-mark', character.mark);
        portrait.setAttribute('aria-hidden', 'true');
        const details = createElement('span', 'logic-game__character-details');
        const name = createElement('strong', 'logic-game__character-name', character.name);
        const assignmentText = createElement(
          'span',
          'logic-game__character-assignment',
          `${location ? location.shortName : 'Room —'} · ${object ? object.name : 'Object —'}`
        );
        details.append(name, assignmentText);
        button.append(portrait, details);
        button.addEventListener('click', () => this.selectCharacter(character.id));
        fragment.append(button);
      });

      this.characterTray.replaceChildren(fragment);
    }

    renderObjects() {
      const fragment = document.createDocumentFragment();

      this.puzzle.objects.forEach((object) => {
        const owner = this.puzzle.characters.find(
          (character) => this.assignments[character.id].object === object.id
        );

        const button = createElement('button', 'logic-game__object');
        button.type = 'button';
        button.dataset.objectId = object.id;
        button.setAttribute(
          'aria-label',
          owner
            ? `${object.name}. Currently assigned to ${owner.name}. Assign it to the selected person.`
            : `${object.name}. Unassigned. Assign it to the selected person.`
        );

        if (owner && owner.id === this.selectedCharacterId) {
          button.classList.add('is-assigned-to-selected');
        }

        const icon = createElement('span', 'logic-game__object-icon', object.shortLabel);
        icon.setAttribute('aria-hidden', 'true');
        const details = createElement('span', 'logic-game__object-details');
        const name = createElement('strong', 'logic-game__object-name', object.name);
        const ownerText = createElement(
          'span',
          'logic-game__object-owner',
          owner ? `With ${owner.name}` : 'Unassigned'
        );
        details.append(name, ownerText);
        button.append(icon, details);
        button.addEventListener('click', () => this.assignObject(object.id));
        fragment.append(button);
      });

      this.objectTray.replaceChildren(fragment);
    }

    renderSelectionStatus() {
      const character = this.findCharacter(this.selectedCharacterId);
      const assignment = character ? this.assignments[character.id] : null;
      const location = assignment ? this.findLocation(assignment.location) : null;
      const object = assignment ? this.findObject(assignment.object) : null;

      this.selectionStatus.textContent = character
        ? `Selected: ${character.name} · ${location ? location.name : 'choose a room'} · ${
            object ? object.name : 'choose an object'
          }`
        : '';
    }

    selectCharacter(characterId) {
      if (this.isSolved || !this.findCharacter(characterId)) return;
      this.selectedCharacterId = characterId;
      const character = this.findCharacter(characterId);
      this.setStatus(`${character.name} selected. Choose a room and an object.`);
      this.render();
    }

    assignLocation(locationId) {
      if (this.isSolved) return;
      const character = this.findCharacter(this.selectedCharacterId);
      const location = this.findLocation(locationId);
      if (!character || !location) return;

      const currentLocation = this.assignments[character.id].location;
      const occupant = this.puzzle.characters.find(
        (candidate) =>
          candidate.id !== character.id && this.assignments[candidate.id].location === locationId
      );

      if (occupant) {
        this.assignments[occupant.id].location = currentLocation;
      }
      this.assignments[character.id].location = locationId;

      this.setStatus(
        occupant
          ? `${character.name} moved to the ${location.name}; ${occupant.name} was moved to the previous space.`
          : `${character.name} placed in the ${location.name}.`
      );
      this.render();
    }

    assignObject(objectId) {
      if (this.isSolved) return;
      const character = this.findCharacter(this.selectedCharacterId);
      const object = this.findObject(objectId);
      if (!character || !object) return;

      const currentObject = this.assignments[character.id].object;
      const owner = this.puzzle.characters.find(
        (candidate) =>
          candidate.id !== character.id && this.assignments[candidate.id].object === objectId
      );

      if (owner) {
        this.assignments[owner.id].object = currentObject;
      }
      this.assignments[character.id].object = objectId;

      this.setStatus(
        owner
          ? `${object.name} assigned to ${character.name}; ${owner.name} received the previous object.`
          : `${object.name} assigned to ${character.name}.`
      );
      this.render();
    }

    useHint() {
      if (this.isSolved) return;

      for (const character of this.puzzle.characters) {
        const expected = this.puzzle.solution[character.id];
        const actual = this.assignments[character.id];

        if (actual.location !== expected.location) {
          this.selectedCharacterId = character.id;
          this.assignLocation(expected.location);
          this.hintsUsed += 1;
          this.setStatus(`Hint used: ${character.name} belongs in the ${this.findLocation(expected.location).name}.`);
          return;
        }

        if (actual.object !== expected.object) {
          this.selectedCharacterId = character.id;
          this.assignObject(expected.object);
          this.hintsUsed += 1;
          this.setStatus(`Hint used: ${character.name} carried the ${this.findObject(expected.object).name}.`);
          return;
        }
      }

      this.setStatus('Every placement is correct. Check the solution.');
    }

    checkSolution() {
      if (this.isSolved) return;

      const totalFields = this.puzzle.characters.length * 2;
      let filledFields = 0;
      let correctFields = 0;

      this.puzzle.characters.forEach((character) => {
        const expected = this.puzzle.solution[character.id];
        const actual = this.assignments[character.id];

        if (actual.location) filledFields += 1;
        if (actual.object) filledFields += 1;
        if (actual.location === expected.location) correctFields += 1;
        if (actual.object === expected.object) correctFields += 1;
      });

      if (filledFields < totalFields) {
        this.setStatus(`Complete all ${totalFields} placements before checking the solution.`);
        return;
      }

      if (correctFields !== totalFields) {
        this.setStatus(`${correctFields} of ${totalFields} details are correct. Re-read the clues and try again.`);
        this.root.classList.remove('is-checking');
        void this.root.offsetWidth;
        this.root.classList.add('is-checking');
        return;
      }

      this.solve();
    }

    solve() {
      this.isSolved = true;
      this.solvedPanel.hidden = false;
      this.root.classList.add('is-solved');
      this.hintButton.disabled = true;
      this.checkButton.disabled = true;
      this.setStatus(`Case solved with ${this.hintsUsed} ${this.hintsUsed === 1 ? 'hint' : 'hints'} used.`);
      this.writeProgress({
        completed: true,
        hintsUsed: this.hintsUsed,
        completedAt: new Date().toISOString()
      });
      if (typeof this.solvedPanel.scrollIntoView === 'function') {
        this.solvedPanel.scrollIntoView({
          block: 'nearest',
          behavior: this.prefersReducedMotion() ? 'auto' : 'smooth'
        });
      }
      const returnButton = this.solvedPanel.querySelector('[data-game-close]');
      if (returnButton) returnButton.focus();
    }

    findCharacter(characterId) {
      return this.puzzle.characters.find((character) => character.id === characterId) || null;
    }

    findLocation(locationId) {
      return this.puzzle.locations.find((location) => location.id === locationId) || null;
    }

    findObject(objectId) {
      return this.puzzle.objects.find((object) => object.id === objectId) || null;
    }

    setStatus(message) {
      this.status.textContent = message;
    }

    prefersReducedMotion() {
      return Boolean(
        global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }

    readAllProgress() {
      try {
        const raw = global.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (error) {
        return {};
      }
    }

    readProgress(puzzleId) {
      const progress = this.readAllProgress();
      return progress[puzzleId] || {};
    }

    writeProgress(record) {
      try {
        const progress = this.readAllProgress();
        progress[this.puzzle.id] = record;
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        // The game remains fully usable when storage is blocked.
      }
    }
  }

  function patchHotspotModal(game) {
    const microsite = global.TikusMicrosite;
    const modal = microsite && microsite.modal;
    if (!modal || typeof modal.open !== 'function' || modal.__tikusGamePatched) return false;

    const originalOpen = modal.open.bind(modal);
    modal.open = function openTikusContent(content, trigger) {
      if (content && content.type === 'game') {
        game.open(content.gameId || DEFAULT_PUZZLE_ID, trigger);
        return;
      }
      originalOpen(content, trigger);
    };
    modal.__tikusGamePatched = true;
    return true;
  }

  function initialise() {
    const dialog = createGameDialog();
    const game = new LogicGameController(dialog, PUZZLES);
    game.init();

    if (!patchHotspotModal(game)) {
      window.setTimeout(() => patchHotspotModal(game), 0);
    }

    global.TikusLogicGame = Object.freeze({
      open: (puzzleId, trigger) => game.open(puzzleId || DEFAULT_PUZZLE_ID, trigger),
      close: () => game.close()
    });
  }

  injectStylesheet();
  replaceSittingRoomHotspot();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})(window);
