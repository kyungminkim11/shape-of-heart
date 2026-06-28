(() => {
  const section = document.getElementById('service-purpose');
  if (!section) return;
  section.querySelector('h3').textContent = '실제 관계 경험에서 출발한 프로젝트입니다';
  const text = section.querySelector('p');
  if (text) text.textContent = '마음의 모양은 서로의 마음을 다르게 이해했던 경험을 계기로 시작했습니다. 애착 이론과 관계 패턴을 공부한 내용을 누구나 쉽게 살펴볼 수 있도록 정리하며, 더 건강하고 행복한 관계에 도움이 되는 열린 서비스를 지향합니다.';
})();