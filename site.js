(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const SEARCH_INDEX = [
    {title:'애착 유형 테스트',desc:'단순형 12문항과 복잡형 36문항 자기점검',url:'tests.html',keys:'검사 테스트 내 유형 불안 회피'},
    {title:'안정형',desc:'불안과 회피가 모두 낮은 애착 원형',url:'types.html#secure',keys:'안정 secure 안전 친밀감 자율성'},
    {title:'불안집착형',desc:'불안이 높고 회피가 낮은 애착 원형',url:'types.html#anxious',keys:'불안형 집착형 preoccupied 과활성화'},
    {title:'거부회피형',desc:'불안이 낮고 회피가 높은 애착 원형',url:'types.html#dismissive',keys:'회피형 거부형 dismissing 비활성화'},
    {title:'공포회피형',desc:'불안과 회피가 모두 높은 애착 원형',url:'types.html#fearful',keys:'불안회피 fearful 혼란형 접근 철회'},
    {title:'16가지 관계 조합',desc:'나와 상대의 애착 전략이 맞물리는 방식',url:'pairings.html',keys:'궁합 조합 커플 연인 관계'},
    {title:'불안형 × 회피형',desc:'추격–철회 악순환과 관계 복구 방법',url:'pairings.html?me=anxious&partner=dismissive',keys:'불안 회피 조합 추격 철회'},
    {title:'애착 백과사전',desc:'기초 개념, 연구 체계, 안정화 연습과 참고자료',url:'encyclopedia.html',keys:'백과사전 이론 연구 애착'},
    {title:'애착 용어 사전',desc:'핵심 개념과 관계 용어를 검색',url:'glossary.html',keys:'용어 사전 개념 단어'},
    {title:'애착 불안',desc:'거절과 버림받음, 관계의 반응성에 대한 걱정',url:'glossary.html?q=애착 불안',keys:'anxiety 버림 거절 걱정'},
    {title:'애착 회피',desc:'의존, 취약성, 친밀감에 대한 불편함',url:'glossary.html?q=애착 회피',keys:'avoidance 거리 독립 의존'},
    {title:'과활성화 전략',desc:'접촉과 확인을 강화해 안전을 회복하려는 전략',url:'glossary.html?q=과활성화',keys:'hyperactivation 확인 연락 추격'},
    {title:'비활성화 전략',desc:'애착 욕구를 억제하고 거리를 늘리는 전략',url:'glossary.html?q=비활성화',keys:'deactivation 거리 침묵 철회'},
    {title:'안전기지',desc:'탐색과 성장을 가능하게 하는 신뢰 관계의 기능',url:'glossary.html?q=안전기지',keys:'secure base 탐색 성장'},
    {title:'안식처',desc:'위협과 스트레스 속에서 위로와 보호를 얻는 기능',url:'glossary.html?q=안식처',keys:'safe haven 위로 보호'},
    {title:'획득된 안정',desc:'새로운 관계 경험과 성찰로 안정성을 키우는 과정',url:'glossary.html?q=획득된 안정',keys:'earned security 변화 성장'},
    {title:'공동조절',desc:'두 사람이 정서적 안정 회복을 함께 돕는 과정',url:'glossary.html?q=공동조절',keys:'co regulation 정서 조절'},
    {title:'경계',desc:'내가 허용할 것과 허용하지 않을 것을 명확히 하는 기준',url:'glossary.html?q=경계',keys:'boundary 한계 존중'},
    {title:'낯선 상황 절차',desc:'영유아의 분리와 재결합 행동을 관찰하는 연구 절차',url:'encyclopedia.html#measurement',keys:'ainsworth 아동 혼란형'},
    {title:'ECR-R',desc:'성인 연애 애착의 불안과 회피를 측정하는 대표 척도',url:'encyclopedia.html#measurement',keys:'검사 척도 experiences close relationships'},
    {title:'AAI',desc:'어린 시절 경험을 말하는 담화의 조직 방식을 평가하는 면접',url:'encyclopedia.html#measurement',keys:'adult attachment interview 성인애착면접'}
  ];

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

  function initMenu() {
    const button = $('#menuButton');
    const sidebar = $('#siteSidebar');
    const overlay = $('#siteOverlay');
    const close = $('#sidebarClose');
    if (!button || !sidebar || !overlay) return;

    const setOpen = open => {
      sidebar.classList.toggle('open', open);
      overlay.classList.toggle('show', open);
      button.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    button.addEventListener('click', () => setOpen(true));
    close?.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));
    sidebar.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false);
    });
    addEventListener('keydown', event => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function normalize(value) {
    return value.toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();
  }

  function initSearch() {
    const openButton = $('#searchButton');
    const modal = $('#searchModal');
    const closeButton = $('#searchClose');
    const input = $('#siteSearchInput');
    const results = $('#siteSearchResults');
    if (!openButton || !modal || !input || !results) return;

    const render = query => {
      const term = normalize(query);
      if (!term) {
        results.innerHTML = '<div class="search-empty">유형, 조합, 검사 또는 궁금한 용어를 입력해 보세요.</div>';
        return;
      }
      const words = term.split(' ').filter(Boolean);
      const matches = SEARCH_INDEX.map(item => {
        const haystack = normalize(`${item.title} ${item.desc} ${item.keys}`);
        const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
        return {...item, score};
      }).filter(item => item.score > 0).sort((a,b) => b.score - a.score).slice(0, 12);

      results.innerHTML = matches.length
        ? matches.map(item => `<a href="${item.url}"><b>${item.title}</b><span>${item.desc}</span></a>`).join('')
        : '<div class="search-empty">검색 결과가 없습니다. 더 짧은 단어로 찾아보세요.</div>';
    };

    const setOpen = open => {
      modal.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        render(input.value);
        setTimeout(() => input.focus(), 30);
      }
    };
    openButton.addEventListener('click', () => setOpen(true));
    closeButton?.addEventListener('click', () => setOpen(false));
    input.addEventListener('input', () => render(input.value));
    modal.addEventListener('click', event => {
      if (event.target === modal) setOpen(false);
    });
    addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  initTheme();
  initMenu();
  initSearch();
  initServiceWorker();
})();