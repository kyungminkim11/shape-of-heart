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
    {title:'AAI',desc:'어린 시절 경험을 말하는 담화의 조직 방식을 평가하는 면접',url:'encyclopedia.html#measurement',keys:'adult attachment interview 성인애착면접'},
    {title:'의견 보내기',desc:'열린 프로젝트에 개선 의견과 오류 제보 남기기',url:'feedback.html',keys:'피드백 의견 제안 오류 열린 서비스'}
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
    sidebar.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
    addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
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
      if (open) { render(input.value); setTimeout(() => input.focus(), 30); }
    };
    openButton.addEventListener('click', () => setOpen(true));
    closeButton?.addEventListener('click', () => setOpen(false));
    input.addEventListener('input', () => render(input.value));
    modal.addEventListener('click', event => { if (event.target === modal) setOpen(false); });
    addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); }
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function applyUpdatedPurpose() {
    const story = $('#service-purpose .dashboard-feature');
    if (!story) return;

    const heading = story.querySelector('h3');
    const first = story.querySelector('p');
    if (heading) heading.textContent = '같은 잘못을 반복하지 않기 위해 시작했습니다';
    if (first) first.textContent = '소중한 사람의 불안과 상처를 충분히 이해하지 못한 채, 미안하다는 말과 같은 약속만 반복했던 제 행동을 돌아보는 것이 이 프로젝트의 출발점입니다.';

    let details = story.querySelector('.origin-story-details');
    if (!details) {
      details = document.createElement('details');
      details.className = 'origin-story-details';
      story.appendChild(details);
    }
    details.innerHTML = '<summary>이야기 더 읽기</summary><div><p>상대방이 여러 번 불안함과 힘든 마음을 이야기했는데도 저는 그 말을 충분히 이해하지 못했습니다. 상대를 위한다고 생각하며 말을 숨기거나 솔직하게 이야기하지 않았던 행동도 결국 신뢰를 무너뜨리고 불안을 더 크게 만드는 행동이었다는 것을 뒤늦게 깨달았습니다.</p><p>애착 유형을 공부하기 시작한 것은 상대방을 특정한 유형으로 단정하거나 관계에서 일어난 일을 유형의 탓으로 돌리기 위해서가 아닙니다. 상대방이 어떤 마음으로 힘들어했는지, 저는 왜 같은 행동을 반복했는지, 앞으로 누군가를 사랑할 때 어떤 태도와 소통이 필요한지를 제대로 이해하고 싶었습니다.</p><p>이 사이트를 만들었다는 사실만으로 제가 달라졌다고 생각하지 않습니다. 공부하고 정리하는 것은 변화의 시작일 뿐이고, 진짜 변화는 말을 숨기지 않는 것, 불편한 상황에서도 솔직하게 이야기하는 것, 상대방의 감정을 제 기준으로 판단하지 않는 것, 약속한 일을 실제 행동으로 지키는 것으로 증명해야 한다고 생각합니다.</p><p>이 기록은 누군가에게 다시 기회를 달라고 요구하거나 결정을 바꾸게 하기 위한 수단이 아닙니다. 상대방의 마음과 결정을 존중하고, 제가 공부하고 달라지기 위해 노력하는 일은 제가 스스로 선택하고 책임져야 할 몫입니다.</p><p>제가 무엇을 잘못했는지 잊지 않고 같은 방식으로 다시는 소중한 사람에게 상처를 주지 않기 위해 이 공간을 만들었습니다. 이곳이 관계를 단정하는 답안지가 아니라 자신의 마음과 행동을 천천히 돌아볼 수 있는 작은 안내서가 되었으면 합니다.</p></div>';
  }

  function initOpenProject() {
    $$('.site-sidebar').forEach(sidebar => {
      if (sidebar.querySelector('a[href="feedback.html"]')) return;
      const group = document.createElement('div');
      group.className = 'sidebar-group';
      group.innerHTML = '<span class="sidebar-label">PROJECT</span><a href="feedback.html">의견 보내기</a>';
      sidebar.appendChild(group);
    });
    const welcome = $('.dashboard-welcome');
    if (!welcome || $('#service-purpose')) return;
    const section = document.createElement('section');
    section.className = 'dashboard-section';
    section.id = 'service-purpose';
    section.innerHTML = '<article class="dashboard-feature"><small>WHY THIS PROJECT STARTED</small><h3>같은 잘못을 반복하지 않기 위해 시작했습니다</h3><p>소중한 사람의 불안과 상처를 충분히 이해하지 못한 채, 미안하다는 말과 같은 약속만 반복했던 제 행동을 돌아보는 것이 이 프로젝트의 출발점입니다.</p><a class="button button-primary" href="feedback.html">열린 프로젝트에 의견 보내기</a></article>';
    welcome.insertAdjacentElement('afterend', section);
    applyUpdatedPurpose();
    setTimeout(applyUpdatedPurpose, 140);
    setTimeout(applyUpdatedPurpose, 360);
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  initTheme();
  initMenu();
  initSearch();
  initOpenProject();
  initServiceWorker();
})();