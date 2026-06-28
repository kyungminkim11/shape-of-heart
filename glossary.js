(() => {
  'use strict';
  const data = window.ShapeHeartData;
  if (!data) return;

  const search = document.getElementById('dictionarySearch');
  const clear = document.getElementById('dictionaryClear');
  const filters = document.getElementById('dictionaryFilters');
  const count = document.getElementById('dictionaryCount');
  const grid = document.getElementById('dictionaryGrid');
  const empty = document.getElementById('dictionaryEmpty');
  let category = '전체';

  const normalize = value => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();

  function renderFilters() {
    filters.innerHTML = data.categories.map(item => `<button type="button" class="${item === category ? 'active' : ''}" data-category="${item}">${item}</button>`).join('');
    filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      renderFilters();
      render();
    }));
  }

  function render() {
    const term = normalize(search.value);
    const words = term.split(' ').filter(Boolean);
    const items = data.glossary.filter(item => {
      if (category !== '전체' && item.category !== category) return false;
      if (!words.length) return true;
      const haystack = normalize(`${item.term} ${item.english} ${item.definition} ${item.distinction} ${item.example} ${item.category}`);
      return words.every(word => haystack.includes(word));
    });

    count.textContent = `총 ${data.glossary.length}개 중 ${items.length}개 용어`;
    grid.innerHTML = items.map(item => `<details class="dictionary-item">
      <summary>
        <div class="dictionary-title"><b>${item.term}</b><span>${item.english}</span></div>
        <span class="dictionary-tag">${item.category}</span><span class="dictionary-plus" aria-hidden="true">+</span>
      </summary>
      <div class="dictionary-body"><p>${item.definition}</p><dl><div><dt>구분</dt><dd>${item.distinction}</dd></div><div><dt>예시</dt><dd>${item.example}</dd></div></dl></div>
    </details>`).join('');
    empty.hidden = items.length !== 0;
  }

  const initial = new URLSearchParams(location.search).get('q') || '';
  search.value = initial;
  search.addEventListener('input', () => {
    const url = new URL(location.href);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    render();
  });
  clear.addEventListener('click', () => { search.value = ''; search.focus(); history.replaceState(null, '', location.pathname); render(); });

  renderFilters();
  render();
})();