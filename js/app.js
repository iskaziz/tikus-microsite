(function bootstrapTikusMicrosite(global) {
  'use strict';

  document.documentElement.classList.add('js');

  function init() {
    const status = document.querySelector('[data-scene-status]');

    try {
      if (!global.TIKUS_CONTENT || !global.TikusModalController || !global.TikusSceneController) {
        throw new Error('Required TIKUS modules did not load.');
      }

      const dialog = document.getElementById('hotspot-dialog');
      const explorerRoot = document.querySelector('[data-scene-explorer]');
      const modal = new global.TikusModalController(dialog);
      const scenes = new global.TikusSceneController({
        data: global.TIKUS_CONTENT,
        modal,
        root: explorerRoot
      });

      scenes.init();
      global.TikusMicrosite = Object.freeze({ modal, scenes });
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
