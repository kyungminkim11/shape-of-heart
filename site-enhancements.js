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
    if(story){
      story.querySelector('h3').textContent='같은 잘못을 반복하지 않기 위해 시작했습니다';
      const first=story.querySelector('p');if(first)first.textContent='소중한 사람의 불안과 상처를 충분히 이해하지 못한 채, 미안하다는 말과 같은 약속만 반복했던 제 행동을 돌아보는 것이 이 프로젝트의 출발점입니다.';
      let details=$('.origin-story-details',story);
      if(!details){details=document.createElement('details');details.className='origin-story-details';story.appendChild(details);}
      details.innerHTML='<summary>이야기 더 읽기</summary><div><p>상대방이 여러 번 불안함과 힘든 마음을 이야기했는데도 저는 그 말을 충분히 이해하지 못했습니다. 상대를 위한다고 생각하며 말을 숨기거나 솔직하게 이야기하지 않았던 행동도 결국 신뢰를 무너뜨리고 불안을 더 크게 만드는 행동이었다는 것을 뒤늦게 깨달았습니다.</p><p>애착 유형을 공부하기 시작한 것은 상대방을 특정한 유형으로 단정하거나 관계에서 일어난 일을 유형의 탓으로 돌리기 위해서가 아닙니다. 상대방이 어떤 마음으로 힘들어했는지, 저는 왜 같은 행동을 반복했는지, 앞으로 누군가를 사랑할 때 어떤 태도와 소통이 필요한지를 제대로 이해하고 싶었습니다.</p><p>이 사이트를 만들었다는 사실만으로 제가 달라졌다고 생각하지 않습니다. 공부하고 정리하는 것은 변화의 시작일 뿐이고, 진짜 변화는 말을 숨기지 않는 것, 불편한 상황에서도 솔직하게 이야기하는 것, 상대방의 감정을 제 기준으로 판단하지 않는 것, 약속한 일을 실제 행동으로 지키는 것으로 증명해야 한다고 생각합니다.</p><p>이 기록은 누군가에게 다시 기회를 달라고 요구하거나 결정을 바꾸게 하기 위한 수단이 아닙니다. 상대방의 마음과 결정을 존중하고, 제가 공부하고 달라지기 위해 노력하는 일은 제가 스스로 선택하고 책임져야 할 몫입니다.</p><p>제가 무엇을 잘못했는지 잊지 않고 같은 방식으로 다시는 소중한 사람에게 상처를 주지 않기 위해 이 공간을 만들었습니다. 이곳이 관계를 단정하는 답안지가 아니라 자신의 마음과 행동을 천천히 돌아볼 수 있는 작은 안내서가 되었으면 합니다.</p></div>';
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