(() => {
  'use strict';

  const DOMAIN = 'https://shape-of-heart.lavalabs.co.kr';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const page = location.pathname.split('/').pop() || 'index.html';
  const TYPE_NAMES = {secure:'안정형',anxious:'불안집착형',dismissive:'거부회피형',fearful:'공포회피형'};
  const PAGE_INFO = {
    'types.html':['유형별 특징','네 가지 애착 원형의 내면과 관계 반응'],
    'pairings.html':['16가지 관계 조합','두 사람의 애착 전략이 만나는 방식'],
    'glossary.html':['애착 용어 사전','애착과 관계의 핵심 개념'],
    'encyclopedia.html':['애착 백과사전','이론·연구·관계 기술을 깊이 읽기'],
    'tests.html':['유형 테스트','불안과 회피를 살펴보는 자기점검'],
    'feedback.html':['의견 보내기','열린 서비스에 개선 의견 남기기'],
    'history.html':['나의 변화 기록','저장된 테스트 결과 비교']
  };

  function injectStyles(){
    ['readability.css','personalization.css'].forEach(href => {
      if ($(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = href; document.head.appendChild(link);
    });
  }

  function ensureMeta(){
    const canonicalUrl = `${DOMAIN}${location.pathname}${location.search}`;
    let canonical = $('link[rel="canonical"]');
    if (!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}
    canonical.href = canonicalUrl;
    let og = $('meta[property="og:url"]');
    if (!og){og=document.createElement('meta');og.setAttribute('property','og:url');document.head.appendChild(og);}
    og.content = canonicalUrl;
    if (!$('meta[name="twitter:card"]')){
      const meta=document.createElement('meta');meta.name='twitter:card';meta.content='summary_large_image';document.head.appendChild(meta);
    }
    if (!$('script[data-site-schema]')){
      const schema=document.createElement('script');schema.type='application/ld+json';schema.dataset.siteSchema='true';
      schema.textContent=JSON.stringify({
        '@context':'https://schema.org','@type':page==='index.html'?'WebSite':'WebPage',
        name:document.title,url:canonicalUrl,inLanguage:'ko-KR',
        isPartOf:{'@type':'WebSite',name:'마음의 모양',url:`${DOMAIN}/`}
      });
      document.head.appendChild(schema);
    }
  }

  const NAV_ITEMS = [
    ['./','⌂','홈','index.html'],['types.html','♡','유형','types.html'],['tests.html','✓','테스트','tests.html'],
    ['pairings.html','∞','조합','pairings.html'],['encyclopedia.html','▤','백과','encyclopedia.html']
  ];

  function ensureNavigation(){
    if (!$('.site-bottom-nav') && !$('.enhanced-bottom-nav')){
      const nav=document.createElement('nav');nav.className='enhanced-bottom-nav';nav.setAttribute('aria-label','모바일 주요 메뉴');
      nav.innerHTML=NAV_ITEMS.map(([href,icon,label,key])=>`<a href="${href}" class="${page===key?'active':''}"><span>${icon}</span><span>${label}</span></a>`).join('');
      document.body.appendChild(nav);document.body.classList.add('has-global-nav');
    }
    if (!$('.site-desktop-nav') && !$('.global-desktop-nav')){
      const header=$('.topbar')||$('.site-header');
      if(header){const nav=document.createElement('nav');nav.className='global-desktop-nav';nav.innerHTML=NAV_ITEMS.map(([href,,label,key])=>`<a href="${href}" class="${page===key?'active':''}">${label}</a>`).join('');header.insertBefore(nav,header.lastElementChild);}
    }
    $$('.site-desktop-nav a,.site-bottom-nav a').forEach(a=>{
      const target=a.getAttribute('href')?.split('?')[0].split('#')[0]||'';
      const active=(page==='index.html'&&(target==='./'||target==='index.html'))||target===page;
      a.classList.toggle('active',active);
    });
  }

  function saved(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(_){return fallback}}
  function put(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}}

  function recordReading(){
    if(!PAGE_INFO[page]||['tests.html','feedback.html','history.html'].includes(page)) return;
    const [title,desc]=PAGE_INFO[page];
    const item={title,desc,url:`${page}${location.hash||''}`,date:new Date().toISOString()};
    const list=saved('soh-recent-pages').filter(x=>x.url!==item.url);list.unshift(item);put('soh-recent-pages',list.slice(0,8));
  }

  function addBookmark(){
    if(!PAGE_INFO[page]||['tests.html','feedback.html','history.html'].includes(page)) return;
    const host=$('.content-hero')||$('.encyclopedia-hero')||$('.page-hero');if(!host||$('.page-bookmark-button')) return;
    const [title,desc]=PAGE_INFO[page];const url=`${page}${location.hash||''}`;
    const button=document.createElement('button');button.type='button';button.className='page-bookmark-button';
    const sync=()=>{const active=saved('soh-bookmarks').some(x=>x.url===url);button.classList.toggle('active',active);button.textContent=active?'★ 저장됨':'☆ 이 글 저장';};
    button.addEventListener('click',()=>{let list=saved('soh-bookmarks');if(list.some(x=>x.url===url))list=list.filter(x=>x.url!==url);else list.unshift({title,desc,url,date:new Date().toISOString()});put('soh-bookmarks',list.slice(0,20));sync();});
    host.appendChild(button);sync();
  }

  function typeLink(type){return `types.html#${type||'secure'}`}
  function pairingLink(type){return `pairings.html?me=${type||'secure'}&partner=anxious`}

  function renderHomePersonal(){
    const dashboard=$('.dashboard');if(!dashboard||$('#personal-dashboard-section')) return;
    const latest=saved('soh-last-test-result',null);const bookmarks=saved('soh-bookmarks');const recent=saved('soh-recent-pages');
    const section=document.createElement('section');section.className='dashboard-section';section.id='personal-dashboard-section';
    const resultHtml=latest?`<article class="recent-result-card"><span class="personal-card-label">MY LATEST RESULT</span><h2 class="personal-card-title">${TYPE_NAMES[latest.type]||'최근'} 원형에 가까운 반응</h2><p class="personal-card-copy">${latest.context||'관계'} 기준 · ${latest.mode==='deep'?'복잡형':'단순형'} 자기점검</p><div class="result-mini-scores"><div class="result-mini-score"><div><span>애착 불안</span><b>${latest.anxiety}</b></div><div class="result-mini-bar"><i style="width:${latest.anxiety}%"></i></div></div><div class="result-mini-score"><div><span>애착 회피</span><b>${latest.avoidance}</b></div><div class="result-mini-bar"><i style="width:${latest.avoidance}%"></i></div></div></div><div class="personal-actions"><a class="button button-primary" href="${typeLink(latest.type)}">내 유형 자세히</a><a class="button button-ghost" href="history.html">변화 기록 보기</a></div></article>`:`<article class="recent-result-card"><span class="personal-card-label">MY RESULT</span><h2 class="personal-card-title">아직 저장된 결과가 없어요</h2><p class="personal-card-copy">한 관계를 떠올리고 단순형 또는 복잡형 테스트를 완료하면 최근 결과와 변화 기록이 여기에 나타납니다.</p><div class="personal-actions"><a class="button button-primary" href="tests.html">테스트 시작하기</a><a class="button button-ghost" href="pairings.html?me=secure&partner=anxious">예시 조합 보기</a></div></article>`;
    const listHtml=(items,empty)=>items.length?`<div class="saved-list">${items.slice(0,4).map(x=>`<a href="${x.url}"><div><b>${x.title}</b><span>${x.desc||''}</span></div><i>→</i></a>`).join('')}</div>`:`<div class="empty-personal">${empty}</div>`;
    section.innerHTML=`<div class="dashboard-section-head"><div><span>MY SPACE</span><h2>내 기록과 저장함</h2></div></div><div class="personal-dashboard">${resultHtml}<article class="saved-content-card"><div class="saved-columns"><div class="saved-column"><h3>저장한 글</h3>${listHtml(bookmarks,'유형·조합·백과사전에서 별표 버튼을 눌러 저장해 보세요.')}</div><div class="saved-column"><h3>최근 읽은 글</h3>${listHtml(recent,'콘텐츠를 읽으면 최근 기록이 표시됩니다.')}</div></div></article></div>`;
    const welcome=$('.dashboard-welcome');(welcome?.nextElementSibling||welcome)?.insertAdjacentElement('afterend',section);
  }

  function enhanceOriginAndExample(){
    const story=$('#service-purpose .dashboard-feature');
    if(story&&!$('.origin-story-details',story)){
      story.querySelector('h3').textContent='연인의 마음을 더 잘 이해하고 싶어서 시작했습니다';
      const first=story.querySelector('p');if(first)first.textContent='연애에 서툴러 상대의 마음을 충분히 알아차리지 못하고 실망을 주거나, 서로 다른 방식으로 감정을 표현하다 다툰 경험이 이 프로젝트의 출발점이 됐습니다.';
      const details=document.createElement('details');details.className='origin-story-details';details.innerHTML='<summary>이야기 더 읽기</summary><div><p>누가 맞고 틀린지를 가르는 것보다 왜 같은 상황을 서로 다르게 느끼고 반응하는지 알고 싶었습니다. 그래서 연인의 유형과 제 반응을 이해하기 위해 애착 이론과 관계 패턴을 공부하기 시작했습니다.</p><p>그 공부를 혼자만의 메모로 남기지 않고 비슷한 고민을 하는 사람도 쉽게 살펴볼 수 있도록 만든 것이 마음의 모양입니다. 누군가를 낙인찍기보다 서로의 마음을 이해하고, 모두가 건강하고 행복한 연애를 만드는 데 도움이 되기를 바랍니다.</p><p><strong>마음의 모양은 열린 서비스입니다.</strong> 내용, 테스트, 기능과 디자인에 관한 의견을 받으며 계속 개선합니다.</p></div>';
      story.appendChild(details);
    }
    $$('.dashboard-feature').forEach(card=>{const h=card.querySelector('h3');if(h?.textContent.includes('불안형과 회피형')){h.textContent='안정형 × 불안형은 어떻게 서로를 도울 수 있을까요?';const p=card.querySelector('p');if(p)p.textContent='안정형의 일관된 반응은 불안형에게 새로운 안전 경험이 될 수 있습니다. 다만 한쪽이 계속 달래는 역할을 맡기보다, 따뜻한 안심과 명확한 경계를 함께 사용하고 불안형도 자기조절을 키우는 것이 중요합니다.';const a=card.querySelector('a');if(a){a.href='pairings.html?me=secure&partner=anxious';a.textContent='안정형 × 불안형 예시 보기';}}});
  }

  async function enhanceFeedback(){
    if(page!=='feedback.html'||$('#email-feedback-channel')) return;
    const container=$('.content-wrap');if(!container)return;
    let email='';try{const response=await fetch('contact.json');email=(await response.json()).feedbackEmail||'';}catch(_){return}
    const subject='[마음의 모양 의견] 의견 종류를 적어 주세요';
    const body='의견 종류:\n관련 페이지 또는 기능:\n자세한 의견:\n참고 자료:\n';
    const section=document.createElement('section');section.className='section-block';section.id='email-feedback-channel';
    section.innerHTML=`<div class="section-block-head"><span>CHOOSE A CHANNEL</span><h2>편한 방법으로 보내 주세요</h2><p>개인적으로 전달하고 싶은 내용은 이메일로, 공개적으로 함께 논의할 내용은 GitHub로 보내 주세요.</p></div><div class="feedback-channel-grid"><article class="feedback-channel"><span class="feedback-channel-icon">✉</span><h3>이메일로 보내기</h3><p>메일 앱이 열리며 의견 작성에 필요한 기본 항목이 자동으로 입력됩니다.</p><a class="button button-primary" href="mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">메일 앱 열기</a><p class="feedback-email-address">${email}</p></article><article class="feedback-channel"><span class="feedback-channel-icon">↗</span><h3>GitHub에서 남기기</h3><p>오류 제보, 기능 요청과 공개적인 개선 논의를 기록할 수 있습니다.</p><a class="button button-ghost" href="https://github.com/kyungminkim11/shape-of-heart/issues/new/choose" target="_blank" rel="noopener noreferrer">공개 의견 작성하기</a></article></div>`;
    const publicSection=$$('.section-block',container).find(s=>s.textContent.includes('GitHub 저장소'));
    container.insertBefore(section,publicSection||$('.precision-note',container)||null);
  }

  function init(){injectStyles();ensureMeta();ensureNavigation();recordReading();addBookmark();setTimeout(()=>{renderHomePersonal();enhanceOriginAndExample();enhanceFeedback();},80);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();