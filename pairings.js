(() => {
  'use strict';
  const data = window.ShapeHeartData;
  if (!data) return;

  const mySelect = document.getElementById('myType');
  const partnerSelect = document.getElementById('partnerType');
  const result = document.getElementById('pairResult');
  const matrix = document.getElementById('pairMatrix');
  if (!mySelect || !partnerSelect || !result || !matrix) return;

  const options = data.typeOrder.map(key => `<option value="${key}">${data.types[key].name}</option>`).join('');
  mySelect.innerHTML = options;
  partnerSelect.innerHTML = options;

  const params = new URLSearchParams(location.search);
  const initialMe = data.types[params.get('me')] ? params.get('me') : 'anxious';
  const initialPartner = data.types[params.get('partner')] ? params.get('partner') : 'dismissive';
  mySelect.value = initialMe;
  partnerSelect.value = initialPartner;

  function renderResult(push = true) {
    const me = mySelect.value;
    const partner = partnerSelect.value;
    const item = data.pairings[`${me}-${partner}`];
    if (!item) return;

    result.innerHTML = `<article class="pair-result-card">
      <header class="pair-result-header">
        <small>${item.tone}</small>
        <h2>${item.title}</h2>
        <p>${item.tagline}</p>
        <div class="pair-meta"><span>${item.balance}</span><span>${data.types[me].axes}</span><span>${data.types[partner].axes}</span></div>
      </header>
      <div class="pair-result-body">
        <article><h3>기본 흐름</h3><p>${item.intro}</p></article>
        <article><h3>강점과 가능성</h3><p>${item.strengths}</p></article>
        <article><h3>마찰이 생기는 지점</h3><p>${item.friction}</p></article>
        <article><h3>반복될 수 있는 악순환</h3><p>${item.cycle}</p></article>
        <article><h3>복구를 위한 핵심</h3><p>${item.repair}</p></article>
      </div>
      <div class="pair-script"><b>이 조합에서 써볼 수 있는 문장</b><q>“${item.script}”</q></div>
    </article>`;

    [...matrix.querySelectorAll('button')].forEach(button => button.classList.toggle('active', button.dataset.me === me && button.dataset.partner === partner));
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('me', me);
      url.searchParams.set('partner', partner);
      history.replaceState(null, '', url);
    }
  }

  function renderMatrix() {
    let html = '<span></span>';
    data.typeOrder.forEach(key => { html += `<span>${data.types[key].name}</span>`; });
    data.typeOrder.forEach(me => {
      html += `<span>${data.types[me].name}<br>인 나</span>`;
      data.typeOrder.forEach(partner => {
        const item = data.pairings[`${me}-${partner}`];
        html += `<button type="button" data-me="${me}" data-partner="${partner}"><b>${item.tone}</b>${data.types[partner].name} 상대</button>`;
      });
    });
    matrix.innerHTML = html;
    matrix.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      mySelect.value = button.dataset.me;
      partnerSelect.value = button.dataset.partner;
      renderResult();
      document.getElementById('explorer').scrollIntoView({behavior:'smooth',block:'start'});
    }));
  }

  mySelect.addEventListener('change', () => renderResult());
  partnerSelect.addEventListener('change', () => renderResult());
  renderMatrix();
  renderResult(false);
})();