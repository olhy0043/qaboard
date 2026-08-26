import type { ReactNode } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  size?: 'page' | 'detail';
  bordered?: boolean;
}

/** design.md §8 Page Header 규칙의 단일 구현 (design-sync 사전 점검 CRITICAL 보정: ListPage/QuestionPage 중복 통합). */
export function PageHeader({
  title,
  subtitle,
  actions,
  meta,
  size = 'page',
  bordered = false,
}: PageHeaderProps) {
  return (
    <div className={`page-header${bordered ? ' page-header-bordered' : ''}`}>
      <div className="page-header-row">
        <div>
          <h1 className={`page-header-title page-header-title-${size}`}>{title}</h1>
          {subtitle && <p className="page-header-sub">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
      {meta}
    </div>
  );
}
