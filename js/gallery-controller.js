(function registerTikusGalleryController(global) {
  'use strict';

  const TOTAL = 7;
  const ITEMS = Array.from({ length: TOTAL }, (_, index) => {
    const number = index + 1;
    const base = `assets/images/gallery/tikus-first-look-${number}`;
    return {
      number,
      altKey: `gallery.still${number}.alt`,
      webp: `${base}-960.webp 960w, ${base}-1600.webp 1600w`,
      jpg: `${base}-960.jpg 960w, ${base}-1600.jpg 1600w`,
      fallback: `${base}-1600.jpg`,
      preload: `${base}-960.webp`
    };
  });

  const prefersReducedMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)') || { matches: false };

  function t(key, variables = {}, fallback = '') {
    return global.TikusI18n?.t(key, variables, fallback) ?? fallback;
  }

  function clampIndex(index) {
    return (index + TOTAL) % TOTAL;
  }

  function counterText(index) {
    return `${String(index + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;
  }

  function init() {
    const root = document.querySelector('[data-gallery-root]');
    const dialog = document.getElementById('gallery-dialog');
    if (!root || !dialog) return;

    const featureButton = root.querySelector('[data-gallery-open]');
    const featureSource = root.querySelector('[data-gallery-feature-source="webp"]');
    const featureImage = root.querySelector('[data-gallery-feature-image]');
    const featureCounter = root.querySelector('[data-gallery-counter]');
    const filmstrip = root.querySelector('[data-gallery-filmstrip]');
    const thumbs = Array.from(root.querySelectorAll('[data-gallery-index]'));
    const previous = root.querySelector('[data-gallery-previous]');
    const next = root.querySelector('[data-gallery-next]');
    const status = root.querySelector('[data-gallery-status]');

    const dialogTitle = dialog.querySelector('#gallery-dialog-title');
    const dialogSource = dialog.querySelector('[data-gallery-dialog-source="webp"]');
    const dialogImage = dialog.querySelector('[data-gallery-dialog-image]');
    const dialogCounter = dialog.querySelector('[data-gallery-dialog-counter]');
    const dialogViewer = dialog.querySelector('[data-gallery-dialog-viewer]');
    const dialogPrevious = dialog.querySelector('[data-gallery-dialog-previous]');
    const dialogNext = dialog.querySelector('[data-gallery-dialog-next]');
    const dialogClose = dialog.querySelector('[data-gallery-close]');

    if (!featureButton || !featureSource || !featureImage || !filmstrip || !thumbs.length || !dialogImage) {
      return;
    }

    let currentIndex = 0;
    let lastOpener = null;
    let swipeStart = null;
    let suppressOpen = false;
    const prefetched = new Set();

    function updatePicture(source, image, item) {
      if (source) source.srcset = item.webp;
      image.srcset = item.jpg;
      image.src = item.fallback;
      image.dataset.i18nAlt = item.altKey;
      image.alt = t(item.altKey, {}, image.alt || '');
    }

    function updateDynamicLabels() {
      const variables = { index: currentIndex + 1, total: TOTAL };
      featureButton.setAttribute('aria-label', t('gallery.openAria', variables, `Enlarge film still ${variables.index} of ${TOTAL}`));
      thumbs.forEach((thumb, index) => {
        thumb.setAttribute('aria-label', t('gallery.thumbAria', { index: index + 1, total: TOTAL }, `View film still ${index + 1} of ${TOTAL}`));
      });
      featureImage.alt = t(ITEMS[currentIndex].altKey, {}, featureImage.alt || '');
      if (dialogImage) dialogImage.alt = t(ITEMS[currentIndex].altKey, {}, dialogImage.alt || '');
    }

    function animateImage(image) {
      if (prefersReducedMotion.matches || typeof image.animate !== 'function') return;
      image.animate(
        [
          { opacity: 0.55, transform: 'scale(0.996)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: 260, easing: 'ease-out' }
      );
    }

    function centreActiveThumb(index) {
      const thumb = thumbs[index];
      if (!thumb) return;
      const targetLeft = Math.max(0, thumb.offsetLeft - ((filmstrip.clientWidth - thumb.offsetWidth) / 2));
      filmstrip.scrollTo({
        left: targetLeft,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    }

    function prefetch(index) {
      const item = ITEMS[clampIndex(index)];
      if (!item || prefetched.has(item.preload)) return;
      prefetched.add(item.preload);
      const image = new Image();
      image.decoding = 'async';
      image.src = item.preload;
    }

    function prefetchAdjacent() {
      prefetch(currentIndex - 1);
      prefetch(currentIndex + 1);
    }

    function render(options = {}) {
      const item = ITEMS[currentIndex];
      updatePicture(featureSource, featureImage, item);
      if (featureCounter) featureCounter.textContent = counterText(currentIndex);

      thumbs.forEach((thumb, index) => {
        if (index === currentIndex) {
          thumb.setAttribute('aria-current', 'true');
        } else {
          thumb.removeAttribute('aria-current');
        }
      });

      if (dialog.open) {
        updatePicture(dialogSource, dialogImage, item);
        if (dialogCounter) dialogCounter.textContent = counterText(currentIndex);
        animateImage(dialogImage);
      }

      updateDynamicLabels();
      animateImage(featureImage);

      if (options.scrollThumb !== false) centreActiveThumb(currentIndex);
      if (options.announce !== false && status) {
        status.textContent = t(
          'gallery.currentStatus',
          { index: currentIndex + 1, total: TOTAL },
          `Film still ${currentIndex + 1} of ${TOTAL} selected.`
        );
      }

      if (options.prefetch !== false) prefetchAdjacent();
    }

    function select(index, options = {}) {
      currentIndex = clampIndex(index);
      render(options);
    }

    function openDialog() {
      if (typeof dialog.showModal !== 'function') return;
      lastOpener = document.activeElement instanceof HTMLElement ? document.activeElement : featureButton;
      updatePicture(dialogSource, dialogImage, ITEMS[currentIndex]);
      if (dialogCounter) dialogCounter.textContent = counterText(currentIndex);
      updateDynamicLabels();
      document.body.classList.add('has-open-dialog');
      dialog.showModal();
      requestAnimationFrame(() => dialogTitle?.focus({ preventScroll: true }));
      prefetchAdjacent();
    }

    function closeDialog() {
      if (dialog.open) dialog.close();
    }

    function handleSwipeStart(event) {
      if (!event.isPrimary) return;
      swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    }

    function handleSwipeEnd(event, context) {
      if (!swipeStart || event.pointerId !== swipeStart.id) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(dx) < 46 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      if (context === 'feature') suppressOpen = true;
      select(currentIndex + (dx < 0 ? 1 : -1));
      if (context === 'feature') {
        global.setTimeout(() => { suppressOpen = false; }, 250);
      }
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => select(Number(thumb.dataset.galleryIndex || 0)));
    });

    previous?.addEventListener('click', () => select(currentIndex - 1));
    next?.addEventListener('click', () => select(currentIndex + 1));
    dialogPrevious?.addEventListener('click', () => select(currentIndex - 1));
    dialogNext?.addEventListener('click', () => select(currentIndex + 1));
    dialogClose?.addEventListener('click', closeDialog);

    featureButton.addEventListener('click', (event) => {
      if (suppressOpen) {
        event.preventDefault();
        return;
      }
      openDialog();
    });

    featureButton.addEventListener('pointerdown', handleSwipeStart, { passive: true });
    featureButton.addEventListener('pointerup', (event) => handleSwipeEnd(event, 'feature'), { passive: true });
    featureButton.addEventListener('pointercancel', () => { swipeStart = null; }, { passive: true });

    dialogViewer?.addEventListener('pointerdown', handleSwipeStart, { passive: true });
    dialogViewer?.addEventListener('pointerup', (event) => handleSwipeEnd(event, 'dialog'), { passive: true });
    dialogViewer?.addEventListener('pointercancel', () => { swipeStart = null; }, { passive: true });

    root.addEventListener('keydown', (event) => {
      if (dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        select(currentIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        select(currentIndex + 1);
      }
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        select(currentIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        select(currentIndex + 1);
      }
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('has-open-dialog');
      if (lastOpener?.isConnected) lastOpener.focus({ preventScroll: true });
    });

    global.TikusI18n?.subscribe(() => {
      updateDynamicLabels();
      if (dialog.open && dialogCounter) dialogCounter.textContent = counterText(currentIndex);
    });

    render({ announce: false, scrollThumb: false, prefetch: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
