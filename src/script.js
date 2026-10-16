(() => {
  const controls = [...document.querySelectorAll('[data-filter]')];
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
