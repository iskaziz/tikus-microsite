(function registerTikusCinemaController(global) {
  'use strict';

  function t(key, variables = {}, fallback = '') {
    return global.TikusI18n?.t(key, variables, fallback) ?? fallback;
  }

  function mapsUrl(venue) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`;
  }

  function getLanguage() {
    return global.TikusI18n?.language || document.documentElement.lang || 'en';
  }

  function init() {
    const data = global.TikusCinemaData;
    const select = document.querySelector('[data-cinema-state]');
    const panel = document.querySelector('[data-cinema-results]');
    const status = document.querySelector('[data-cinema-status]');
    if (!data || !select || !panel) return;

    let selected = select.value || '';

    function areaName(area) {
      return getLanguage() === 'ms' ? area.ms : area.en;
    }

    function populateSelect() {
      const current = selected;
      const first = document.createElement('option');
      first.value = '';
      first.textContent = t('cinema.chooseState', {}, 'Choose a state');
      const fragment = document.createDocumentFragment();
      fragment.append(first);
      data.areas.forEach((area) => {
        const count = data.venues.filter((venue) => venue.area === area.id).length;
        const option = document.createElement('option');
        option.value = area.id;
        option.textContent = `${areaName(area)} · ${count}`;
        fragment.append(option);
      });
      select.replaceChildren(fragment);
      select.value = current;
    }

    function render() {
      panel.replaceChildren();
      if (!selected) {
        const empty = document.createElement('p');
        empty.className = 'cinema-finder__empty';
        empty.textContent = t('cinema.empty', {}, 'Select a state to see cinema locations.');
        panel.append(empty);
        if (status) status.textContent = '';
        return;
      }

      const area = data.areas.find((item) => item.id === selected);
      const venues = data.venues.filter((venue) => venue.area === selected);
      const heading = document.createElement('div');
      heading.className = 'cinema-finder__result-heading';
      const title = document.createElement('h3');
      title.textContent = area ? areaName(area) : selected;
      const count = document.createElement('span');
      count.textContent = t('cinema.locationCount', { count: venues.length }, `${venues.length} locations`);
      heading.append(title, count);

      const list = document.createElement('div');
      list.className = 'cinema-list';
      venues.forEach((venue) => {
        const article = document.createElement('article');
        article.className = 'cinema-card';
        const top = document.createElement('div');
        top.className = 'cinema-card__top';
        const name = document.createElement('h4');
        name.textContent = venue.name;
        const badge = document.createElement('span');
        badge.className = 'cinema-card__chain';
        badge.textContent = venue.chain === 'PARAGON' ? 'PARAGON' : venue.chain;
        top.append(name, badge);
        const address = document.createElement('p');
        address.textContent = venue.address;
        const link = document.createElement('a');
        link.className = 'cinema-card__map';
        link.href = mapsUrl(venue);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = t('cinema.openMap', {}, 'Open in Maps');
        link.setAttribute('aria-label', t('cinema.openMapAria', { cinema: venue.name }, `Open ${venue.name} in Google Maps`));
        article.append(top, address, link);
        list.append(article);
      });

      panel.append(heading, list);
      if (status) {
        status.textContent = t('cinema.status', { state: area ? areaName(area) : selected, count: venues.length }, `${venues.length} cinema locations shown for ${area ? areaName(area) : selected}.`);
      }
    }

    select.addEventListener('change', () => {
      selected = select.value;
      render();
    });

    global.TikusI18n?.subscribe(() => {
      populateSelect();
      render();
    });

    populateSelect();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
