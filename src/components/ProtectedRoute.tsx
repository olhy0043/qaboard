import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../mocks/mockSession';

/** FR-022: 비회원의 보호된 화면 직접 접근 시 main으로 리다이렉트 후 로그인 모달 자동 오픈 (design.md §5). */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, requestLogin } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      requestLogin(location.pathname);
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!session) return null;
  return <>{children}</>;
}
