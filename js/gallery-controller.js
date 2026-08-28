(function registerTikusGalleryController(global) {
  'use strict';

  const ITEMS = Array.from({ length: 7 }, (_, index) => {
    const number = index + 1;
    const base = `assets/images/gallery/tikus-first-look-${number}`;
    return Object.freeze({
      id: number,
      webp: `${base}-960.webp 960w, ${base}-1600.webp 1600w`,
      jpeg: `${base}-960.jpg 960w, ${base}-1600.jpg 1600w`,
      fallback: `${base}-1600.jpg`,
      thumbWebp: `${base}-thumb.webp`,
      thumbJpeg: `${base}-thumb.jpg`,
      altKey: `gallery.alt.${number}`
    });
  });

  function t(key, variables = {}, fallback = '') {
    return global.TikusI18n?.t(key, variables, fallback) ?? fallback;
  }

  function init() {
    const root = document.querySelector('[data-gallery]');
    const feature = root?.querySelector('[data-gallery-feature]');
    const featureWebp = root?.querySelector('[data-gallery-feature-webp]');
    const featureImage = root?.querySelector('[data-gallery-feature-image]');
    const counter = root?.querySelector('[data-gallery-counter]');
    const strip = root?.querySelector('[data-gallery-strip]');
    const previous = root?.querySelector('[data-gallery-prev]');
    const next = root?.querySelector('[data-gallery-next]');
    const status = root?.querySelector('[data-gallery-status]');
    const dialog = document.getElementById('gallery-dialog');
    const dialogWebp = dialog?.querySelector('[data-gallery-dialog-webp]');
    const dialogImage = dialog?.querySelector('[data-gallery-dialog-image]');
    const close = dialog?.querySelector('[data-gallery-close]');
    const dialogPrevious = dialog?.querySelector('[data-gallery-dialog-prev]');
    const dialogNext = dialog?.querySelector('[data-gallery-dialog-next]');
    if (!root || !feature || !featureWebp || !featureImage || !counter || !strip || !dialog || !dialogWebp || !dialogImage) return;

    let current = 0;
    let lastTrigger = null;
    let pointerStartX = null;
    let suppressFeatureOpen = false;

    function currentAlt() {
      return t(ITEMS[current].altKey, {}, `Tikus! first-look still ${current + 1}.`);
    }

    function updatePicture(webpSource, image, item, alt) {
      webpSource.srcset = item.webp;
      image.src = item.fallback;
      image.srcset = item.jpeg;
      image.sizes = '(max-width: 62rem) calc(100vw - 2rem), min(88vw, 82rem)';
      image.alt = alt;
    }

    function updateThumbs() {
      strip.querySelectorAll('[data-gallery-index]').forEach((button) => {
        const active = Number(button.dataset.galleryIndex) === current;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function render({ announce = false } = {}) {
      const item = ITEMS[current];
      const alt = currentAlt();
      updatePicture(featureWebp, featureImage, item, alt);
      feature.setAttribute('aria-label', t('gallery.openAria', { index: current + 1, total: ITEMS.length }, `Open still ${current + 1} of ${ITEMS.length} larger`));
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(ITEMS.length).padStart(2, '0')}`;
      updateThumbs();
      if (dialog.open) {
        updatePicture(dialogWebp, dialogImage, item, alt);
      }
      if (announce && status) {
        status.textContent = t('gallery.status', { index: current + 1, total: ITEMS.length }, `Showing still ${current + 1} of ${ITEMS.length}.`);
      }
    }

    function move(delta, announce = true) {
      current = (current + delta + ITEMS.length) % ITEMS.length;
      render({ announce });
    }

    function makeThumb(item, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumb';
      button.dataset.galleryIndex = String(index);
      button.setAttribute('aria-label', t('gallery.thumbAria', { index: index + 1, total: ITEMS.length }, `Show still ${index + 1} of ${ITEMS.length}`));
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = item.thumbWebp;
      const image = document.createElement('img');
      image.src = item.thumbJpeg;
      image.width = 360;
      image.height = 203;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      picture.append(source, image);
      button.append(picture);
      button.addEventListener('click', () => {
        current = index;
        render({ announce: true });
      });
      return button;
    }

    function rebuildThumbLabels() {
      strip.querySelectorAll('[data-gallery-index]').forEach((button) => {
        const index = Number(button.dataset.galleryIndex);
        button.setAttribute('aria-label', t('gallery.thumbAria', { index: index + 1, total: ITEMS.length }, `Show still ${index + 1} of ${ITEMS.length}`));
      });
    }

    function openDialog() {
      lastTrigger = feature;
      render();
      document.body.classList.add('has-open-dialog');
      dialog.showModal();
      close?.focus({ preventScroll: true });
    }

    function closeDialog() {
      if (dialog.open) dialog.close();
    }

    strip.replaceChildren(...ITEMS.map(makeThumb));
    previous?.addEventListener('click', () => move(-1));
    next?.addEventListener('click', () => move(1));
    dialogPrevious?.addEventListener('click', () => move(-1));
    dialogNext?.addEventListener('click', () => move(1));
    feature.addEventListener('click', (event) => {
      if (suppressFeatureOpen) {
        event.preventDefault();
        return;
      }
      openDialog();
    });
    close?.addEventListener('click', closeDialog);
    dialog.addEventListener('close', () => {
      document.body.classList.remove('has-open-dialog');
      lastTrigger?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });

    feature.addEventListener('pointerdown', (event) => { pointerStartX = event.clientX; }, { passive: true });
    feature.addEventListener('pointerup', (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) > 50) {
        suppressFeatureOpen = true;
        move(distance > 0 ? -1 : 1);
        global.setTimeout(() => { suppressFeatureOpen = false; }, 250);
      }
    }, { passive: true });

    global.TikusI18n?.subscribe(() => {
      rebuildThumbLabels();
      render();
    });
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
