(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const store = {
    get(k, fallback = null) {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    remove(k) { try { localStorage.removeItem(k); } catch {} }
  };

  const TYPES = {
    secure: {
      title: '안정형 경향', result: '안정형에 가까운 조합',
      copy: '친밀감과 독립성을 함께 유지하며 관계의 불확실성을 비교적 견딜 수 있는 조합입니다.',
      lead: '최근 떠올린 관계에서 연결과 개인 공간을 함께 유지하고, 관계의 불확실성에 압도되지 않는 반응이 비교적 두드러졌습니다.',
      need: '지금의 균형을 유지하되 상대의 다른 반응도 평가보다 구체적인 대화로 확인해 보세요.',
      practice: '갈등이 생겼을 때 감정, 필요, 요청을 분리해 한 문장씩 말해 보세요.'
    },
    anxious: {
      title: '불안집착형 경향', result: '불안집착형에 가까운 조합',
      copy: '관계의 거리 변화에 민감하고 연결과 확신을 적극적으로 구하는 조합입니다.',
      lead: '최근 떠올린 관계에서 상대의 반응과 거리 변화를 빠르게 감지하고, 관계가 괜찮다는 확인을 강하게 필요로 하는 모습이 나타났습니다.',
      need: '반복 확인이나 추측 대신 상대가 실행할 수 있는 구체적인 요청으로 바꿔 보세요.',
      practice: '바로 연락하기 전 사실과 해석을 나눠 적고, 한 번의 명확한 메시지를 보내 보세요.'
    },
    dismissive: {
      title: '거부회피형 경향', result: '거부회피형에 가까운 조합',
      copy: '독립을 선호하고 의존이나 감정 노출에서 거리를 두기 쉬운 조합입니다.',
      lead: '최근 떠올린 관계에서 감정적 의존이나 긴 대화를 부담스럽게 느끼고, 혼자 정리하며 통제감을 회복하려는 반응이 두드러졌습니다.',
      need: '공간이 필요한 것과 관계를 끊고 싶은 것은 다를 수 있습니다. 거리 두기에 복귀 시간을 넣어 보세요.',
      practice: '완벽히 정리한 뒤 말하려 하지 말고 “지금은 압도됐다”처럼 현재 상태를 먼저 공유해 보세요.'
    },
    fearful: {
      title: '공포회피형 경향', result: '공포회피형에 가까운 조합',
      copy: '가까워지고 싶은 마음과 상처를 피하려는 거리 두기가 함께 강해질 수 있는 조합입니다.',
      lead: '최근 떠올린 관계에서 연결에 대한 바람과 신뢰·노출에 대한 두려움이 함께 나타나 접근과 철회의 반응이 교차했을 가능성이 있습니다.',
      need: '상반된 마음을 없애려 하기보다 둘 다 존재한다고 인정하고 관계의 속도와 안전 기준을 작게 합의해 보세요.',
      practice: '감정이 크게 흔들릴 때 관계의 결론을 내리기보다 지금 필요한 것이 접촉인지 공간인지 먼저 구분해 보세요.'
    }
  };

  const QUESTIONS = [
    ['anxiety','상대의 답장이 평소보다 늦으면 관계에 문제가 생긴 건 아닌지 걱정된다.','최근 가까운 관계에서 실제로 느낀 정도를 떠올려 보세요.'],
    ['avoidance','힘든 감정을 가까운 사람에게 기대기보다 혼자 해결하는 편이 훨씬 편하다.','도움을 받을 수 있어도 스스로 처리하려는 반응을 포함합니다.'],
    ['anxiety','상대의 말투나 표현이 달라지면 마음이 식은 신호처럼 느껴질 때가 많다.','작은 변화에 마음이 얼마나 빨리 흔들리는지 살펴보세요.'],
    ['avoidance','누군가가 내 속마음을 자세히 알려고 하면 부담스럽거나 방어적이 된다.','친밀한 질문이나 감정 대화에서 느끼는 불편함을 떠올려 보세요.'],
    ['anxiety','갈등이 생기면 시간을 두기보다 지금 바로 관계가 괜찮다는 확인을 받고 싶다.','문제 해결 속도보다 안심을 얻고 싶은 마음에 가깝습니다.'],
    ['avoidance','관계가 아주 가까워질수록 내 자유나 생활이 침해될 것 같아 거리를 두고 싶어진다.','실제로 통제받는 상황이 아니라 친밀감 자체에서 느끼는 반응을 봅니다.'],
    ['anxiety','상대가 나보다 관계에 덜 진지한 것 같다는 생각을 자주 한다.','상대의 애정이나 헌신이 충분한지 반복해서 비교하는 경우입니다.'],
    ['avoidance','갈등 중 감정이 커지면 대화를 멈추고 연락이나 접촉을 줄이고 싶어진다.','진정할 시간을 갖는 것보다 관계에서 빠져나가고 싶은 느낌에 가깝습니다.'],
    ['anxiety','상대가 나를 떠날 가능성을 생각하면 감정을 조절하기 어려울 만큼 불안해진다.','실제 이별 통보가 없는 평상시의 걱정을 기준으로 답해 보세요.'],
    ['avoidance','가까운 사람에게 약한 모습이나 도움이 필요한 모습을 보이는 것이 어렵다.','취약함을 보였을 때 평가받거나 의존하게 될까 걱정하는 반응입니다.'],
    ['anxiety','관계가 불확실할 때 상대의 행동과 말을 계속 되짚어 보게 된다.','같은 장면을 반복해 생각하거나 숨은 의미를 찾는 정도입니다.'],
    ['avoidance','상대가 정서적으로 많이 의지하면 애정보다 압박감을 먼저 느끼는 편이다.','상대의 필요가 가까움보다 책임이나 부담처럼 느껴지는 경우입니다.']
  ].map(([axis,text,hint]) => ({axis,text,hint}));

  const ANSWERS = [
    [1,'전혀 그렇지 않다'], [2,'별로 그렇지 않다'], [3,'보통이다'], [4,'조금 그렇다'], [5,'매우 그렇다']
  ];

  const getType = (a, v) => a < 50 ? (v < 50 ? 'secure' : 'dismissive') : (v < 50 ? 'anxious' : 'fearful');
  const level = s => s < 34 ? '낮은 편' : s < 67 ? '중간 범위' : '높은 편';
  const setDot = (el, a, v) => { if (el) { el.style.left = `${Math.max(4, Math.min(96, v))}%`; el.style.top = `${Math.max(4, Math.min(96, 100-a))}%`; } };

  function toast(msg) {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function initTheme() {
    const btn = $('#themeToggle'); if (!btn) return;
    const sync = () => { const dark = document.documentElement.dataset.theme === 'dark'; btn.setAttribute('aria-pressed', dark); btn.setAttribute('aria-label', dark ? '밝은 화면으로 변경' : '어두운 화면으로 변경'); };
    sync();
    btn.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      if (dark) delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = 'dark';
      localStorage.setItem('soh-theme', dark ? 'light' : 'dark'); sync();
    });
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return items.forEach(x => x.classList.add('visible'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.08});
    items.forEach(x => io.observe(x));
  }

  function initAxis() {
    const a = $('#anxietyRange'), v = $('#avoidanceRange'); if (!a || !v) return;
    const update = () => {
      const av = +a.value, vv = +v.value, type = getType(av,vv);
      $('#anxietyOutput').value = av; $('#avoidanceOutput').value = vv;
      setDot($('#matrixDot'), av, vv);
      $('#axisTypeTitle').textContent = TYPES[type].title;
      $('#axisTypeCopy').textContent = TYPES[type].copy;
    };
    a.addEventListener('input', update); v.addEventListener('input', update); update();
  }

  function initCards() {
    $$('.type-summary').forEach(btn => btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      const target = document.getElementById(btn.getAttribute('aria-controls')); if (target) target.hidden = open;
    }));
    $$('.myth-list details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.myth-list details').forEach(o => { if (o !== d) o.open = false; }); }));
  }

  function initNav() {
    const links = $$('.bottom-nav a[data-nav]');
    links.forEach(l => l.addEventListener('click', () => { links.forEach(x => x.classList.remove('active')); l.classList.add('active'); }));
    const io = new IntersectionObserver(es => {
      const hit = es.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if (!hit) return;
      const l = $(`.bottom-nav a[data-nav="${hit.target.dataset.section}"]`); if (l) { links.forEach(x=>x.classList.remove('active')); l.classList.add('active'); }
    }, {rootMargin:'-20% 0px -65% 0px', threshold:[0,.2,.5]});
    $$('[data-section]').forEach(s => io.observe(s));
  }

  function initQuiz() {
    const intro=$('#quizIntro'), form=$('#quizForm'), result=$('#quizResult'), scale=$('#answerScale'); if(!intro||!form||!result||!scale) return;
    let current=0, answers=Array(QUESTIONS.length).fill(null), currentResult=null;
    const saved=store.get('soh-quiz-progress');
    if(saved?.answers?.length===QUESTIONS.length){answers=saved.answers; current=Math.max(0,Math.min(QUESTIONS.length-1,saved.current||0)); const c=answers.filter(Boolean).length; if(c) $('#startQuiz').textContent=`이어하기 · ${c}/${QUESTIONS.length}`;}

    const save=()=>store.set('soh-quiz-progress',{current,answers});
    const showIntro=()=>{form.hidden=true;result.hidden=true;intro.hidden=false;};
    const showForm=()=>{intro.hidden=true;result.hidden=true;form.hidden=false;render();};

    function render(){
      const q=QUESTIONS[current]; $('#questionText').textContent=q.text; $('#questionHint').textContent=q.hint; $('#quizCounter').textContent=`${current+1} / ${QUESTIONS.length}`;
      $('#quizProgress').style.width=`${(current+1)/QUESTIONS.length*100}%`; $('.progress-track')?.setAttribute('aria-valuenow',String(current+1));
      $('#quizBack').disabled=current===0; $('#quizBack').style.opacity=current===0?'.35':'1'; scale.innerHTML='';
      ANSWERS.forEach(([value,label])=>{
        const b=document.createElement('button'); b.type='button'; b.className=`answer-option${answers[current]===value?' selected':''}`; b.setAttribute('aria-pressed',answers[current]===value);
        b.innerHTML=`<span class="radio" aria-hidden="true"></span><span>${label}</span><span class="answer-number">${value}</span>`;
        b.addEventListener('click',()=>{answers[current]=value; save(); $$('.answer-option',scale).forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); setTimeout(()=>{if(current<QUESTIONS.length-1){current++;save();render();}else finish();},160);}); scale.appendChild(b);
      });
    }

    function finish(){
      const anxiety=QUESTIONS.map((q,i)=>q.axis==='anxiety'?answers[i]:null).filter(Boolean);
      const avoidance=QUESTIONS.map((q,i)=>q.axis==='avoidance'?answers[i]:null).filter(Boolean);
      const score=arr=>Math.round(((arr.reduce((s,n)=>s+n,0)/arr.length)-1)/4*100);
      const a=score(anxiety), v=score(avoidance), type=getType(a,v), data=TYPES[type]; currentResult={a,v,type};
      store.set('soh-quiz-result',{...currentResult,date:new Date().toISOString()}); store.remove('soh-quiz-progress');
      form.hidden=true; intro.hidden=true; result.hidden=false;
      $('#resultTitle').textContent=data.result; $('#resultLead').textContent=data.lead; $('#resultAnxiety').textContent=a; $('#resultAvoidance').textContent=v;
      $('#resultAnxietyText').textContent=level(a); $('#resultAvoidanceText').textContent=level(v); setDot($('#resultDot'),a,v);
      $('#resultInsights').innerHTML=`<article class="insight-card"><b>지금 필요할 수 있는 것</b><p>${data.need}</p></article><article class="insight-card"><b>오늘 해볼 작은 연습</b><p>${data.practice}</p></article>`;
      result.scrollIntoView({behavior:'smooth',block:'start'});
    }

    $('#startQuiz').addEventListener('click',showForm);
    $('#quizBack').addEventListener('click',()=>{if(current>0){current--;save();render();}});
    $('#quitQuiz').addEventListener('click',showIntro);
    $('#restartQuiz').addEventListener('click',()=>{current=0;answers=Array(QUESTIONS.length).fill(null);currentResult=null;store.remove('soh-quiz-progress');showForm();});
    $('#shareResult').addEventListener('click',async()=>{
      if(!currentResult) return;
      const data=TYPES[currentResult.type], text=`마음의 모양 자기점검 결과: ${data.result}\n애착 불안 ${currentResult.a}/100 · 애착 회피 ${currentResult.v}/100\n※ 교육용 자기점검이며 진단이 아닙니다.`;
      try{ if(navigator.share){await navigator.share({title:'마음의 모양',text,url:location.href});}else{await navigator.clipboard.writeText(`${text}\n${location.href}`); toast('결과가 클립보드에 복사되었습니다.');} }catch(e){ if(e.name!=='AbortError') toast('공유하지 못했습니다. 다시 시도해 주세요.'); }
    });
  }

  function initMisc(){
    $('#currentYear').textContent=new Date().getFullYear();
    const bar=$('[data-elevate]'); const scroll=()=>bar?.classList.toggle('elevated',scrollY>8); addEventListener('scroll',scroll,{passive:true}); scroll();
    if('serviceWorker' in navigator) addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  initTheme(); initReveal(); initAxis(); initCards(); initNav(); initQuiz(); initMisc();
})();