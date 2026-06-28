(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const TYPE_NAMES = {secure:'안정형',anxious:'불안집착형',dismissive:'거부회피형',fearful:'공포회피형'};

  function read(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(_){return fallback}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}}

  function saveLatestToHistory(){
    const latest=read('soh-last-test-result');if(!latest?.date)return;
    const history=read('soh-test-history',[]);
    if(history.some(item=>item.date===latest.date))return;
    history.unshift(latest);write('soh-test-history',history.slice(0,12));
  }

  function roundedRect(ctx,x,y,w,h,r,fill){
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
  }

  async function makeShareCard(result){
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
    const ctx=canvas.getContext('2d');
    const bg=ctx.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,'#fff8f6');bg.addColorStop(1,'#ffe9e5');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
    ctx.fillStyle='#e77078';ctx.font='800 34px sans-serif';ctx.fillText('마음의 모양 · Shape of Heart',80,100);
    ctx.fillStyle='#312a2a';ctx.font='800 66px sans-serif';ctx.fillText(`${TYPE_NAMES[result.type]||'애착'} 원형에`,80,235);ctx.fillText('가까운 반응',80,315);
    ctx.fillStyle='#6f6262';ctx.font='400 28px sans-serif';ctx.fillText(`${result.context||'관계'} 기준 · ${result.mode==='deep'?'복잡형':'단순형'} 자기점검`,80,380);

    roundedRect(ctx,80,445,920,250,38,'rgba(255,255,255,.86)');
    const scores=[['애착 불안',result.anxiety],['애착 회피',result.avoidance]];
    scores.forEach(([label,value],index)=>{
      const y=515+index*105;ctx.fillStyle='#312a2a';ctx.font='700 27px sans-serif';ctx.fillText(label,125,y);ctx.fillStyle='#c85661';ctx.font='800 42px sans-serif';ctx.textAlign='right';ctx.fillText(String(value),930,y);ctx.textAlign='left';
      roundedRect(ctx,125,y+28,805,16,8,'#f4e4e3');roundedRect(ctx,125,y+28,805*(value/100),16,8,'#e77078');
    });

    roundedRect(ctx,80,750,920,360,38,'rgba(255,255,255,.82)');
    ctx.fillStyle='#c85661';ctx.font='800 26px sans-serif';ctx.fillText('결과를 읽는 방법',125,820);
    ctx.fillStyle='#4d4141';ctx.font='400 28px sans-serif';
    const lines=['이 결과는 현재 떠올린 관계에서 나타나는','애착 불안과 회피의 정도를 보여줍니다.','성격 전체나 관계의 미래를 진단하지 않습니다.'];
    lines.forEach((line,i)=>ctx.fillText(line,125,885+i*48));
    ctx.fillStyle='#958686';ctx.font='400 24px sans-serif';ctx.fillText('shape-of-heart.lavalabs.co.kr',125,1055);
    ctx.fillStyle='#312a2a';ctx.font='700 25px sans-serif';ctx.fillText('서로를 판단하기보다 이해하기 위한 작은 지도',80,1235);
    return new Promise(resolve=>canvas.toBlob(resolve,'image/png',.94));
  }

  async function shareResult(event){
    event.preventDefault();event.stopImmediatePropagation();
    const result=read('soh-last-test-result');if(!result)return;
    const text=`마음의 모양 자기점검 결과\n${TYPE_NAMES[result.type]} 원형에 가까운 반응\n애착 불안 ${result.anxiety}/100 · 애착 회피 ${result.avoidance}/100`;
    try{
      const blob=await makeShareCard(result);const file=new File([blob],'shape-of-heart-result.png',{type:'image/png'});
      if(navigator.canShare?.({files:[file]})){await navigator.share({title:'마음의 모양 애착 자기점검',text,files:[file],url:'https://shape-of-heart.lavalabs.co.kr/tests.html'});return;}
      const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='shape-of-heart-result.png';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1500);
      navigator.clipboard?.writeText(`${text}\nhttps://shape-of-heart.lavalabs.co.kr/tests.html`);
      alert('결과 이미지를 저장하고 공유 문구를 복사했습니다.');
    }catch(error){if(error.name!=='AbortError')alert('공유 이미지를 만들지 못했습니다. 다시 시도해 주세요.');}
  }

  function init(){
    const result=$('#testResult');if(result){
      const observer=new MutationObserver(()=>{if(!result.hidden)saveLatestToHistory();});observer.observe(result,{attributes:true,attributeFilter:['hidden']});
    }
    const button=$('#shareTestResult');if(button){button.textContent='결과 이미지 공유하기';button.addEventListener('click',shareResult,true);const note=document.createElement('p');note.className='share-image-note';note.textContent='공유 가능한 기기에서는 결과 이미지가 함께 전송됩니다.';button.parentElement?.appendChild(note);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();