(function registerTikusAnalytics(global) {
  'use strict';

  const MEASUREMENT_ID = 'G-7VN040G6K0';
  const LIVE_HOSTS = new Set(['feisk.com.my', 'www.feisk.com.my']);
  const enabled = /^https?:$/.test(global.location.protocol)
    && LIVE_HOSTS.has(global.location.hostname.toLowerCase());

  function currentLanguage() {
    return global.TikusI18n?.language || document.documentElement.lang || 'en';
  }

  function currentPath() {
    return `${global.location.pathname}${global.location.hash || ''}`;
  }

  function track(eventName, parameters = {}) {
    if (!enabled || typeof global.gtag !== 'function') return;
    global.gtag('event', eventName, {
      page_language: currentLanguage(),
      site_section: currentPath(),
      ...parameters
    });
  }

  function loadGoogleTag() {
    if (!enabled) return;

    global.dataLayer = global.dataLayer || [];
    global.gtag = global.gtag || function gtag() {
      global.dataLayer.push(arguments);
    };

    global.gtag('js', new Date());
    global.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.dataset.tikusAnalytics = '';
    document.head.append(script);
  }

  function textOf(element, selector) {
    return element?.querySelector(selector)?.textContent?.trim() || '';
  }

  function initInteractionTracking() {
    document.addEventListener('tikuslanguagechange', (event) => {
      track('language_change', {
        language: event.detail?.language || currentLanguage()
      });
    });

    document.addEventListener('change', (event) => {
      const select = event.target.closest?.('[data-cinema-state]');
      if (!select || !select.value) return;
      const selected = select.options[select.selectedIndex];
      track('cinema_state_select', {
        state_id: select.value,
        state_label: selected?.textContent?.split('·')[0]?.trim() || select.value
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest?.('a, button');
      if (!target) return;

      if (target.matches('[data-trailer-open]')) {
        track('trailer_open', { trailer: 'official' });
        return;
      }

      if (target.matches('[data-trailer-link]')) {
        track('trailer_youtube_click', { trailer: 'official' });
        return;
      }

      if (target.matches('[data-gallery-feature]')) {
        const counter = document.querySelector('[data-gallery-counter]')?.textContent || '';
        const still = Number.parseInt(counter, 10) || 1;
        track('gallery_open', { still_index: still });
        return;
      }

      if (target.matches('[data-gallery-index]')) {
        track('gallery_still_select', {
          still_index: Number(target.dataset.galleryIndex) + 1
        });
        return;
      }

      if (target.matches('[data-cast-card]') && target.getAttribute('aria-pressed') === 'true') {
        track('cast_profile_open', {
          cast_id: target.dataset.castCard || '',
          cast_name: textOf(target, '.cast-card__name')
        });
        return;
      }

      if (target.matches('.cinema-card__map')) {
        const card = target.closest('.cinema-card');
        const select = document.querySelector('[data-cinema-state]');
        track('cinema_directions', {
          cinema_name: textOf(card, 'h4'),
          cinema_chain: textOf(card, '.cinema-card__chain'),
          state_id: select?.value || ''
        });
        return;
      }

      if (target.matches('[data-nav-link]')) {
        track('site_nav_click', {
          destination: target.getAttribute('href') || '',
          link_text: target.textContent?.trim() || ''
        });
        return;
      }

      if (target instanceof HTMLAnchorElement && target.href) {
        let destination;
        try {
          destination = new URL(target.href, global.location.href);
        } catch (error) {
          return;
        }
        if (destination.hostname && destination.hostname !== global.location.hostname) {
          track('outbound_link_click', {
            link_domain: destination.hostname,
            link_text: target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 100) || '',
            link_url: destination.href.slice(0, 500)
          });
        }
      }
    });
  }

  global.TikusAnalytics = Object.freeze({
    measurementId: MEASUREMENT_ID,
    enabled,
    track
  });

  loadGoogleTag();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractionTracking, { once: true });
  } else {
    initInteractionTracking();
  }
})(window);
