import type { ReactNode } from 'react';
import './StatePanel.css';

interface StatePanelProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function StatePanel({ icon, title, description, action }: StatePanelProps) {
  return (
    <div className="state-panel">
      <div className="state-icon">{icon}</div>
      <div className="state-title">{title}</div>
      {description && <div className="state-desc">{description}</div>}
      {action}
    </div>
  );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skel-bar" />
      ))}
    </div>
  );
}
