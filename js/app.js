(function bootstrapTikusMicrosite(global) {
  'use strict';

  document.documentElement.classList.add('js');

  function t(key, variables = {}, fallback = '') {
    return global.TikusI18n?.t(key, variables, fallback) ?? fallback;
  }


  function createPortraitPlaceholder(label, variant) {
    const portrait = document.createElement('span');
    portrait.className = `cast-card__portrait cast-card__portrait--${variant}`;
    portrait.setAttribute('aria-label', t('cast.portraitPlaceholder', { name: label }, `${label} portrait placeholder`));

    const artwork = document.createElement('span');
    artwork.className = 'cast-card__portrait-art';
    artwork.setAttribute('aria-hidden', 'true');

    const note = document.createElement('span');
    note.className = 'cast-card__portrait-note';
    note.textContent = t('cast.portraitComing', {}, 'Portrait coming soon');

    portrait.append(artwork, note);
    return portrait;
  }

  function createPortraitMedia(portrait) {
    if (typeof portrait === 'string') {
      return Object.assign(document.createElement('img'), {
        className: 'cast-card__portrait',
        src: portrait,
        alt: '',
        loading: 'lazy',
        decoding: 'async'
      });
    }

    const picture = document.createElement('picture');
    picture.className = 'cast-card__portrait cast-card__portrait--image';

    if (portrait.avif) {
      const source = document.createElement('source');
      source.type = 'image/avif';
      source.srcset = portrait.avif;
      source.sizes = portrait.sizes || '16rem';
      picture.append(source);
    }

    if (portrait.webp) {
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = portrait.webp;
      source.sizes = portrait.sizes || '16rem';
      picture.append(source);
    }

    const image = document.createElement('img');
    image.src = portrait.fallback;
    if (portrait.fallbackSrcset) {
      image.srcset = portrait.fallbackSrcset;
      image.sizes = portrait.sizes || '16rem';
    }
    image.alt = portrait.altKey ? t(portrait.altKey, { name: portrait.altName || '' }, portrait.alt || '') : (portrait.alt || '');
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = portrait.width || 720;
    image.height = portrait.height || 720;
    picture.append(image);

    return picture;
  }

  function createCardFace({ side, eyebrow, name, description, portrait, index }) {
    const face = document.createElement('span');
    face.className = `cast-card__face cast-card__${side}`;
    face.setAttribute('aria-hidden', side === 'back' ? 'true' : 'false');

    const cornerTop = document.createElement('span');
    cornerTop.className = 'cast-card__corner cast-card__corner--top';
    cornerTop.setAttribute('aria-hidden', 'true');
    cornerTop.textContent = String(index + 1).padStart(2, '0');

    const cornerBottom = document.createElement('span');
    cornerBottom.className = 'cast-card__corner cast-card__corner--bottom';
    cornerBottom.setAttribute('aria-hidden', 'true');
    cornerBottom.textContent = side === 'front' ? 'T' : 'K';

    const media = portrait
      ? createPortraitMedia(portrait)
      : createPortraitPlaceholder(name, side === 'front' ? 'cast' : 'character');

    const label = eyebrow ? document.createElement('span') : null;
    if (label) {
      label.className = 'cast-card__eyebrow';
      label.textContent = eyebrow;
    }

    const heading = document.createElement('span');
    heading.className = 'cast-card__name';
    heading.textContent = name;

    const copy = document.createElement('span');
    copy.className = 'cast-card__description';
    copy.textContent = description;

    const flipHint = document.createElement('span');
    flipHint.className = 'cast-card__flip-hint';
    flipHint.textContent = side === 'front' ? t('cast.returnCharacter', {}, 'Return to character') : t('cast.revealCast', {}, 'Reveal cast');

    face.append(cornerTop, cornerBottom, media);
    if (label) {
      face.append(label);
    }
    face.append(heading, copy, flipHint);
    return face;
  }

  function initCastCards(cast) {
    const container = document.querySelector('[data-cast-grid]');
    const status = document.querySelector('[data-cast-status]');
    if (!container || !Array.isArray(cast)) {
      return;
    }

    const existingStates = new Map(Array.from(container.querySelectorAll('[data-cast-card]')).map((card) => [
      card.dataset.castCard,
      card.classList.contains('is-flipped')
    ]));

    const groups = [
      { id: 'hosts', label: t('cast.hosts', {}, 'Hosts'), memberGroups: ['hosts'] },
      { id: 'guests', label: t('cast.guestsInspector', {}, 'Guests & The Inspector'), memberGroups: ['guests', 'inspector'] }
    ];
    const categoryLabels = {
      hosts: t('cast.host', {}, 'Host'),
      guests: t('cast.guest', {}, 'Guest'),
      inspector: t('cast.inspector', {}, 'Inspector')
    };
    const tilts = [-2.2, 1.4, -1.1, 2.1, -0.7, 1.8, -1.8, 0.9];
    const fragment = document.createDocumentFragment();
    let cardIndex = 0;

    groups.forEach((group) => {
      const members = cast.filter((member) => group.memberGroups.includes(member.group));
      if (!members.length) {
        return;
      }

      const section = document.createElement('section');
      section.className = 'cast-group';
      section.dataset.castGroup = group.id;
      section.setAttribute('aria-labelledby', `cast-group-${group.id}`);

      const heading = document.createElement('h3');
      heading.className = 'cast-group__heading';
      heading.id = `cast-group-${group.id}`;
      heading.textContent = group.label;

      const grid = document.createElement('div');
      grid.className = 'cast-group__grid';

      members.forEach((member) => {
        const index = cardIndex;
        cardIndex += 1;

        const initialFlipped = existingStates.has(member.id) ? existingStates.get(member.id) : true;
        const card = document.createElement('button');
        card.className = `cast-card${initialFlipped ? ' is-flipped' : ''}`;
        card.type = 'button';
        card.dataset.castCard = member.id;
        card.setAttribute('aria-pressed', String(initialFlipped));
        card.setAttribute('aria-label', initialFlipped
          ? t('cast.characterAria', { character: member.characterName, actor: member.actorName }, `${member.characterName}, played by ${member.actorName}. Flip to reveal the cast profile.`)
          : t('cast.actorAria', { actor: member.actorName, character: member.characterName }, `${member.actorName} plays ${member.characterName}. Flip to return to the character.`));
        card.style.setProperty('--card-tilt', `${tilts[index % tilts.length]}deg`);

        const inner = document.createElement('span');
        inner.className = 'cast-card__inner';

        const front = createCardFace({
          side: 'front',
          eyebrow: '',
          name: member.actorName,
          description: member.actorDescriptionKey ? t(member.actorDescriptionKey, {}, member.actorDescription) : member.actorDescription,
          portrait: member.actorPortrait,
          index
        });

        const back = createCardFace({
          side: 'back',
          eyebrow: categoryLabels[member.group] || 'Character',
          name: member.characterName,
          description: member.characterDescriptionKey ? t(member.characterDescriptionKey, {}, member.characterDescription) : member.characterDescription,
          portrait: member.characterPortrait,
          index
        });

        front.setAttribute('aria-hidden', String(initialFlipped));
        back.setAttribute('aria-hidden', String(!initialFlipped));

        inner.append(front, back);
        card.append(inner);

        card.addEventListener('click', () => {
          const isFlipped = card.classList.toggle('is-flipped');
          card.setAttribute('aria-pressed', String(isFlipped));
          front.setAttribute('aria-hidden', String(isFlipped));
          back.setAttribute('aria-hidden', String(!isFlipped));
          card.setAttribute(
            'aria-label',
            isFlipped
              ? t('cast.characterAria', { character: member.characterName, actor: member.actorName }, `${member.characterName}, played by ${member.actorName}. Flip to reveal the cast profile.`)
              : t('cast.actorAria', { actor: member.actorName, character: member.characterName }, `${member.actorName} plays ${member.characterName}. Flip to return to the character.`)
          );

          if (status) {
            status.textContent = isFlipped
              ? t('cast.characterStatus', { character: member.characterName, actor: member.actorName }, `Showing the character profile for ${member.characterName}, played by ${member.actorName}.`)
              : t('cast.actorStatus', { actor: member.actorName, character: member.characterName }, `Showing the cast profile for ${member.actorName}, who plays ${member.characterName}.`);
          }
        });

        grid.append(card);
      });

      section.append(heading, grid);
      fragment.append(section);
    });

    container.replaceChildren(fragment);
  }

  function init() {
    const status = document.querySelector('[data-scene-status]');

    try {
      if (
        !global.TIKUS_CONTENT ||
        !global.TikusModalController ||
        !global.TikusTrailerModalController ||
        !global.TikusSceneController
      ) {
        throw new Error('Required TIKUS modules did not load.');
      }

      initCastCards(global.TIKUS_CONTENT.cast);
      global.TikusI18n?.subscribe(() => initCastCards(global.TIKUS_CONTENT.cast));

      const hotspotDialog = document.getElementById('hotspot-dialog');
      const trailerDialog = document.getElementById('trailer-dialog');
      const explorerRoot = document.querySelector('[data-scene-explorer]');

      const modal = new global.TikusModalController(hotspotDialog);
      const trailer = new global.TikusTrailerModalController(
        trailerDialog,
        global.TIKUS_CONTENT.site.trailer
      );
      const scenes = new global.TikusSceneController({
        data: global.TIKUS_CONTENT,
        modal,
        root: explorerRoot
      });

      scenes.init();
      global.TikusMicrosite = Object.freeze({ modal, trailer, scenes });
    } catch (error) {
      console.error(error);
      if (status) {
        status.textContent = t('app.explorerError', {}, 'The house explorer could not be initialised. Please reload the page.');
        status.classList.remove('visually-hidden');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
