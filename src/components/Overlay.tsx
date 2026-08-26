import type { HTMLAttributes, ReactNode } from 'react';
import './Overlay.css';

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'scrim' | 'scrim-soft';
  children: ReactNode;
}

/** 모달·저장중 오버레이가 공유하는 fixed+center 레이어 (design-sync 사전 점검 CRITICAL 보정: 중복 구현 통합). */
export function Overlay({ tone = 'scrim', className, children, ...rest }: OverlayProps) {
  const classes = ['overlay', `overlay-${tone}`, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
