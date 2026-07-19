(function bootstrapTikusMicrosite(global) {
  'use strict';

  document.documentElement.classList.add('js');

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
