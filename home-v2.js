(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');
  if (!isHome) return;

  const svg = path => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
  const icons = {
    compass: svg('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm3.4-13.4-2 4.8-4.8 2 2-4.8 4.8-2Z'),
    search: svg('M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 5 5'),
    loop: svg('M20 7h-7a5 5 0 0 0-5 5v1m-4 4h7a5 5 0 0 0 5-5v-1M17 4l3 3-3 3M7 20l-3-3 3-3'),
    words: svg('M5 5h14v10H9l-4 4V5Zm4 4h6M9 12h4'),
    record: svg('M6 3h12v18H6zM9 8h6M9 12h6M9 16h4'),
    shield: svg('M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6l-7-3Zm-3 9 2 2 4-5'),
    arrow: svg('M5 12h14m-5-5 5 5-5 5')
  };

  function upgradeHero() {
    const hero = $('.dashboard-welcome');
    if (!hero || hero.dataset.v2Ready) return;
    hero.dataset.v2Ready = 'true';
    hero.classList.add('home-v2-hero');
    hero.innerHTML = `
      <div class="home-v2-hero-copy">
        <span class="home-v2-label">성인 애착과 관계 반응을 이해하는 정보 서비스</span>
        <h1>사랑의 반응을<br><em>이름보다 구조로</em> 이해하세요.</h1>
        <p>연락이 줄었을 때 불안해지는 이유, 가까워질수록 거리를 두는 이유, 같은 갈등이 반복되는 이유를 <strong>애착 불안과 애착 회피</strong> 두 축으로 차근히 살펴봅니다.</p>
        <div class="dashboard-actions home-v2-actions">
          <a class="button button-primary" href="tests.html">내 반응 점검하기 ${icons.arrow}</a>
          <a class="button button-ghost" href="#relationship-tools">지금 필요한 관계 도구</a>
        </div>
        <ul class="home-v2-trust" aria-label="서비스 특징">
          <li>12문항 빠른 점검</li>
          <li>36문항 심화 점검</li>
          <li>결과는 내 브라우저에 저장</li>
        </ul>
      </div>
      <div class="home-v2-map" aria-label="애착 불안과 회피 두 축으로 보는 네 가지 애착 원형">
        <div class="home-v2-map-caption"><b>관계 반응 지도</b><span>두 축으로 네 원형을 비교합니다</span></div>
        <div class="home-v2-map-board">
          <span class="axis-label axis-top">회피 높음</span>
          <span class="axis-label axis-bottom">회피 낮음</span>
          <span class="axis-label axis-left">불안 낮음</span>
          <span class="axis-label axis-right">불안 높음</span>
          <i class="axis-line axis-x"></i><i class="axis-line axis-y"></i>
          <a class="map-point dismissive" href="types.html#dismissive"><b>거부회피형</b><small>독립·거리</small></a>
          <a class="map-point fearful" href="types.html#fearful"><b>공포회피형</b><small>접근·철회</small></a>
          <a class="map-point secure" href="types.html#secure"><b>안정형</b><small>가까움·자율성</small></a>
          <a class="map-point anxious" href="types.html#anxious"><b>불안집착형</b><small>확인·연결</small></a>
          <div class="map-center"><span>불안</span><i>×</i><span>회피</span></div>
        </div>
        <a class="home-v2-map-link" href="types.html">네 가지 원형 자세히 비교하기 ${icons.arrow}</a>
      </div>`;
  }

  function addJourneyStrip() {
    const hero = $('.dashboard-welcome');
    if (!hero || $('#home-v2-journey')) return;
    const section = document.createElement('section');
    section.id = 'home-v2-journey';
    section.className = 'home-v2-journey';
    section.innerHTML = `
      <div><span>01</span><b>이해</b><p>감정과 자동 반응의 이유를 알아봅니다.</p></div>
      <i></i>
      <div><span>02</span><b>적용</b><p>상황에 맞는 대화와 행동을 선택합니다.</p></div>
      <i></i>
      <div><span>03</span><b>변화</b><p>작은 실천을 기록하며 패턴을 바꿉니다.</p></div>`;
    hero.insertAdjacentElement('afterend', section);
  }

  function findSectionByLabel(label) {
    return $$('.dashboard-section').find(section => $('.dashboard-section-head > div > span', section)?.textContent.trim() === label);
  }

  function upgradeQuickAccess() {
    const section = findSectionByLabel('QUICK ACCESS');
    if (!section) return;
    section.classList.add('home-v2-quick');
    const heading = $('h2', section);
    if (heading) heading.textContent = '지금 필요한 것부터 시작하세요';
    const cards = $$('.quick-card', section);
    const content = [
      ['내 반응 점검', '한 관계를 떠올리고 불안과 회피를 각각 확인합니다.', '약 3분', 'compass'],
      ['상대의 반응 이해', '겉으로 보이는 행동과 안쪽에서 작동하는 두려움을 구분합니다.', '4가지 원형', 'search'],
      ['우리의 반복 패턴', '두 사람의 전략이 만나 만드는 추격·철회와 갈등 흐름을 봅니다.', '16가지 조합', 'loop'],
      ['개념 바로 찾기', '안전기지, 공동조절, 과활성화처럼 낯선 용어를 빠르게 찾습니다.', '핵심 용어', 'words']
    ];
    cards.forEach((card, index) => {
      const item = content[index];
      if (!item) return;
      const icon = $('.quick-card-icon', card);
      const title = $('h3', card);
      const copy = $('p', card);
      if (icon) icon.innerHTML = icons[item[3]];
      if (title) title.textContent = item[0];
      if (copy) copy.textContent = item[1];
      let meta = $('.home-v2-card-meta', card);
      if (!meta) {
        meta = document.createElement('span');
        meta.className = 'home-v2-card-meta';
        card.appendChild(meta);
      }
      meta.textContent = item[2];
    });
  }

  function upgradeTypes() {
    const section = findSectionByLabel('FOUR PROTOTYPES');
    if (!section || $('.home-v2-axis-note', section)) return;
    section.classList.add('home-v2-types');
    const head = $('.dashboard-section-head', section);
    const note = document.createElement('p');
    note.className = 'home-v2-axis-note';
    note.innerHTML = '<b>유형은 사람의 고정된 신분증이 아닙니다.</b> 관계와 상황에 따라 반응의 강도는 달라질 수 있습니다.';
    head?.insertAdjacentElement('afterend', note);
  }

  function upgradeStartHere() {
    const section = findSectionByLabel('START HERE');
    if (!section) return;
    section.classList.add('home-v2-path');
    const heading = $('h2', section);
    if (heading) heading.textContent = '처음이라면 이 순서로 살펴보세요';
    const rows = $$('.dashboard-list a', section);
    const content = [
      ['개념', '기초를 이해하기', '애착 체계와 안전기지처럼 관계 반응을 설명하는 기본 개념'],
      ['비교', '네 원형을 비교하기', '행동만 보지 않고 그 안의 욕구와 두려움을 함께 구분'],
      ['점검', '내 패턴을 확인하기', '한 관계를 기준으로 불안과 회피를 나누어 살펴보기'],
      ['적용', '우리 관계에 적용하기', '두 사람의 전략이 만드는 반복과 회복 지점을 확인']
    ];
    rows.forEach((row, index) => {
      const item = content[index];
      if (!item) return;
      const icon = $('.dashboard-list-icon', row);
      const title = $('b', row);
      const copy = $('div > span', row);
      if (icon) icon.dataset.stage = item[0];
      if (title) title.textContent = item[1];
      if (copy) copy.textContent = item[2];
      const arrow = $('i', row);
      if (arrow) arrow.innerHTML = icons.arrow;
    });
  }

  function upgradeFeaturedGuide() {
    const cards = $$('.dashboard-feature');
    const card = cards.find(item => $('h3', item)?.textContent.includes('안정형 × 불안형'));
    if (!card) return;
    card.classList.add('home-v2-featured-guide');
    const small = $('small', card);
    if (small) small.textContent = '관계에 적용하는 읽을거리';
  }

  function upgradePurpose() {
    const section = $('#service-purpose');
    if (!section) return;
    section.classList.add('home-v2-purpose');
    const card = $('.dashboard-feature', section);
    if (!card || $('.home-v2-principles', card)) return;
    const principles = document.createElement('div');
    principles.className = 'home-v2-principles';
    principles.innerHTML = `
      <span>사람을 유형으로 단정하지 않기</span>
      <span>설명보다 실제 행동을 더 중요하게 보기</span>
      <span>상대의 경계와 결정을 존중하기</span>`;
    const details = $('.origin-story-details', card);
    (details || card.querySelector('.button'))?.insertAdjacentElement('beforebegin', principles);
  }

  function upgradeToolkit() {
    const section = $('#relationship-tools-entry');
    if (!section || section.dataset.v2Ready) return;
    section.dataset.v2Ready = 'true';
    section.classList.add('home-v2-toolkit');
    section.innerHTML = `
      <div class="dashboard-section-head">
        <div><span>RELATIONSHIP TOOLKIT</span><h2>읽고 끝내지 않고, 관계에 적용합니다</h2></div>
        <a href="#relationship-tools">10가지 도구 전체 보기 →</a>
      </div>
      <div class="toolkit-showcase">
        <article class="toolkit-primary">
          <div class="toolkit-primary-icon">${icons.words}</div>
          <p class="toolkit-kicker">가장 많이 필요한 기능</p>
          <h3>대화 문장 도우미</h3>
          <p>사과, 감정 설명, 경계 설정, 회복 제안을 압박이 적고 책임이 분명한 문장으로 정리합니다.</p>
          <a class="button button-primary" href="#relationship-tools">문장 다듬기 시작</a>
        </article>
        <div class="toolkit-list">
          <a href="#relationship-tools"><span>${icons.compass}</span><div><b>상황별 가이드</b><p>연락 감소, 침묵, 신뢰 손상 등 지금 상황부터 정리</p></div><i>${icons.arrow}</i></a>
          <a href="#relationship-tools"><span>${icons.loop}</span><div><b>갈등 패턴 지도</b><p>시작 신호부터 다음 반응까지 반복 흐름을 시각화</p></div><i>${icons.arrow}</i></a>
          <a href="#relationship-tools"><span>${icons.record}</span><div><b>변화와 실천 기록</b><p>불안·회피 변화, 솔직했던 순간, 다음 행동을 저장</p></div><i>${icons.arrow}</i></a>
          <a href="#relationship-tools"><span>${icons.shield}</span><div><b>회복과 안전 점검</b><p>말이 아니라 지켜진 행동과 경계를 체크</p></div><i>${icons.arrow}</i></a>
        </div>
      </div>`;
  }

  function addTrustSection() {
    const dashboard = $('.dashboard');
    if (!dashboard || $('#home-v2-trust-section')) return;
    const section = document.createElement('section');
    section.id = 'home-v2-trust-section';
    section.className = 'dashboard-section home-v2-trust-section';
    section.innerHTML = `
      <div class="home-v2-trust-copy">
        <span>SAFE & RESPONSIBLE</span>
        <h2>유형은 이해를 돕는 지도이지, 사람을 가두는 상자가 아닙니다.</h2>
        <p>자가점검 결과는 임상 진단이나 관계의 정답이 아닙니다. 폭력, 협박, 감시, 강제적 통제는 애착 유형으로 정당화할 수 없으며 관계 분석보다 안전을 우선해야 합니다.</p>
      </div>
      <div class="home-v2-trust-links">
        <a href="encyclopedia.html#measurement">측정과 연구 기준 보기 ${icons.arrow}</a>
        <a href="encyclopedia.html#research">참고자료 확인하기 ${icons.arrow}</a>
        <a href="feedback.html">오류와 개선 의견 보내기 ${icons.arrow}</a>
      </div>`;
    const purpose = $('#service-purpose');
    (purpose || dashboard.lastElementChild)?.insertAdjacentElement('beforebegin', section);
  }

  function addFooter() {
    const dashboard = $('.dashboard');
    if (!dashboard || $('#home-v2-footer')) return;
    const footer = document.createElement('footer');
    footer.id = 'home-v2-footer';
    footer.className = 'home-v2-footer';
    footer.innerHTML = `
      <div><b>마음의 모양</b><p>관계를 단정하지 않고, 더 정확히 이해하기 위한 열린 정보 서비스</p></div>
      <nav aria-label="하단 메뉴"><a href="types.html">유형</a><a href="pairings.html">조합</a><a href="tests.html">테스트</a><a href="glossary.html">용어</a><a href="feedback.html">의견 보내기</a></nav>
      <small>자가점검은 전문적인 심리검사나 의료·상담 서비스를 대체하지 않습니다.</small>`;
    dashboard.appendChild(footer);
  }

  function runStaticUpgrades() {
    document.documentElement.classList.add('home-v2-enabled');
    upgradeHero();
    addJourneyStrip();
    upgradeQuickAccess();
    upgradeTypes();
    upgradeStartHere();
    upgradeFeaturedGuide();
    upgradePurpose();
    addTrustSection();
    addFooter();
  }

  function runDynamicUpgrades() {
    upgradePurpose();
    upgradeToolkit();
    addTrustSection();
  }

  runStaticUpgrades();
  setTimeout(runDynamicUpgrades, 180);
  setTimeout(runDynamicUpgrades, 500);

  const dashboard = $('.dashboard');
  if (dashboard) {
    const observer = new MutationObserver(() => runDynamicUpgrades());
    observer.observe(dashboard, {childList: true, subtree: true});
    setTimeout(() => observer.disconnect(), 2500);
  }
})();
