(function bootstrapTikusMicrosite(global) {
  'use strict';

  document.documentElement.classList.add('js');

  function createPortraitPlaceholder(label, variant) {
    const portrait = document.createElement('span');
    portrait.className = `cast-card__portrait cast-card__portrait--${variant}`;
    portrait.setAttribute('aria-label', `${label} portrait placeholder`);

    const artwork = document.createElement('span');
    artwork.className = 'cast-card__portrait-art';
    artwork.setAttribute('aria-hidden', 'true');

    const note = document.createElement('span');
    note.className = 'cast-card__portrait-note';
    note.textContent = 'Portrait coming soon';

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
    image.alt = portrait.alt || '';
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
    flipHint.textContent = side === 'front' ? 'Return to character' : 'Reveal cast';

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

    const groups = [
      { id: 'hosts', label: 'Hosts', memberGroups: ['hosts'] },
      { id: 'guests', label: 'Guests & The Inspector', memberGroups: ['guests', 'inspector'] }
    ];
    const categoryLabels = {
      hosts: 'Host',
      guests: 'Guest',
      inspector: 'Inspector'
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

        const card = document.createElement('button');
        card.className = 'cast-card is-flipped';
        card.type = 'button';
        card.dataset.castCard = member.id;
        card.setAttribute('aria-pressed', 'true');
        card.setAttribute('aria-label', `${member.characterName}, played by ${member.actorName}. Flip to reveal the cast profile.`);
        card.style.setProperty('--card-tilt', `${tilts[index % tilts.length]}deg`);

        const inner = document.createElement('span');
        inner.className = 'cast-card__inner';

        const front = createCardFace({
          side: 'front',
          eyebrow: '',
          name: member.actorName,
          description: member.actorDescription,
          portrait: member.actorPortrait,
          index
        });

        const back = createCardFace({
          side: 'back',
          eyebrow: categoryLabels[member.group] || 'Character',
          name: member.characterName,
          description: member.characterDescription,
          portrait: member.characterPortrait,
          index
        });

        front.setAttribute('aria-hidden', 'true');
        back.setAttribute('aria-hidden', 'false');

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
              ? `${member.characterName}, played by ${member.actorName}. Flip to reveal the cast profile.`
              : `${member.actorName} plays ${member.characterName}. Flip to return to the character.`
          );

          if (status) {
            status.textContent = isFlipped
              ? `Showing the character profile for ${member.characterName}, played by ${member.actorName}.`
              : `Showing the cast profile for ${member.actorName}, who plays ${member.characterName}.`;
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
        status.textContent = 'The house explorer could not be initialised. Please reload the page.';
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
