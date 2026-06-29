window.RT_SHARE=(()=>{
const $=(s,r=document)=>r.querySelector(s);
const latest=()=>{try{return JSON.parse(localStorage.getItem('soh-last-test-result')||'{}')}catch(_){return{}}};
function init(root,toast){
 const canvas=$('#rtcanvas',root);if(!canvas)return;
 const value=()=>{const r=latest();return{title:$('#rtst',root).value.trim()||'나를 이해하는 작은 안내서',trigger:$('#rtsx',root).value.trim()||'중요한 사실을 나중에 알게 될 때 불안해질 수 있어요.',need:$('#rtsn',root).value.trim()||'짧게라도 먼저 알려주는 반응이 도움이 됩니다.',type:$('#rtsty',root).checked&&r.type?(RT_DATA.types[r.type]||''):'',score:$('#rtssc',root).checked&&r.type?`불안 ${r.anxiety} · 회피 ${r.avoidance}`:''}};
 const lines=(ctx,text,x,y,max,step)=>{let row='',yy=y;text.split(' ').forEach(word=>{const next=row?row+' '+word:word;if(ctx.measureText(next).width>max&&row){ctx.fillText(row,x,yy);row=word;yy+=step}else row=next});if(row)ctx.fillText(row,x,yy);return yy};
 const draw=()=>{const ctx=canvas.getContext('2d'),d=value(),g=ctx.createLinearGradient(0,0,1080,1080);g.addColorStop(0,'#fff7f5');g.addColorStop(1,'#f4edf8');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1080);ctx.fillStyle='#e77780';ctx.beginPath();ctx.arc(900,160,190,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3e3033';ctx.font='700 60px sans-serif';lines(ctx,d.title,86,170,840,76);ctx.fillStyle='#b84f5c';ctx.font='700 24px sans-serif';ctx.fillText('WHEN I FEEL UNSAFE',86,350);ctx.fillStyle='#55474a';ctx.font='400 34px sans-serif';const y=lines(ctx,d.trigger,86,408,880,51);ctx.fillStyle='#b84f5c';ctx.font='700 24px sans-serif';ctx.fillText('WHAT HELPS ME',86,y+105);ctx.fillStyle='#55474a';ctx.font='400 34px sans-serif';const y2=lines(ctx,d.need,86,y+162,880,51);ctx.fillStyle='#75666a';ctx.font='600 22px sans-serif';if(d.type)ctx.fillText(d.type,86,y2+96);if(d.score)ctx.fillText(d.score,86,y2+132);ctx.fillStyle='#b84f5c';ctx.fillText('마음의 모양 · Shape of Heart',86,995)};
 ['rtst','rtsx','rtsn','rtsty','rtssc'].forEach(id=>$(`#${id}`,root).oninput=draw);$('#rtsp',root).onclick=draw;
 $('#rtsc',root).onclick=async()=>{const d=value(),text=`${d.title}\n\n불안해지는 상황\n${d.trigger}\n\n도움이 되는 반응\n${d.need}`;try{await navigator.clipboard.writeText(text);toast('공유 문구를 복사했습니다.')}catch(_){toast('복사 권한을 확인해 주세요.')}};
 $('#rtsd',root).onclick=()=>{draw();const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='shape-of-heart-card.png';a.click()};draw()
}
return{init};
})();