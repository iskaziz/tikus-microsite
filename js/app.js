(function bootstrapTikusMicrosite(global) {
  'use strict';

  document.documentElement.classList.add('js');

  function t(key, variables = {}, fallback = '') {
    return global.TikusI18n?.t(key, variables, fallback) ?? fallback;
  }


  function createPortraitPlaceholder(label) {
    const portrait = document.createElement('span');
    portrait.className = 'cast-card__portrait cast-card__portrait--cast';
    portrait.setAttribute('aria-hidden', 'true');

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
      source.sizes = portrait.sizes || '14rem';
      picture.append(source);
    }

    if (portrait.webp) {
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = portrait.webp;
      source.sizes = portrait.sizes || '14rem';
      picture.append(source);
    }

    const image = document.createElement('img');
    image.src = portrait.fallback;
    if (portrait.fallbackSrcset) {
      image.srcset = portrait.fallbackSrcset;
      image.sizes = portrait.sizes || '14rem';
    }
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = portrait.width || 720;
    image.height = portrait.height || 720;
    picture.append(image);

    return picture;
  }

  function createCastFront(member, index) {
    const face = document.createElement('span');
    face.className = 'cast-card__face cast-card__front';

    const cornerTop = document.createElement('span');
    cornerTop.className = 'cast-card__corner cast-card__corner--top';
    cornerTop.setAttribute('aria-hidden', 'true');
    cornerTop.textContent = String(index + 1).padStart(2, '0');

    const cornerBottom = document.createElement('span');
    cornerBottom.className = 'cast-card__corner cast-card__corner--bottom';
    cornerBottom.setAttribute('aria-hidden', 'true');
    cornerBottom.textContent = 'T';

    const media = member.portrait
      ? createPortraitMedia(member.portrait)
      : createPortraitPlaceholder(member.actorName);

    const heading = document.createElement('span');
    heading.className = 'cast-card__name';
    heading.textContent = member.actorName;

    const flipHint = document.createElement('span');
    flipHint.className = 'cast-card__flip-hint';
    flipHint.textContent = t('cast.revealBio', {}, 'Read profile');

    face.append(cornerTop, cornerBottom, media, heading, flipHint);
    return face;
  }

  function createCastBack(member, index) {
    const face = document.createElement('span');
    face.className = 'cast-card__face cast-card__back';
    face.setAttribute('aria-hidden', 'true');

    const cornerTop = document.createElement('span');
    cornerTop.className = 'cast-card__corner cast-card__corner--top';
    cornerTop.setAttribute('aria-hidden', 'true');
    cornerTop.textContent = String(index + 1).padStart(2, '0');

    const cornerBottom = document.createElement('span');
    cornerBottom.className = 'cast-card__corner cast-card__corner--bottom';
    cornerBottom.setAttribute('aria-hidden', 'true');
    cornerBottom.textContent = 'K';

    const label = document.createElement('span');
    label.className = 'cast-card__eyebrow';
    label.textContent = t('cast.bioLabel', {}, 'Cast profile');

    const heading = document.createElement('span');
    heading.className = 'cast-card__name';
    heading.textContent = member.actorName;

    const copy = document.createElement('span');
    copy.className = 'cast-card__description cast-card__bio';
    copy.textContent = member.bioKey ? t(member.bioKey, {}, member.bio) : member.bio;

    const flipHint = document.createElement('span');
    flipHint.className = 'cast-card__flip-hint';
    flipHint.textContent = t('cast.returnPortrait', {}, 'Return to portrait');

    face.append(cornerTop, cornerBottom, label, heading, copy, flipHint);
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

    const fragment = document.createDocumentFragment();

    cast.forEach((member, index) => {
      const initialFlipped = existingStates.get(member.id) || false;
      const card = document.createElement('button');
      card.className = `cast-card${initialFlipped ? ' is-flipped' : ''}`;
      card.type = 'button';
      card.dataset.castCard = member.id;
      card.setAttribute('aria-pressed', String(initialFlipped));
      card.setAttribute(
        'aria-label',
        initialFlipped
          ? t('cast.backAria', { actor: member.actorName }, `${member.actorName} profile. Flip to return to the portrait.`)
          : t('cast.frontAria', { actor: member.actorName }, `${member.actorName}. Flip to read the cast profile.`)
      );

      const inner = document.createElement('span');
      inner.className = 'cast-card__inner';

      const front = createCastFront(member, index);
      const back = createCastBack(member, index);
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
            ? t('cast.backAria', { actor: member.actorName }, `${member.actorName} profile. Flip to return to the portrait.`)
            : t('cast.frontAria', { actor: member.actorName }, `${member.actorName}. Flip to read the cast profile.`)
        );

        if (status) {
          status.textContent = isFlipped
            ? t('cast.backStatus', { actor: member.actorName }, `Showing the cast profile for ${member.actorName}.`)
            : t('cast.frontStatus', { actor: member.actorName }, `Showing the portrait for ${member.actorName}.`);
        }
      });

      fragment.append(card);
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
