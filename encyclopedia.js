(() => {
  'use strict';

  const loadData = callback => {
    if (window.ShapeHeartData) return callback(window.ShapeHeartData);
    const script = document.createElement('script');
    script.src = 'content-data.js';
    script.onload = () => callback(window.ShapeHeartData);
    script.onerror = () => console.error('콘텐츠 데이터를 불러오지 못했습니다.');
    document.head.appendChild(script);
  };

  loadData(data => {
    if (!data) return;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    function initTheme() {
      const button = $('#themeToggle');
      if (!button) return;
      const sync = () => {
        const dark = document.documentElement.dataset.theme === 'dark';
        button.setAttribute('aria-pressed', String(dark));
        button.setAttribute('aria-label', dark ? '밝은 화면으로 변경' : '어두운 화면으로 변경');
      };
      sync();
      button.addEventListener('click', () => {
        const dark = document.documentElement.dataset.theme === 'dark';
        if (dark) delete document.documentElement.dataset.theme;
        else document.documentElement.dataset.theme = 'dark';
        try { localStorage.setItem('soh-theme', dark ? 'light' : 'dark'); } catch (_) {}
        sync();
      });
    }

    function renderProfile(key) {
      const t = data.types[key];
      const panel = $('#profilePanel');
      if (!panel || !t) return;
      const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
      panel.style.setProperty('--profile-accent', key === 'secure' ? '#679677' : key === 'anxious' ? '#c8794f' : key === 'dismissive' ? '#608ea5' : '#8b70af');
      panel.style.setProperty('--profile-soft', key === 'secure' ? 'rgba(174,205,184,.28)' : key === 'anxious' ? 'rgba(244,167,126,.25)' : key === 'dismissive' ? 'rgba(159,198,216,.28)' : 'rgba(201,182,233,.28)');
      panel.innerHTML = `<article class="profile-hero-card">
        <div class="profile-identity"><span class="profile-emblem">${t.symbol}</span><div><small>${t.english} · ${t.axes}</small><h3>${t.name}</h3></div></div>
        <p class="profile-quote">“${t.quote}”</p>
        <div class="profile-core-grid">
          <article><small>내면의 기본 기대</small><p>${t.inner}</p></article>
          <article><small>겉으로 보이는 반응</small><p>${t.outward}</p></article>
          <article><small>갈등 상황</small><p>${t.conflict}</p></article>
          <article><small>친밀감과 이별</small><p>${t.intimacy} ${t.breakup}</p></article>
        </div>
        <div class="profile-detail-grid">
          <article class="profile-detail-card"><h4>강점</h4>${list(t.strengths)}</article>
          <article class="profile-detail-card"><h4>주의할 위험</h4>${list(t.risks)}</article>
          <article class="profile-detail-card"><h4>관계에서 필요한 경험</h4>${list(t.needs)}</article>
          <article class="profile-detail-card"><h4>도움이 되는 표현</h4>${list(t.helpful)}</article>
        </div>
        <article class="profile-sequence"><h4>스트레스 상황에서 나타날 수 있는 흐름</h4><div class="sequence-steps">${t.sequence.map((step,index) => `<div><span>${index+1}</span><p>${step}</p></div>`).join('')}</div></article>
      </article>`;
    }

    function initProfiles() {
      const tabs = $$('[data-profile-tab]');
      if (!tabs.length) return;
      tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
        renderProfile(tab.dataset.profileTab);
      }));
      renderProfile('secure');
    }

    function initPairings() {
      const my = $('#myType');
      const partner = $('#partnerType');
      const result = $('#pairingResult');
      const matrix = $('#pairingMatrix');
      if (!my || !partner || !result || !matrix) return;
      const options = data.typeOrder.map(key => `<option value="${key}">${data.types[key].name}</option>`).join('');
      my.innerHTML = options;
      partner.innerHTML = options;
      my.value = 'secure';
      partner.value = 'anxious';

      function render() {
        const key = `${my.value}-${partner.value}`;
        const item = data.pairings[key];
        if (!item) return;
        result.innerHTML = `<article class="pairing-result-card">
          <header class="pairing-result-head"><small>${item.tone}</small><h3>${item.title}</h3><p>${item.tagline}</p><div class="pairing-score"><span>${item.balance}</span><span>${data.types[my.value].axes}</span><span>${data.types[partner.value].axes}</span></div></header>
          <div class="pairing-sections"><article><h4>기본 흐름</h4><p>${item.intro}</p></article><article><h4>강점과 가능성</h4><p>${item.strengths}</p></article><article><h4>마찰 지점</h4><p>${item.friction}</p></article><article><h4>반복 악순환</h4><p>${item.cycle}</p></article><article><h4>복구 핵심</h4><p>${item.repair}</p></article></div>
          <div class="pairing-script"><b>써볼 수 있는 문장</b><q>“${item.script}”</q></div>
        </article>`;
        $$('.pair-cell[data-me]', matrix).forEach(cell => cell.classList.toggle('selected', cell.dataset.me === my.value && cell.dataset.partner === partner.value));
      }

      let html = '<div class="pair-cell header corner"></div>';
      data.typeOrder.forEach(key => { html += `<div class="pair-cell header">${data.types[key].name}</div>`; });
      data.typeOrder.forEach(me => {
        html += `<div class="pair-cell header">${data.types[me].name}<br>인 나</div>`;
        data.typeOrder.forEach(other => {
          const item = data.pairings[`${me}-${other}`];
          html += `<button class="pair-cell" type="button" data-me="${me}" data-partner="${other}"><strong>${item.tone}</strong>${data.types[other].name} 상대</button>`;
        });
      });
      matrix.innerHTML = html;
      $$('.pair-cell[data-me]', matrix).forEach(cell => cell.addEventListener('click', () => {
        my.value = cell.dataset.me;
        partner.value = cell.dataset.partner;
        render();
        result.scrollIntoView({behavior:'smooth',block:'center'});
      }));
      my.addEventListener('change', render);
      partner.addEventListener('change', render);
      render();
    }

    function initGlossary() {
      const search = $('#glossarySearch');
      const clear = $('#clearSearch');
      const filters = $('#glossaryFilters');
      const count = $('#glossaryCount');
      const list = $('#glossaryList');
      const empty = $('#glossaryEmpty');
      if (!search || !filters || !list) return;
      let category = '전체';
      const normalize = value => value.toLocaleLowerCase('ko-KR').replace(/\s+/g,' ').trim();

      function renderFilters() {
        filters.innerHTML = data.categories.map(item => `<button type="button" class="${item === category ? 'active' : ''}" data-category="${item}">${item}</button>`).join('');
        $$('button', filters).forEach(button => button.addEventListener('click', () => { category = button.dataset.category; renderFilters(); render(); }));
      }

      function render() {
        const words = normalize(search.value).split(' ').filter(Boolean);
        const items = data.glossary.filter(item => {
          if (category !== '전체' && item.category !== category) return false;
          if (!words.length) return true;
          const haystack = normalize(`${item.term} ${item.english} ${item.definition} ${item.distinction} ${item.example}`);
          return words.every(word => haystack.includes(word));
        });
        count.textContent = `총 ${data.glossary.length}개 중 ${items.length}개 용어`;
        list.innerHTML = items.map(item => `<details class="glossary-item"><summary><div class="glossary-term"><b>${item.term}</b><span>${item.english}</span></div><span class="glossary-category">${item.category}</span><span class="glossary-plus">+</span></summary><div class="glossary-body"><p>${item.definition}</p><dl><div><dt>구분</dt><dd>${item.distinction}</dd></div><div><dt>예시</dt><dd>${item.example}</dd></div></dl></div></details>`).join('');
        empty.hidden = items.length !== 0;
      }

      search.addEventListener('input', render);
      clear.addEventListener('click', () => { search.value = ''; search.focus(); render(); });
      renderFilters();
      render();
    }

    function initNavigation() {
      const links = $$('.encyclopedia-nav a');
      const sections = links.map(link => $(link.getAttribute('href'))).filter(Boolean);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
          if (!visible) return;
          links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
        }, {rootMargin:'-30% 0px -60% 0px',threshold:[0,.2,.5]});
        sections.forEach(section => observer.observe(section));
      }
      const top = $('#backToTop');
      addEventListener('scroll', () => top?.classList.toggle('show', scrollY > 700), {passive:true});
      top?.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));
    }

    initTheme();
    initProfiles();
    initPairings();
    initGlossary();
    initNavigation();
    const year = $('#currentYear');
    if (year) year.textContent = new Date().getFullYear();
    if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  });
})();