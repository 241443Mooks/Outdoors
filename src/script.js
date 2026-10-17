(() => {
  const controls = [...document.querySelectorAll('[data-filter]')];
  if (!controls.length) return;
  const cards = [...document.querySelectorAll('[data-card]')];
  const status = document.getElementById('filter-status');

  function selectFilter(value, updateUrl = true) {
    const selected = controls.some(button => button.dataset.filter === value) ? value : 'All';
    controls.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === selected));
    });
    let count = 0;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(' ');
      const visible = selected === 'All' || tags.includes(selected);
      card.hidden = !visible;
      if (visible) count++;
    });
    status.textContent = selected === 'All'
      ? 'Showing all ' + count + ' resource cards.'
      : 'Showing ' + count + ' ' + selected.toLowerCase() + ' resource ' +
        (count === 1 ? 'card.' : 'cards.');
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (selected === 'All') url.searchParams.delete('category');
      else url.searchParams.set('category', selected);
      window.history.replaceState(null, '', url);
    }
  }

  controls.forEach(button => {
    button.addEventListener('click', () => selectFilter(button.dataset.filter));
  });
  selectFilter(new URLSearchParams(window.location.search).get('category') || 'All', false);
})();

 
// Play has its own filter controls, separate from Outside's resource categories.
(() => {
  const controls = [...document.querySelectorAll('[data-play-filter]')];
  const cards = [...document.querySelectorAll('[data-play-card]')];
  const status = document.getElementById('play-filter-status');
  if (!controls.length || !status) return;

  function selectType(type, updateUrl = true) {
    const selected = controls.some(button => button.dataset.playFilter === type) ? type : 'all';
    controls.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.playFilter === selected));
    });
    let count = 0;
    cards.forEach(card => {
      const visible = selected === 'all' || card.dataset.gameType === selected;
      card.hidden = !visible;
      if (visible) count++;
    });
    const labels = { board: 'board games', dice: 'dice games', card: 'card games' };
    status.textContent = selected === 'all'
      ? 'Showing all ' + count + ' games.'
      : 'Showing ' + count + ' ' + labels[selected] + '.';
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (selected === 'all') url.searchParams.delete('type');
      else url.searchParams.set('type', selected);
      window.history.replaceState(null, '', url);
    }
  }

  controls.forEach(button => {
    button.addEventListener('click', () => selectType(button.dataset.playFilter));
  });
  selectType(new URLSearchParams(window.location.search).get('type') || 'all', false);
})();
