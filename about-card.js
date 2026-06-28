(() => {
  const section = document.getElementById('service-purpose');
  if (!section) return;

  const card = section.querySelector('.dashboard-feature');
  if (!card) return;

  card.innerHTML = `
    <small>WHY THIS PROJECT STARTED</small>
    <h3>서로의 마음을 더 잘 이해하고 싶어서 시작했습니다</h3>
    <p>저는 관계에서 상대의 마음을 충분히 알아차리지 못해 실망을 주고, 서로 다른 방식으로 감정을 표현하다 다투기도 했습니다. 단순히 누가 맞고 틀린지를 가르는 것보다 왜 같은 상황을 서로 다르게 느끼고 반응하는지 알고 싶었습니다.</p>
    <p>상대의 유형과 제 반응을 이해하기 위해 애착 이론과 관계 패턴을 공부하기 시작했습니다. 공부할수록 사람을 불안형이나 회피형이라는 한 단어로 단정하기보다 애착 불안과 회피의 두 축, 그리고 현재 관계의 맥락을 함께 보는 것이 중요하다는 점을 알게 됐습니다.</p>
    <p>그 공부를 저 혼자만의 메모로 남기지 않고 비슷한 고민을 하는 사람도 쉽게 살펴볼 수 있도록 만든 것이 마음의 모양입니다. 누군가를 낙인찍는 도구가 아니라 서로의 마음을 조금 더 이해하고, 모두가 더 건강하고 행복한 관계를 만들어 가는 작은 출발점이 되기를 바랍니다.</p>
    <p><strong>마음의 모양은 열린 서비스입니다.</strong> 내용의 오류, 필요한 정보, 테스트, 기능과 디자인에 관한 의견을 받으며 계속 개선합니다.</p>
    <a class="button button-primary" href="feedback.html">의견 보내기</a>`;
})();