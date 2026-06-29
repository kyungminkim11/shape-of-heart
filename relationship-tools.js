(() => {
'use strict';
if (window.__sohRelationshipTools) return;
window.__sohRelationshipTools = true;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const home = () => location.pathname === '/' || location.pathname.endsWith('/index.html');
const toast = message => {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800);
};
function entries() {
  $$('.site-desktop-nav').forEach(nav => {
    if (nav.querySelector('[data-rt-link]')) return;
    const a = document.createElement('a'); a.dataset.rtLink = '1';
    a.href = home() ? '#relationship-tools' : './#relationship-tools'; a.textContent = '도구';
    nav.insertBefore(a, nav.querySelector('a[href="encyclopedia.html"]') || null);
  });
  $$('.site-sidebar').forEach(sidebar => {
    if (sidebar.querySelector('[data-rt-group]')) return;
    const group = document.createElement('div'); group.className = 'sidebar-group'; group.dataset.rtGroup = '1';
    group.innerHTML = `<span class="sidebar-label">TOOLS</span><a href="${home() ? '#relationship-tools' : './#relationship-tools'}">관계 도구</a>`;
    sidebar.appendChild(group);
  });
  const dashboard = $('.dashboard');
  if (!dashboard || $('#relationship-tools-entry')) return;
  const section = document.createElement('section'); section.className = 'dashboard-section'; section.id = 'relationship-tools-entry';
  section.innerHTML = `<div class="dashboard-section-head"><div><span>RELATIONSHIP TOOLKIT</span><h2>관계에 바로 적용하는 도구</h2></div><a href="#relationship-tools">전체 도구 보기 →</a></div><div class="quick-grid"><a class="quick-card test" href="#relationship-tools"><span class="quick-card-icon">!</span><h3>상황별 가이드</h3><p>현재 상황에 맞는 감정 정리와 대화 예시를 확인합니다.</p></a><a class="quick-card pair" href="#relationship-tools"><span class="quick-card-icon">↻</span><h3>갈등 패턴 지도</h3><p>반복되는 흐름과 악순환을 끊을 지점을 찾습니다.</p></a><a class="quick-card types" href="#relationship-tools"><span class="quick-card-icon">“”</span><h3>문장 도우미</h3><p>압박을 줄이고 솔직한 요청과 경계로 다듬습니다.</p></a><a class="quick-card dictionary" href="#relationship-tools"><span class="quick-card-icon">✓</span><h3>변화와 실천 기록</h3><p>행동과 체크리스트를 브라우저에 저장합니다.</p></a></div>`;
  ($('#service-purpose') || dashboard.lastElementChild)?.insertAdjacentElement('beforebegin', section);
}
function close() {
  $('.rt')?.remove(); document.body.style.overflow = '';
  if (location.hash === '#relationship-tools') history.replaceState(null, '', location.pathname + location.search);
}
function open() {
  if ($('.rt')) return;
  if (!window.RT_APP?.mount || !window.RT_DATA) { toast('관계 도구를 불러오는 중입니다.'); return; }
  document.body.style.overflow = 'hidden';
  const root = RT_APP.mount(close, toast);
  window.RT_RECORDS?.init?.(root, toast);
  window.RT_SHARE?.init?.(root, toast);
}
setTimeout(entries, 120);
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#relationship-tools"]'); if (!a) return;
  e.preventDefault(); history.pushState(null, '', '#relationship-tools'); open();
});
addEventListener('hashchange', () => { if (location.hash === '#relationship-tools') open(); });
if (location.hash === '#relationship-tools') setTimeout(open, 180);
window.ShapeOfHeartTools = {open, close};
})();