import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createElement } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchRole } from '../lib/auth';
import type { Session } from '../types';

/**
 * T053: mockSession(src/mocks/mockSession.tsx)과 동일한 인터페이스를 유지하는
 * 실제 Supabase 세션 Provider (plan.md §4). Phase 6에서 App.tsx/Layout.tsx의
 * import를 mockSession → useAuth로 교체하면 컴포넌트 쪽 코드 변경 없이 전환된다.
 * LoginModal.tsx는 이 시점에 login(email, password)로 시그니처가 바뀌므로
 * T056에서 함께 갱신한다(현재는 아직 mockSession을 사용 중이므로 미연결).
 */
interface AuthContextValue {
  session: Session | null;
  loginModalOpen: boolean;
  pendingRedirect: string;
  requestLogin: (redirectTo: string) => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<Session>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState('/');

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();
      if (authSession?.user) {
        const role = await fetchRole(authSession.user.id);
        setSession({ email: authSession.user.email ?? '', role });
      }
    }
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, authSession) => {
      if (!authSession?.user) {
        setSession(null);
        return;
      }
      const role = await fetchRole(authSession.user.id);
      setSession({ email: authSession.user.email ?? '', role });
    });

    return () => subscription.unsubscribe();
  }, []);

  function requestLogin(redirectTo: string) {
    setPendingRedirect(redirectTo);
    setLoginModalOpen(true);
  }

  function closeLoginModal() {
    setLoginModalOpen(false);
  }

  async function login(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw error ?? new Error('로그인에 실패했습니다.');
    }
    const role = await fetchRole(data.user.id);
    const next: Session = { email: data.user.email ?? email, role };
    setSession(next);
    setLoginModalOpen(false);
    return next;
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return createElement(AuthContext.Provider, {
    value: { session, loginModalOpen, pendingRedirect, requestLogin, closeLoginModal, login, logout },
    children,
  });
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
