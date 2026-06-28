(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const TYPE_TEXT = {
    secure: {
      name: '안정형',
      intro: '최근 떠올린 관계에서 연결과 개인 공간을 비교적 함께 유지하는 반응이 나타났습니다.',
      inner: '관계가 흔들리는 순간에도 상대의 반응을 곧바로 거절이나 통제로 해석하지 않는 편일 수 있습니다.',
      behavior: '필요를 직접 말하고, 휴식이 필요할 때 복귀 시점을 정하며, 갈등 이후 관계 복구를 시도할 가능성이 큽니다.',
      strength: '친밀감과 자율성의 균형, 도움 요청, 현실적인 경계와 관계 복구 능력이 강점이 될 수 있습니다.',
      risk: '안정적인 반응도 실제 관계의 반복적인 무시나 신뢰 훼손을 견뎌야 한다는 뜻은 아닙니다.',
      practice: '최근 갈등 하나를 골라 사실·감정·필요·요청을 한 문장씩 나눠 적어 보세요.'
    },
    anxious: {
      name: '불안집착형',
      intro: '최근 떠올린 관계에서 거리 변화와 거절 가능성에 민감하고 확신을 적극적으로 구하는 반응이 나타났습니다.',
      inner: '상대가 중요할수록 내가 충분히 사랑받는지, 관계가 유지될지에 대한 걱정이 빠르게 커질 수 있습니다.',
      behavior: '답장, 말투, 애정 표현을 반복 확인하거나 문제를 즉시 해결하려는 행동이 나타날 수 있습니다.',
      strength: '관계 신호에 대한 민감성, 깊은 정서적 관여, 화해와 연결을 위한 적극성이 강점이 될 수 있습니다.',
      risk: '느낌을 사실로 확정하거나 반복 확인·감시·이별 시험으로 불안을 해결하려 하면 악순환이 커질 수 있습니다.',
      practice: '연락하기 전 “관찰된 사실”과 “내가 예상한 결론”을 나누고, 한 번의 구체적인 요청만 보내 보세요.'
    },
    dismissive: {
      name: '거부회피형',
      intro: '최근 떠올린 관계에서 의존과 감정 노출을 부담스럽게 느끼고 혼자 정리하려는 반응이 나타났습니다.',
      inner: '누군가에게 기대면 통제되거나 실망할 수 있다는 예상 때문에 자기충족을 더 안전하게 느낄 수 있습니다.',
      behavior: '갈등에서 감정을 축소하고 대화를 미루거나 연락과 정서적 참여를 줄이는 행동이 나타날 수 있습니다.',
      strength: '독립적인 문제 해결, 위기에서 기능 유지, 개인 경계와 자율성 보존이 강점이 될 수 있습니다.',
      risk: '설명 없는 철회와 잠수는 상대의 불안을 크게 만들고 관계에 필요한 정보를 차단할 수 있습니다.',
      practice: '공간이 필요할 때 이유·시간·복귀 시점을 포함한 한 문장을 먼저 전해 보세요.'
    },
    fearful: {
      name: '공포회피형',
      intro: '최근 떠올린 관계에서 연결을 원하는 마음과 가까워지는 일을 두려워하는 마음이 함께 나타났습니다.',
      inner: '사랑받고 싶지만 상처받거나 통제될 가능성도 크게 느껴져 안전 신호와 위협 신호가 뒤섞일 수 있습니다.',
      behavior: '붙잡기와 밀어내기, 강한 표현과 차단, 재접촉과 철회가 교대로 나타날 수 있습니다.',
      strength: '복잡한 감정과 위험 신호를 섬세하게 감지하고, 안전할 때 깊은 공감과 연결을 만들 수 있습니다.',
      risk: '감정이 큰 순간 관계의 결론을 내리거나 상대를 시험하고 차단하면 예측 가능성이 크게 낮아질 수 있습니다.',
      practice: '다가가고 싶은 마음과 피하고 싶은 마음을 각각 한 문장으로 적고, 오늘은 관계 결론을 미뤄 보세요.'
    }
  };

  const facetMeta = {
    abandonment: ['버림받음 민감성','거절과 이별 가능성을 얼마나 빠르게 예상하는지'],
    reassurance: ['확인·안심 추구','관계가 안전하다는 외부 확인을 얼마나 필요로 하는지'],
    vigilance: ['관계 신호 과탐지','말투·연락·표정의 작은 변화를 얼마나 위협으로 읽는지'],
    dependence: ['의존 불편감','도움을 주고받거나 기대는 일을 얼마나 불편해하는지'],
    vulnerability: ['취약성 노출 불편감','두려움과 필요를 드러내는 일을 얼마나 위험하게 느끼는지'],
    distancing: ['거리 두기 전략','갈등과 압박에서 접촉과 정서 참여를 얼마나 줄이는지']
  };

  const axisOf = facet => ['abandonment','reassurance','vigilance'].includes(facet) ? 'anxiety' : 'avoidance';
  const q = (facet, text, reverse = false, hint = '') => ({facet, axis:axisOf(facet), text, reverse, hint});

  const quickQuestions = [
    q('abandonment','상대의 답장이 평소보다 늦으면 관계에 문제가 생긴 건 아닌지 걱정된다.'),
    q('dependence','힘든 일이 있어도 가까운 사람에게 기대기보다 혼자 해결하는 편이 훨씬 편하다.'),
    q('vigilance','상대의 말투나 표현이 달라지면 마음이 식은 신호처럼 느껴진다.'),
    q('vulnerability','누군가가 내 속마음을 자세히 알려고 하면 부담스럽거나 방어적이 된다.'),
    q('reassurance','갈등이 생기면 시간을 두기보다 지금 바로 관계가 괜찮다는 확인을 받고 싶다.'),
    q('distancing','감정이 커지면 대화를 멈추고 연락이나 접촉을 줄이고 싶어진다.'),
    q('abandonment','상대가 혼자 있고 싶다고 해도 관계가 끝나는 것으로 느끼지는 않는다.',true),
    q('dependence','필요할 때 가까운 사람에게 도움을 요청하는 것이 자연스럽다.',true),
    q('reassurance','상대가 바쁘다고 알려주면 추가 확인 없이 기다릴 수 있다.',true),
    q('vulnerability','두려움이나 서운함을 말해도 안전하다고 느낀다.',true),
    q('vigilance','상대의 작은 변화가 있어도 여러 가능성을 생각할 수 있다.',true),
    q('distancing','잠시 쉬어야 할 때 언제 돌아올지 상대에게 알리는 편이다.',true)
  ];

  const deepQuestions = [
    ...quickQuestions,
    q('abandonment','가까운 사람이 나보다 관계에 덜 진지할 것이라는 걱정을 자주 한다.'),
    q('dependence','상대가 나에게 정서적으로 많이 의지하면 애정보다 부담이 먼저 커진다.'),
    q('reassurance','관계가 괜찮다는 말을 들어도 얼마 지나지 않아 다시 확인하고 싶어진다.'),
    q('vulnerability','약한 모습을 보이면 상대가 나를 낮게 볼 것 같다.'),
    q('vigilance','과거 대화와 메시지를 반복해서 되짚으며 숨은 의미를 찾는다.'),
    q('distancing','갈등이 생기면 문제를 해결하기보다 관계에서 빠져나가고 싶은 마음이 커진다.'),
    q('abandonment','상대가 내 곁에 있다는 믿음은 다툰 뒤에도 어느 정도 유지된다.',true),
    q('dependence','도움을 받는 것이 내 독립성을 잃는 일처럼 느껴지지 않는다.',true),
    q('reassurance','불안해도 같은 질문을 반복하지 않고 한 번의 요청으로 표현할 수 있다.',true),
    q('vulnerability','감정을 정확히 설명하지 못해도 현재 상태를 알려줄 수 있다.',true),
    q('vigilance','모호한 신호를 바로 부정적인 결론으로 확정하지 않는다.',true),
    q('distancing','불편한 대화라도 관계에 중요하다면 다시 돌아가 참여할 수 있다.',true),
    q('abandonment','상대의 애정 표현이 줄면 내가 버려질 가능성을 크게 상상한다.'),
    q('dependence','누군가에게 기대기 시작하면 자유를 잃을 것 같은 느낌이 든다.'),
    q('reassurance','상대가 나를 얼마나 좋아하는지 확인하는 질문을 반복하고 싶어진다.'),
    q('vulnerability','내 필요를 말하는 것보다 아무렇지 않은 척하는 편이 안전하다.'),
    q('vigilance','상대의 표정이나 목소리 변화에 즉시 긴장한다.'),
    q('distancing','상대가 감정 대화를 원하면 다른 일에 몰두하거나 주제를 바꾸고 싶어진다.'),
    q('abandonment','잠시 떨어져 있어도 관계가 유지된다는 느낌을 가질 수 있다.',true),
    q('dependence','서로 의지하는 것과 각자의 삶을 유지하는 것이 함께 가능하다고 느낀다.',true),
    q('reassurance','안심을 요청한 뒤에는 스스로 감정을 진정시키는 행동도 할 수 있다.',true),
    q('vulnerability','상대의 반응을 통제하지 못해도 내 감정과 경계를 말할 수 있다.',true),
    q('vigilance','내가 불안할 때 떠올린 해석이 사실과 다를 수 있음을 인정한다.',true),
    q('distancing','공간을 요청하더라도 관계를 끊는 방식으로 사용하지 않는다.',true)
  ];

  const scales = [[1,'전혀 그렇지 않다'],[2,'별로 그렇지 않다'],[3,'보통이다'],[4,'조금 그렇다'],[5,'매우 그렇다']];

  const contextButtons = $$('.context-options button');
  const choice = $('#testChoice');
  const contextCard = $('#contextCard');
  const notice = $('.test-notice');
  const runner = $('#testRunner');
  const result = $('#testResult');
  let context = '현재 연인';
  let mode = null;
  let questions = [];
  let answers = [];
  let index = 0;
  let lastResult = null;

  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function saveProgress() {
    try { localStorage.setItem('soh-test-progress', JSON.stringify({context,mode,answers,index})); } catch (_) {}
  }

  function clearProgress() {
    try { localStorage.removeItem('soh-test-progress'); } catch (_) {}
  }

  function setScreen(screen) {
    const choosing = screen === 'choice';
    contextCard.hidden = !choosing;
    choice.hidden = !choosing;
    notice.hidden = !choosing;
    runner.hidden = screen !== 'runner';
    result.hidden = screen !== 'result';
  }

  function start(selectedMode, useSaved = false) {
    mode = selectedMode;
    questions = mode === 'quick' ? quickQuestions : deepQuestions;
    if (!useSaved) {
      answers = Array(questions.length).fill(null);
      index = 0;
    }
    $('#modeName').textContent = mode === 'quick' ? '단순형' : '복잡형';
    $('.runner-progress').setAttribute('aria-valuemax', String(questions.length));
    $('#contextReminder').textContent = context;
    setScreen('runner');
    renderQuestion();
    runner.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderQuestion() {
    const question = questions[index];
    $('#runnerCounter').textContent = `${index + 1} / ${questions.length}`;
    $('.runner-progress').setAttribute('aria-valuenow', String(index + 1));
    $('#runnerProgress').style.width = `${(index + 1) / questions.length * 100}%`;
    $('#facetLabel').textContent = mode === 'deep' ? facetMeta[question.facet][0] : '관계 반응';
    $('#runnerQuestion').textContent = question.text;
    $('#runnerHint').textContent = question.hint || '최근 몇 달간 떠올린 관계에서 실제로 자주 나타난 반응을 기준으로 답해 주세요.';
    const scale = $('#runnerScale');
    scale.innerHTML = scales.map(([value,label]) => `<button class="scale-option${answers[index] === value ? ' selected' : ''}" type="button" data-value="${value}" aria-pressed="${answers[index] === value}"><i aria-hidden="true"></i><span>${label}</span><b>${value}</b></button>`).join('');
    $$('.scale-option', scale).forEach(button => button.addEventListener('click', () => {
      answers[index] = Number(button.dataset.value);
      saveProgress();
      $$('.scale-option', scale).forEach(item => { item.classList.remove('selected'); item.setAttribute('aria-pressed','false'); });
      button.classList.add('selected');
      button.setAttribute('aria-pressed','true');
      $('#nextQuestion').disabled = false;
      if (index < questions.length - 1) setTimeout(() => { index += 1; saveProgress(); renderQuestion(); }, 150);
      else setTimeout(finish, 150);
    }));
    $('#prevQuestion').disabled = index === 0;
    $('#nextQuestion').disabled = answers[index] == null;
    $('#nextQuestion').textContent = index === questions.length - 1 ? '결과 보기' : '다음';
  }

  function normalized(items) {
    const values = items.map(({q,a}) => q.reverse ? 6 - a : a);
    const average = values.reduce((sum,value) => sum + value, 0) / values.length;
    return Math.round((average - 1) / 4 * 100);
  }

  function classify(anxiety, avoidance) {
    return anxiety < 50 ? (avoidance < 50 ? 'secure' : 'dismissive') : (avoidance < 50 ? 'anxious' : 'fearful');
  }

  function axisText(score, axis) {
    const level = score < 34 ? '낮은 편' : score < 67 ? '중간 범위' : '높은 편';
    if (axis === 'anxiety') return `${level}입니다. ${score < 34 ? '거리 변화가 생겨도 관계 전체를 즉시 의심하는 반응은 비교적 적을 수 있습니다.' : score < 67 ? '상황에 따라 확인 욕구가 커지며 관계의 실제 안정성에 영향을 받을 수 있습니다.' : '거절과 버림 신호에 민감하고 확답과 접촉을 강하게 필요로 할 수 있습니다.'}`;
    return `${level}입니다. ${score < 34 ? '도움을 주고받고 친밀감을 받아들이는 데 비교적 편안할 수 있습니다.' : score < 67 ? '상황에 따라 가까움과 독립 사이에서 불편함이 커질 수 있습니다.' : '의존과 취약성 노출을 부담스럽게 느끼고 거리 두기로 조절할 수 있습니다.'}`;
  }

  function clarity(facetScores) {
    const distances = Object.values(facetScores).map(value => Math.abs(value - 50));
    const average = distances.reduce((sum,value) => sum + value, 0) / distances.length;
    if (average >= 28) return ['선명한 편','세부 영역이 중간선에서 비교적 멀어 현재 관계에서 반복되는 방향이 뚜렷하게 나타났습니다.'];
    if (average >= 15) return ['보통','일부 영역은 방향이 보이지만 상황과 관계에 따라 반응이 달라질 가능성이 있습니다.'];
    return ['혼합형','많은 영역이 중간 범위에 있어 하나의 원형보다 상황별 차이를 살펴보는 편이 유용합니다.'];
  }

  function finish() {
    const answered = questions.map((question,i) => ({q:question,a:answers[i]}));
    if (answered.some(item => item.a == null)) return;
    const anxiety = normalized(answered.filter(item => item.q.axis === 'anxiety'));
    const avoidance = normalized(answered.filter(item => item.q.axis === 'avoidance'));
    const type = classify(anxiety, avoidance);
    const typeText = TYPE_TEXT[type];
    const facetScores = {};
    Object.keys(facetMeta).forEach(facet => {
      const subset = answered.filter(item => item.q.facet === facet);
      if (subset.length) facetScores[facet] = normalized(subset);
    });
    lastResult = {mode,context,anxiety,avoidance,type,facetScores,date:new Date().toISOString()};
    try { localStorage.setItem('soh-last-test-result', JSON.stringify(lastResult)); } catch (_) {}
    clearProgress();

    $('#resultModeBadge').textContent = `${mode === 'quick' ? '단순형' : '복잡형'} 결과 · ${context}`;
    $('#testResultTitle').textContent = `${typeText.name} 원형에 가까운 반응`;
    $('#testResultIntro').textContent = typeText.intro;
    $('#anxietyScore').textContent = anxiety;
    $('#avoidanceScore').textContent = avoidance;
    $('#anxietyBar').style.width = `${anxiety}%`;
    $('#avoidanceBar').style.width = `${avoidance}%`;
    $('#anxietyInterpretation').textContent = axisText(anxiety,'anxiety');
    $('#avoidanceInterpretation').textContent = axisText(avoidance,'avoidance');
    const dot = $('#testResultDot');
    dot.style.left = `${Math.max(4,Math.min(96,avoidance))}%`;
    dot.style.top = `${Math.max(4,Math.min(96,100-anxiety))}%`;

    $('#innerPattern').textContent = typeText.inner;
    $('#behaviorPattern').textContent = typeText.behavior;
    $('#strengthPattern').textContent = typeText.strength;
    $('#riskPattern').textContent = typeText.risk;
    $('#practicePattern').textContent = typeText.practice;

    const facetSection = $('#facetResults');
    if (mode === 'deep') {
      facetSection.hidden = false;
      $('#facetGrid').innerHTML = Object.entries(facetScores).map(([facet,score]) => `<article class="facet-card"><div><span>${facetMeta[facet][0]}</span><b>${score}</b></div><div class="facet-bar"><i style="width:${score}%"></i></div><p>${facetMeta[facet][1]}</p></article>`).join('');
      const [label,text] = clarity(facetScores);
      $('#clarityValue').textContent = label;
      $('#clarityText').textContent = text + ' 이 값은 검사 신뢰도가 아니라 결과를 읽기 위한 설명용 지표입니다.';
    } else {
      facetSection.hidden = true;
    }

    $('#resultDate').textContent = `${new Intl.DateTimeFormat('ko-KR',{dateStyle:'long',timeStyle:'short'}).format(new Date())} · 결과는 이 기기에만 저장됩니다.`;
    setScreen('result');
    result.scrollIntoView({behavior:'smooth',block:'start'});
  }

  contextButtons.forEach(button => button.addEventListener('click', () => {
    context = button.dataset.context;
    contextButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

  $$('[data-start]').forEach(button => button.addEventListener('click', () => start(button.dataset.start)));
  $('#prevQuestion').addEventListener('click', () => { if (index > 0) { index -= 1; saveProgress(); renderQuestion(); } });
  $('#nextQuestion').addEventListener('click', () => {
    if (answers[index] == null) return;
    if (index < questions.length - 1) { index += 1; saveProgress(); renderQuestion(); } else finish();
  });
  $('#exitTest').addEventListener('click', () => { saveProgress(); setScreen('choice'); });
  $('#saveExit').addEventListener('click', () => { saveProgress(); toast('진행 상황을 이 기기에 저장했습니다.'); setScreen('choice'); });
  $('#retrySame').addEventListener('click', () => start(mode));
  $('#chooseOther').addEventListener('click', () => setScreen('choice'));
  $('#shareTestResult').addEventListener('click', async () => {
    if (!lastResult) return;
    const text = `마음의 모양 ${lastResult.mode === 'quick' ? '단순형' : '복잡형'} 자기점검 결과\n${TYPE_TEXT[lastResult.type].name} 원형에 가까운 반응\n애착 불안 ${lastResult.anxiety}/100 · 애착 회피 ${lastResult.avoidance}/100\n교육용 자기점검이며 진단이 아닙니다.`;
    try {
      if (navigator.share) await navigator.share({title:'마음의 모양 애착 자기점검',text,url:location.href});
      else { await navigator.clipboard.writeText(`${text}\n${location.href}`); toast('결과를 클립보드에 복사했습니다.'); }
    } catch (error) { if (error.name !== 'AbortError') toast('공유하지 못했습니다. 다시 시도해 주세요.'); }
  });

  $('#currentYear').textContent = new Date().getFullYear();

  try {
    const saved = JSON.parse(localStorage.getItem('soh-test-progress') || 'null');
    if (saved && ['quick','deep'].includes(saved.mode)) {
      const expected = saved.mode === 'quick' ? quickQuestions.length : deepQuestions.length;
      if (Array.isArray(saved.answers) && saved.answers.length === expected) {
        context = saved.context || context;
        mode = saved.mode;
        answers = saved.answers;
        index = Math.min(saved.index || 0, expected - 1);
        const completed = answers.filter(value => value != null).length;
        const target = $(`[data-start="${mode}"]`);
        if (target && completed) {
          target.textContent = `이어하기 · ${completed}/${expected}`;
          target.addEventListener('click', event => { event.stopImmediatePropagation(); questions = mode === 'quick' ? quickQuestions : deepQuestions; start(mode,true); }, {once:true,capture:true});
        }
      }
    }
  } catch (_) {}
})();