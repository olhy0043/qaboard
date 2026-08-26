import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { LoginModal } from './LoginModal';
import { useSession } from '../mocks/mockSession';

export function Layout() {
  const { session, requestLogin, logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Header
        session={session}
        onLoginClick={() => requestLogin('/questions')}
        // FR-001 회원가입은 로그인 모달과 별개 화면(Phase 6에서 구현 예정) — 잘못 로그인
        // 모달로 연결하지 않도록 design-sync HIGH 보정: 현재는 명시적 no-op으로 둔다.
        onSignupClick={() => {}}
        onLogoutClick={() => {
          logout();
          navigate('/');
        }}
      />
      <Outlet key={location.pathname} />
      <LoginModal />
    </>
  );
}
