(function registerTikusCinemaController(global) {
  'use strict';

  const data = global.TikusCinemaData;
  if (!data) return;

  const stateById = new Map(data.states.map((state) => [state.id, state]));
  let selectedState = 'all';

  function i18n() { return global.TikusI18n; }
  function language() { return i18n()?.language === 'ms' ? 'ms' : 'en'; }
  function t(key, variables = {}, fallback = '') { return i18n()?.t(key, variables, fallback) ?? fallback; }
  function stateName(state) { return state?.name?.[language()] || state?.name?.en || state?.id || ''; }
  function countLabel(count) { return t(count === 1 ? 'cinema.cinemaCount' : 'cinema.cinemasCount', { count }, `${count} cinemas`); }
  function mapsUrl(cinema) {
    const query = encodeURIComponent(`${cinema.name}, ${cinema.address}, Malaysia`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  function createStateIndexButton(state) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cinema-state-index__button';
    button.dataset.cinemaStateSelect = state.id;
    button.innerHTML = `<span>${stateName(state)}</span><strong>${data.stateCounts[state.id] || 0}</strong>`;
    button.setAttribute('aria-label', t('cinema.stateButtonAria', { state: stateName(state), count: data.stateCounts[state.id] || 0 }, stateName(state)));
    return button;
  }

  function renderAll(panel, heading, count) {
    heading.textContent = t('cinema.allHeading', { count: data.total }, `${data.total} cinemas nationwide`);
    count.textContent = t('cinema.statesCount', { count: data.states.length }, `${data.states.length} areas`);

    const intro = document.createElement('p');
    intro.className = 'cinema-panel__intro';
    intro.textContent = t('cinema.allIntro', {}, 'Choose a state to see cinema names, addresses and directions.');
    panel.appendChild(intro);

    const index = document.createElement('div');
    index.className = 'cinema-state-index';
    index.setAttribute('role', 'list');
    data.states.forEach((state) => {
      const item = document.createElement('div');
      item.setAttribute('role', 'listitem');
      item.appendChild(createStateIndexButton(state));
      index.appendChild(item);
    });
    panel.appendChild(index);
  }

  function createCinemaCard(cinema) {
    const article = document.createElement('article');
    article.className = 'cinema-card';

    const badge = document.createElement('span');
    badge.className = `cinema-card__chain cinema-card__chain--${cinema.chain}`;
    badge.textContent = cinema.chain === 'gsc' ? 'GSC' : cinema.chain === 'tgv' ? 'TGV' : t('cinema.independent', {}, 'Independent');

    const title = document.createElement('h4');
    title.textContent = cinema.name;

    const label = document.createElement('span');
    label.className = 'cinema-card__address-label';
    label.textContent = t('cinema.address', {}, 'Address');

    const address = document.createElement('p');
    address.className = 'cinema-card__address';
    address.textContent = cinema.address;

    const link = document.createElement('a');
    link.className = 'cinema-card__maps';
    link.href = mapsUrl(cinema);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('cinema.openMaps', {}, 'Open in Maps');
    link.setAttribute('aria-label', t('cinema.openMapsAria', { cinema: cinema.name }, `Open ${cinema.name} in Maps`));

    article.append(badge, title, label, address, link);
    return article;
  }

  function renderState(panel, heading, count, stateId) {
    const state = stateById.get(stateId);
    const venues = data.cinemas.filter((cinema) => cinema.state === stateId);
    heading.textContent = stateName(state);
    count.textContent = countLabel(venues.length);

    const list = document.createElement('div');
    list.className = 'cinema-card-list';
    venues.forEach((cinema) => list.appendChild(createCinemaCard(cinema)));
    panel.appendChild(list);
  }

  function renderPanel(root) {
    const panel = root.querySelector('[data-cinema-panel-body]');
    const heading = root.querySelector('[data-cinema-panel-title]');
    const count = root.querySelector('[data-cinema-panel-count]');
    const status = root.querySelector('[data-cinema-status]');
    if (!panel || !heading || !count) return;

    panel.replaceChildren();
    if (selectedState === 'all') renderAll(panel, heading, count);
    else renderState(panel, heading, count, selectedState);

    if (status) {
      const label = selectedState === 'all'
        ? t('cinema.allHeading', { count: data.total }, `${data.total} cinemas nationwide`)
        : `${stateName(stateById.get(selectedState))}: ${count.textContent}`;
      status.textContent = t('cinema.selectionStatus', { selection: label }, label);
    }
  }

  function updateSelection(root) {
    root.querySelectorAll('[data-cinema-state-select]').forEach((button) => {
      const active = button.dataset.cinemaStateSelect === selectedState;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    root.querySelectorAll('[data-cinema-shape]').forEach((shape) => {
      shape.classList.toggle('is-selected', shape.dataset.cinemaShape === selectedState);
    });
  }

  function selectState(root, stateId, options = {}) {
    if (stateId !== 'all' && !stateById.has(stateId)) return;
    selectedState = stateId;
    renderPanel(root);
    updateSelection(root);
    if (options.focusPanel) root.querySelector('[data-cinema-panel-title]')?.focus({ preventScroll: true });
  }

  function buildMapMarkers(root) {
    const layer = root.querySelector('[data-cinema-map-markers]');
    if (!layer) return;
    layer.replaceChildren();
    data.states.forEach((state) => {
      const count = data.stateCounts[state.id] || 0;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cinema-map__marker';
      button.dataset.cinemaStateSelect = state.id;
      button.style.left = `${state.marker.x}%`;
      button.style.top = `${state.marker.y}%`;
      button.dataset.label = stateName(state);
      button.innerHTML = `<span aria-hidden="true">${count}</span>`;
      button.setAttribute('aria-label', t('cinema.stateButtonAria', { state: stateName(state), count }, `${stateName(state)}, ${count} cinemas`));
      layer.appendChild(button);
    });
  }

  function buildStateChips(root) {
    const list = root.querySelector('[data-cinema-state-chips]');
    if (!list) return;
    list.replaceChildren();

    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'cinema-state-chip';
    all.dataset.cinemaStateSelect = 'all';
    all.textContent = t('cinema.all', {}, 'All locations');
    list.appendChild(all);

    data.states.forEach((state) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cinema-state-chip';
      button.dataset.cinemaStateSelect = state.id;
      button.textContent = `${stateName(state)} · ${data.stateCounts[state.id] || 0}`;
      list.appendChild(button);
    });
  }

  function refreshDynamicLanguage(root) {
    buildMapMarkers(root);
    buildStateChips(root);
    renderPanel(root);
    updateSelection(root);
  }

  function init() {
    const root = document.querySelector('[data-cinema-section]');
    if (!root) return;

    buildMapMarkers(root);
    buildStateChips(root);
    selectState(root, 'all');

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cinema-state-select]');
      if (!button || !root.contains(button)) return;
      selectState(root, button.dataset.cinemaStateSelect, { focusPanel: button.classList.contains('cinema-state-index__button') });
    });

    i18n()?.subscribe(() => refreshDynamicLanguage(root));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);
