import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Header.css';

interface HeaderProps {
  session: { email: string; role: 'member' | 'admin' } | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
}

export function Header({ session, onLoginClick, onSignupClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="logo" to="/">
          QANOW
        </Link>
        {session ? (
          <div className="header-right">
            <span className="user-chip">
              {session.email}
              {session.role === 'admin' && <span className="role-tag">관리자</span>}
            </span>
            <Button variant="secondary" size="sm" onClick={onLogoutClick}>
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="header-cta">
            <Button variant="secondary" size="sm" onClick={onLoginClick}>
              로그인
            </Button>
            <Button variant="primary" size="sm" onClick={onSignupClick}>
              회원가입
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
