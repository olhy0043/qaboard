import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { FloatingCards } from '../components/FloatingCards';
import { useSession } from '../mocks/mockSession';
import './MainPage.css';

/** FR-004/FR-005: 서비스 소개, 이용 흐름, 질문 작성 CTA(비회원은 로그인 모달로 이어짐). */
export function MainPage() {
  const { requestLogin } = useSession();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="service-name">QANOW</div>
            <h1 className="hero-main">
              질문은 빠르게,
              <br />
              답변은 명확하게.
            </h1>
            <p className="hero-sub">궁금한 점을 남기면 관리자가 확인하고 답변해드립니다.</p>
            <div className="hero-cta">
              <Button onClick={() => requestLogin('/questions/new')}>질문 작성하기</Button>
              <Button variant="secondary-on-dark" onClick={() => requestLogin('/questions')}>
                내 질문 확인하기
              </Button>
            </div>
          </div>
          <FloatingCards />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">이용 흐름</h2>
          <div className="flow-steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-title">질문 작성</div>
              <div className="step-desc">궁금한 점을 자유롭게 질문하세요</div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-title">관리자 확인</div>
              <div className="step-desc">관리자가 신속하게 검토합니다</div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-title">답변 확인</div>
              <div className="step-desc">명확한 답변을 받으세요</div>
            </div>
          </div>
        </div>
      </section>

      <section className="badges-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            상태는 한눈에 확인할 수 있습니다
          </h2>
          <div className="badges-row">
            <Badge status="waiting" />
            <Badge status="done" />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">QANOW — 신뢰할 수 있는 Q&amp;A 플랫폼</div>
      </footer>
    </>
  );
}
