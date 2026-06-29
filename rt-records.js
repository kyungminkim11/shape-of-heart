window.RT_RECORDS=(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const day=()=>new Date().toISOString().slice(0,10);
const safe=s=>String(s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
function journal(root,toast){
 const date=$('#rtjd',root);if(!date)return;date.value=day();
 const render=()=>{const list=get('soh-change-journal',[]),a=list.length?Math.round(list.reduce((n,x)=>n+x.anxiety,0)/list.length):0,v=list.length?Math.round(list.reduce((n,x)=>n+x.avoidance,0)/list.length):0;
  $('#rtjs',root).innerHTML=[['기록',list.length],['평균 불안',a],['평균 회피',v]].map(([l,n])=>`<div><b>${n}</b><span>${l}</span></div>`).join('');
  $('#rtjl',root).innerHTML=list.length?list.slice().reverse().map((x,i)=>`<article class="rt-entry"><header><b>${x.date}</b><button class="rt-text rt-jdel" data-i="${list.length-1-i}">삭제</button></header><p>불안 ${x.anxiety} · 회피 ${x.avoidance}</p>${x.honesty?`<p><b>솔직했던 순간</b><br>${safe(x.honesty)}</p>`:''}${x.next?`<p><b>다음 행동</b><br>${safe(x.next)}</p>`:''}</article>`).join(''):'<p class="rt-empty">아직 저장된 기록이 없습니다.</p>';
  $$('.rt-jdel',root).forEach(b=>b.onclick=()=>{const x=get('soh-change-journal',[]);x.splice(+b.dataset.i,1);set('soh-change-journal',x);render()})};
 $('#rtjf',root).onsubmit=e=>{e.preventDefault();const list=get('soh-change-journal',[]);list.push({date:date.value||day(),anxiety:+$('#rtja',root).value,avoidance:+$('#rtjv',root).value,honesty:$('#rtjh',root).value.trim(),next:$('#rtjn',root).value.trim()});set('soh-change-journal',list);$('#rtjh',root).value='';$('#rtjn',root).value='';render();toast('변화 기록을 저장했습니다.')};render()
}
function practice(root,toast){
 const box=$('#rtpl',root);if(!box)return;
 const render=()=>{const store=get('soh-practice-days',{}),checked=store[day()]||[];$('#rtpd',root).textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date());box.innerHTML=RT_DATA.practice.map(([t,d],i)=>`<label class="rt-check"><input type="checkbox" data-i="${i}" ${checked.includes(i)?'checked':''}><b>${t}</b><span>${d}</span></label>`).join('');let streak=0,cursor=new Date();while(true){const k=cursor.toISOString().slice(0,10);if((store[k]||[]).length<3)break;streak++;cursor.setDate(cursor.getDate()-1)}$('#rtpst',root).textContent=`${streak}일 연속`};
 $('#rtps',root).onclick=()=>{const store=get('soh-practice-days',{});store[day()]=$$('#rtpl input:checked',root).map(x=>+x.dataset.i);set('soh-practice-days',store);render();toast('오늘의 실천을 저장했습니다.')};render()
}
function repair(root,toast){
 const box=$('#rtrl',root);if(!box)return;const old=get('soh-repair-plan',{checks:[],promise:''});
 box.innerHTML=RT_DATA.repair.map(([t,d],i)=>`<label class="rt-check"><input type="checkbox" data-i="${i}" ${old.checks.includes(i)?'checked':''}><b>${t}</b><span>${d}</span></label>`).join('');$('#rtrm',root).value=old.promise||'';
 const progress=()=>{const n=$$('#rtrl input:checked',root).length,p=Math.round(n/RT_DATA.repair.length*100);$('#rtrp',root).textContent=`${p}% 완료`};box.onchange=progress;
 $('#rtrs',root).onclick=()=>{set('soh-repair-plan',{checks:$$('#rtrl input:checked',root).map(x=>+x.dataset.i),promise:$('#rtrm',root).value.trim()});progress();toast('관계 회복 계획을 저장했습니다.')};progress()
}
function settings(root){
 const old=get('soh-display-settings',{font:'1',motion:false,contrast:false});if(!$('#rtfont',root))return;$('#rtfont',root).value=old.font;$('#rtmotion',root).checked=old.motion;$('#rtcontrast',root).checked=old.contrast;
 const apply=()=>{const x={font:$('#rtfont',root).value,motion:$('#rtmotion',root).checked,contrast:$('#rtcontrast',root).checked};document.documentElement.style.fontSize=`calc(16px * ${x.font})`;document.documentElement.classList.toggle('rt-motion',x.motion);document.documentElement.classList.toggle('rt-contrast',x.contrast);set('soh-display-settings',x)};['rtfont','rtmotion','rtcontrast'].forEach(id=>$(`#${id}`,root).onchange=apply);apply();
 $('#rtexport',root).onclick=()=>{const out={exportedAt:new Date().toISOString()};Object.keys(localStorage).filter(k=>k.startsWith('soh-')).forEach(k=>out[k]=get(k,null));const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`shape-of-heart-data-${day()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 $('#rtdelete',root).onclick=()=>{if(!confirm('마음의 모양에 저장된 모든 로컬 데이터를 삭제할까요?'))return;Object.keys(localStorage).filter(k=>k.startsWith('soh-')).forEach(k=>localStorage.removeItem(k));location.reload()}
}
return{init(root,toast){journal(root,toast);practice(root,toast);repair(root,toast);settings(root)}};
})();