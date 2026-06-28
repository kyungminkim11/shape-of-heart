(() => {
  'use strict';
  const TYPE_NAMES={secure:'안정형',anxious:'불안집착형',dismissive:'거부회피형',fearful:'공포회피형'};
  const read=()=>{try{return JSON.parse(localStorage.getItem('soh-test-history')||'[]')}catch(_){return[]}};
  const grid=document.getElementById('historyGrid');
  const empty=document.getElementById('historyEmpty');
  const summary=document.getElementById('trendSummary');
  const clear=document.getElementById('clearHistory');

  function deltaText(history){
    if(history.length<2)return '테스트를 한 번 더 완료하면 최근 결과와 이전 결과의 차이를 비교할 수 있습니다.';
    const newest=history[0],oldest=history[history.length-1];
    const a=newest.anxiety-oldest.anxiety,v=newest.avoidance-oldest.avoidance;
    const describe=(value,label)=>value===0?`${label} 변화 없음`:`${label} ${Math.abs(value)}점 ${value>0?'상승':'하락'}`;
    return `${describe(a,'애착 불안')}, ${describe(v,'애착 회피')}로 나타났습니다. 같은 관계를 기준으로 답했을 때 변화 해석이 더 유용합니다.`;
  }

  function render(){
    const history=read();
    empty.hidden=history.length>0;
    summary.innerHTML=`<article class="trend-summary"><span class="personal-card-label">CHANGE OVER TIME</span><h2>${history.length?`${history.length}개의 결과가 저장되어 있어요`:'아직 변화 기록이 없어요'}</h2><p>${history.length?deltaText(history):'테스트 결과를 저장하면 날짜와 관계별로 불안·회피의 변화를 확인할 수 있습니다.'}</p></article>`;
    grid.innerHTML=history.map(item=>`<article class="history-item"><div class="history-item-top"><div><h3>${TYPE_NAMES[item.type]||'애착'} 원형에 가까운 반응</h3><p>${item.context||'관계'} · ${item.mode==='deep'?'복잡형':'단순형'}</p></div><time>${new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium'}).format(new Date(item.date))}</time></div><div class="history-bars"><div class="history-bar-row"><span>애착 불안</span><div class="history-bar"><i style="width:${item.anxiety}%"></i></div><b>${item.anxiety}</b></div><div class="history-bar-row"><span>애착 회피</span><div class="history-bar"><i style="width:${item.avoidance}%"></i></div><b>${item.avoidance}</b></div></div><div class="history-actions"><a class="button button-ghost" href="types.html#${item.type}">유형 보기</a><a class="button button-ghost" href="pairings.html?me=${item.type}&partner=anxious">안정형 × 불안형 예시</a></div></article>`).join('');
  }

  clear?.addEventListener('click',()=>{if(confirm('이 기기에 저장된 테스트 기록을 모두 지울까요?')){localStorage.removeItem('soh-test-history');localStorage.removeItem('soh-last-test-result');render();}});
  render();
})();