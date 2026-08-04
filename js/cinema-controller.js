(function registerTikusCinemaController(global) {
  'use strict';

  const data = global.TikusCinemaData;
  if (!data) return;

  const stateById = new Map(data.states.map((state) => [state.id, state]));
  let selectedState = '';

  function i18n() { return global.TikusI18n; }
  function language() { return i18n()?.language === 'ms' ? 'ms' : 'en'; }
  function t(key, variables = {}, fallback = '') { return i18n()?.t(key, variables, fallback) ?? fallback; }
  function stateName(state) { return state?.name?.[language()] || state?.name?.en || state?.id || ''; }
  function countLabel(count) { return t(count === 1 ? 'cinema.cinemaCount' : 'cinema.cinemasCount', { count }, `${count} cinemas`); }
  function mapsUrl(cinema) {
    const query = encodeURIComponent(`${cinema.name}, ${cinema.address}, Malaysia`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
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

  function renderPrompt(root) {
    const panel = root.querySelector('[data-cinema-panel-body]');
    const heading = root.querySelector('[data-cinema-panel-title]');
    const count = root.querySelector('[data-cinema-panel-count]');
    if (!panel || !heading || !count) return;

    panel.replaceChildren();
    heading.textContent = t('cinema.promptHeading', {}, 'Choose a state');
    count.textContent = '';

    const intro = document.createElement('p');
    intro.className = 'cinema-panel__intro';
    intro.textContent = t('cinema.promptIntro', {}, 'Use the state selector to find participating cinemas near you.');
    panel.appendChild(intro);
  }

  function renderState(root, stateId) {
    const panel = root.querySelector('[data-cinema-panel-body]');
    const heading = root.querySelector('[data-cinema-panel-title]');
    const count = root.querySelector('[data-cinema-panel-count]');
    const status = root.querySelector('[data-cinema-status]');
    const state = stateById.get(stateId);
    if (!panel || !heading || !count || !state) return;

    const venues = data.cinemas.filter((cinema) => cinema.state === stateId);
    panel.replaceChildren();
    heading.textContent = stateName(state);
    count.textContent = countLabel(venues.length);

    const list = document.createElement('div');
    list.className = 'cinema-card-list';
    venues.forEach((cinema) => list.appendChild(createCinemaCard(cinema)));
    panel.appendChild(list);

    if (status) {
      const selection = `${stateName(state)}: ${countLabel(venues.length)}`;
      status.textContent = t('cinema.selectionStatus', { selection }, `${selection} selected.`);
    }
  }

  function buildSelect(root) {
    const select = root.querySelector('[data-cinema-state-select]');
    if (!select) return;

    select.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('cinema.selectorPlaceholder', {}, 'Choose a state');
    select.appendChild(placeholder);

    data.states.forEach((state) => {
      const option = document.createElement('option');
      option.value = state.id;
      const count = data.stateCounts[state.id] || 0;
      option.textContent = `${stateName(state)} — ${countLabel(count)}`;
      select.appendChild(option);
    });

    select.value = selectedState;
  }

  function selectState(root, stateId, options = {}) {
    if (stateId && !stateById.has(stateId)) return;
    selectedState = stateId;

    if (!selectedState) renderPrompt(root);
    else renderState(root, selectedState);

    const select = root.querySelector('[data-cinema-state-select]');
    if (select && select.value !== selectedState) select.value = selectedState;
    if (options.focusPanel && selectedState) root.querySelector('[data-cinema-panel-title]')?.focus({ preventScroll: true });
  }

  function refreshDynamicLanguage(root) {
    buildSelect(root);
    selectState(root, selectedState);
  }

  function init() {
    const root = document.querySelector('[data-cinema-section]');
    if (!root) return;

    buildSelect(root);
    selectState(root, '');

    root.querySelector('[data-cinema-state-select]')?.addEventListener('change', (event) => {
      selectState(root, event.currentTarget.value, { focusPanel: Boolean(event.currentTarget.value) });
    });

    i18n()?.subscribe(() => refreshDynamicLanguage(root));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);
