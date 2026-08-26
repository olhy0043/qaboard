import './FloatingCards.css';

/** design.md §10: 1024px 이하 전환은 순수 CSS 미디어쿼리로만 처리(JS 분기 없음). */
export function FloatingCards() {
  return (
    <div className="floating-cards">
      <div className="connector" />
      <div className="fcard fcard-q">
        <div className="fcard-label">질문</div>
        <div className="fcard-text">회원 탈퇴 후에도 이전에 작성한 질문 기록이 남나요?</div>
        <div className="fcard-meta">2분 전 · 답변 대기 중</div>
      </div>
      <div className="fcard fcard-a">
        <div className="fcard-label">관리자 답변</div>
        <div className="fcard-text">
          탈퇴 시 개인 식별 정보는 삭제되며, 질문 기록은 익명 처리되어...
        </div>
        <div className="fcard-meta">방금 전 · 답변 완료</div>
      </div>
    </div>
  );
}
