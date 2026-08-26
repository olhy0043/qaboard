import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role, Session } from '../types';

interface SessionContextValue {
  session: Session | null;
  loginModalOpen: boolean;
  pendingRedirect: string;
  requestLogin: (redirectTo: string) => void;
  closeLoginModal: () => void;
  login: (email: string) => Session;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/** Mock 세션 Provider. Phase 6에서 Supabase 세션 기반 구현으로 교체된다(plan.md §4). */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState('/');

  function requestLogin(redirectTo: string) {
    setPendingRedirect(redirectTo);
    setLoginModalOpen(true);
  }

  function closeLoginModal() {
    setLoginModalOpen(false);
  }

  function login(email: string): Session {
    const role: Role = email.startsWith('admin') ? 'admin' : 'member';
    const next: Session = { email, role };
    setSession(next);
    setLoginModalOpen(false);
    return next;
  }

  function logout() {
    setSession(null);
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        loginModalOpen,
        pendingRedirect,
        requestLogin,
        closeLoginModal,
        login,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
