(function registerSceneController(global) {
  'use strict';

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  class SceneController {
    constructor(options) {
      const { data, modal, root } = options;
      this.data = data;
      this.modal = modal;
      this.root = root;

      this.stage = root.querySelector('[data-scene-stage]');
      this.picture = root.querySelector('[data-scene-picture]');
      this.avifSource = root.querySelector('[data-scene-source="avif"]');
      this.webpSource = root.querySelector('[data-scene-source="webp"]');
      this.image = root.querySelector('[data-scene-image]');
      this.hotspotLayer = root.querySelector('[data-hotspot-layer]');
      this.navigationLayer = root.querySelector('[data-scene-navigation-layer]');
      this.iris = root.querySelector('[data-iris]');
      this.returnButton = root.querySelector('[data-return-house]');
      this.sceneButtons = Array.from(root.querySelectorAll('[data-scene-target]'));
      this.sceneInstruction = root.querySelector('[data-scene-instruction]');
      this.captionEyebrow = root.querySelector('[data-scene-eyebrow]');
      this.captionTitle = root.querySelector('[data-scene-title]');
      this.liveRegion = root.querySelector('[data-scene-status]');
      this.explorer = document.getElementById('explorer');

      this.state = {
        sceneId: 'house',
        activeHotspotId: null,
        isTransitioning: false,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };

      this.prefetchCache = new Map();
      this.resizeObserver = null;

      this.handleHashChange = this.handleHashChange.bind(this);
      this.syncInteractiveBounds = this.syncInteractiveBounds.bind(this);
    }

    init() {
      this.sceneButtons.forEach((button) => {
        const sceneId = button.dataset.sceneTarget;
        button.addEventListener('click', () => this.navigateTo(sceneId, { origin: button }));

        const warmScene = () => this.prefetchScene(sceneId);
        button.addEventListener('pointerenter', warmScene, { once: true });
        button.addEventListener('focus', warmScene, { once: true });
        button.addEventListener('touchstart', warmScene, { once: true, passive: true });
      });

      this.returnButton.addEventListener('click', () => {
        this.navigateTo('house', { origin: this.returnButton });
      });

      this.image.addEventListener('load', this.syncInteractiveBounds);
      window.addEventListener('hashchange', this.handleHashChange);
      window.addEventListener('resize', this.syncInteractiveBounds, { passive: true });

      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.syncInteractiveBounds);
        this.resizeObserver.observe(this.stage);
      }

      const initialSceneId = this.sceneIdFromHash(window.location.hash);
      this.applyScene(initialSceneId, { announce: false, waitForImage: false });

      if (initialSceneId !== 'house') {
        window.requestAnimationFrame(() => {
          this.explorer.scrollIntoView({ block: 'start' });
        });
      }
    }

    sceneIdFromHash(hash) {
      const value = String(hash || '').replace(/^#/, '').trim();
      if (!value || value === 'explorer' || value === 'house') {
        return 'house';
      }
      return this.data.scenes[value] ? value : 'house';
    }

    handleHashChange() {
      const nextSceneId = this.sceneIdFromHash(window.location.hash);
      if (nextSceneId !== this.state.sceneId) {
        this.navigateTo(nextSceneId, { updateHash: false, origin: null });
      }
    }

    async navigateTo(sceneId, options = {}) {
      const { updateHash = true, origin = null } = options;
      if (!this.data.scenes[sceneId] || this.state.isTransitioning || sceneId === this.state.sceneId) {
        return;
      }

      if (this.modal.dialog.open) {
        this.modal.close({ restoreFocus: false });
      }

      this.state.isTransitioning = true;
      this.setControlsDisabled(true);

      try {
        await this.playIrisTransition(origin, () => this.applyScene(sceneId));
        if (updateHash) {
          window.location.hash = sceneId;
        }
      } finally {
        this.state.isTransitioning = false;
        this.setControlsDisabled(false);
      }
    }

    async playIrisTransition(origin, swapScene) {
      if (this.state.reducedMotion || !this.iris.animate) {
        await swapScene();
        return;
      }

      const stageRect = this.stage.getBoundingClientRect();
      const originRect = origin instanceof HTMLElement ? origin.getBoundingClientRect() : null;
      const rawX = originRect ? originRect.left + originRect.width / 2 - stageRect.left : stageRect.width / 2;
      const rawY = originRect ? originRect.top + originRect.height / 2 - stageRect.top : stageRect.height / 2;
      const x = Math.max(0, Math.min(stageRect.width, rawX));
      const y = Math.max(0, Math.min(stageRect.height, rawY));
      const diameter = Math.hypot(stageRect.width, stageRect.height) * 2.35;

      Object.assign(this.iris.style, {
        width: `${diameter}px`,
        height: `${diameter}px`,
        left: `${x}px`,
        top: `${y}px`,
        opacity: '1'
      });
      this.iris.hidden = false;

      const cover = this.iris.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)' },
          { transform: 'translate(-50%, -50%) scale(1)' }
        ],
        {
          duration: 250,
          easing: 'cubic-bezier(.72, 0, .28, 1)',
          fill: 'forwards'
        }
      );

      await cover.finished.catch(() => undefined);
      await swapScene();
      await wait(35);

      const reveal = this.iris.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)' },
          { transform: 'translate(-50%, -50%) scale(0)' }
        ],
        {
          duration: 220,
          easing: 'cubic-bezier(.62, 0, .2, 1)',
          fill: 'forwards'
        }
      );

      await reveal.finished.catch(() => undefined);
      this.iris.hidden = true;
      this.iris.getAnimations().forEach((animation) => animation.cancel());
    }

    async applyScene(sceneId, options = {}) {
      const { announce = true, waitForImage = true } = options;
      const scene = this.data.scenes[sceneId];
      this.state.sceneId = sceneId;
      this.state.activeHotspotId = null;
      this.root.dataset.activeScene = sceneId;
      this.hotspotLayer.replaceChildren();

      this.avifSource.srcset = `${scene.image.avif.small} 960w, ${scene.image.avif.large} 1600w`;
      this.webpSource.srcset = `${scene.image.webp.small} 960w, ${scene.image.webp.large} 1600w`;
      this.image.srcset = `${scene.image.fallback.small} 960w, ${scene.image.fallback.large} 1600w`;
      this.image.sizes = '(max-width: 62rem) calc(100vw - 2rem), min(88vw, 100rem)';
      this.image.src = scene.image.fallback.large;
      this.image.alt = scene.alt;
      this.image.width = scene.image.width;
      this.image.height = scene.image.height;
      this.image.fetchPriority = sceneId === 'house' ? 'high' : 'auto';

      this.captionEyebrow.textContent = scene.eyebrow;
      this.captionTitle.textContent = scene.title;
      this.sceneInstruction.textContent = scene.navigationHint || '';
      this.returnButton.hidden = sceneId === 'house';
      this.updateSceneNavigation(sceneId);

      document.title = sceneId === 'house'
        ? this.data.site.baseDocumentTitle
        : `${scene.title} | ${this.data.site.title}`;

      if (waitForImage) {
        await this.waitForCurrentImage();
      }

      this.renderHotspots(scene.hotspots);
      this.syncInteractiveBounds();

      if (announce) {
        const count = scene.hotspots.length;
        this.liveRegion.textContent = count > 0
          ? `${scene.title} loaded. ${count} interactive hotspots available. ${scene.navigationHint || ''}`
          : `${scene.title} exterior loaded. ${scene.navigationHint || ''}`;
      }
    }

    updateSceneNavigation(sceneId) {
      this.sceneButtons.forEach((button) => {
        button.hidden = button.dataset.visibleScene !== sceneId;
      });
    }

    renderHotspots(hotspots) {
      const fragment = document.createDocumentFragment();

      hotspots.forEach((hotspot, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'hotspot';
        button.dataset.hotspotId = hotspot.id;
        button.style.setProperty('--hotspot-x', `${hotspot.x}%`);
        button.style.setProperty('--hotspot-y', `${hotspot.y}%`);
        button.setAttribute('aria-label', hotspot.label);
        button.style.setProperty('--hotspot-delay', `${index * 120}ms`);

        const dot = document.createElement('span');
        dot.className = 'hotspot__dot';
        dot.setAttribute('aria-hidden', 'true');

        const tooltip = document.createElement('span');
        tooltip.className = 'hotspot__tooltip';
        tooltip.textContent = hotspot.subject;
        tooltip.setAttribute('aria-hidden', 'true');

        button.append(dot, tooltip);
        button.addEventListener('click', () => {
          this.state.activeHotspotId = hotspot.id;
          if (hotspot.type === 'game' && hotspot.gameId && global.TikusArcade?.open) {
            global.TikusArcade.open(hotspot.gameId, button);
            return;
          }
          if (hotspot.type === 'arcade-hub' && global.TikusArcade?.open) {
            global.TikusArcade.open('rush', button);
            return;
          }
          this.modal.open(hotspot, button);
        });
        fragment.append(button);
      });

      this.hotspotLayer.append(fragment);
    }

    syncInteractiveBounds() {
      const scene = this.data.scenes[this.state.sceneId];
      if (!scene || !this.stage.clientWidth || !this.stage.clientHeight) {
        return;
      }

      const stageWidth = this.stage.clientWidth;
      const stageHeight = this.stage.clientHeight;
      const imageRatio = scene.image.width / scene.image.height;
      const stageRatio = stageWidth / stageHeight;

      let width;
      let height;
      let left;
      let top;

      if (stageRatio > imageRatio) {
        height = stageHeight;
        width = height * imageRatio;
        left = (stageWidth - width) / 2;
        top = 0;
      } else {
        width = stageWidth;
        height = width / imageRatio;
        left = 0;
        top = (stageHeight - height) / 2;
      }

      [this.hotspotLayer, this.navigationLayer].forEach((layer) => {
        Object.assign(layer.style, {
          width: `${width}px`,
          height: `${height}px`,
          left: `${left}px`,
          top: `${top}px`
        });
      });
    }

    waitForCurrentImage() {
      if (this.image.complete && this.image.naturalWidth > 0) {
        return typeof this.image.decode === 'function'
          ? this.image.decode().catch(() => undefined)
          : Promise.resolve();
      }

      return Promise.race([
        new Promise((resolve) => {
          this.image.addEventListener('load', resolve, { once: true });
          this.image.addEventListener('error', resolve, { once: true });
        }),
        wait(1800)
      ]).then(() => {
        if (typeof this.image.decode === 'function' && this.image.complete && this.image.naturalWidth > 0) {
          return this.image.decode().catch(() => undefined);
        }
        return undefined;
      });
    }

    prefetchScene(sceneId) {
      if (this.prefetchCache.has(sceneId) || !this.data.scenes[sceneId]) {
        return;
      }

      const scene = this.data.scenes[sceneId];
      const image = new Image();
      image.decoding = 'async';
      image.srcset = `${scene.image.webp.small} 960w, ${scene.image.webp.large} 1600w`;
      image.sizes = '(max-width: 62rem) calc(100vw - 2rem), min(88vw, 100rem)';
      image.src = scene.image.webp.large;
      this.prefetchCache.set(sceneId, image);
    }

    setControlsDisabled(disabled) {
      this.sceneButtons.forEach((button) => {
        button.disabled = disabled;
      });
      this.returnButton.disabled = disabled;
      this.root.setAttribute('aria-busy', String(disabled));
    }
  }

  global.TikusSceneController = SceneController;
})(window);
