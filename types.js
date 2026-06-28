(() => {
  'use strict';
  const data = window.ShapeHeartData;
  if (!data) return;

  const overview = document.getElementById('typeOverviewGrid');
  const profiles = document.getElementById('deepProfiles');

  const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

  overview.innerHTML = data.typeOrder.map(key => {
    const t = data.types[key];
    return `<article class="type-overview-card ${key}">
      <div class="type-overview-top"><span class="type-overview-symbol">${t.symbol}</span><div><h3>${t.name}</h3><small>${t.axes} · ${t.english}</small></div></div>
      <p>${t.summary}</p><a href="#${key}">심층 설명 보기 →</a>
    </article>`;
  }).join('');

  profiles.innerHTML = data.typeOrder.map(key => {
    const t = data.types[key];
    return `<section class="deep-profile ${key}" id="${key}">
      <header class="deep-profile-header"><span class="type-overview-symbol">${t.symbol}</span><div><h2>${t.name}</h2><small>${t.english} · ${t.axes}</small></div></header>
      <p class="deep-profile-quote">“${t.quote}”</p>
      <div class="profile-core">
        <article><small>내면의 기본 기대</small><p>${t.inner}</p></article>
        <article><small>겉으로 보이는 반응</small><p>${t.outward}</p></article>
        <article><small>갈등 상황</small><p>${t.conflict}</p></article>
        <article><small>친밀감과 이별</small><p>${t.intimacy} ${t.breakup}</p></article>
      </div>
      <div class="profile-list-grid">
        <article class="profile-list-card"><h3>강점으로 쓰일 수 있는 부분</h3>${list(t.strengths)}</article>
        <article class="profile-list-card"><h3>주의해서 볼 위험</h3>${list(t.risks)}</article>
        <article class="profile-list-card"><h3>관계에서 필요한 경험</h3>${list(t.needs)}</article>
        <article class="profile-list-card"><h3>도움이 되는 표현</h3>${list(t.helpful)}</article>
        <article class="profile-list-card"><h3>악순환을 키우는 행동</h3>${list(t.unhelpful)}</article>
        <article class="profile-list-card"><h3>자주 촉발되는 상황</h3><p style="margin:0;color:var(--text-soft);font-size:9.5px;line-height:1.6">${t.trigger}</p></article>
      </div>
      <article class="profile-sequence-card"><h3>스트레스 상황에서 나타날 수 있는 순서</h3><ol>${t.sequence.map(step => `<li>${step}</li>`).join('')}</ol></article>
    </section>`;
  }).join('');

  const links = [...document.querySelectorAll('.page-tabs a')];
  const sections = data.typeOrder.map(key => document.getElementById(key)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, {rootMargin:'-25% 0px -65% 0px', threshold:[0,.2,.5]});
    sections.forEach(section => observer.observe(section));
  }
})();