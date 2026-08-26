import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Overlay } from './Overlay';
import { useSession } from '../mocks/mockSession';
import './LoginModal.css';

/** FR-005: 비회원이 보호된 행동을 시도하면 모달 로그인 폼을 표시한다. */
export function LoginModal() {
  const { loginModalOpen, pendingRedirect, closeLoginModal, login } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loginModalOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLoginModal();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loginModalOpen, closeLoginModal]);

  if (!loginModalOpen) return null;

  function handleSubmit() {
    login(email);
    setEmail('');
    setPassword('');
    navigate(pendingRedirect);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeLoginModal();
  }

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginModalTitle"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal-title" id="loginModalTitle">
          로그인이 필요합니다
        </div>
        <div className="modal-desc">질문을 작성하거나 내 질문을 확인하려면 로그인해주세요.</div>
        <div className="modal-field">
          <label htmlFor="loginEmail">이메일</label>
          <input
            id="loginEmail"
            type="email"
            required
            aria-required="true"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="loginPassword">비밀번호</label>
          <input
            id="loginPassword"
            type="password"
            required
            aria-required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={closeLoginModal}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!email}>
            로그인
          </Button>
        </div>
      </div>
    </Overlay>
  );
}
