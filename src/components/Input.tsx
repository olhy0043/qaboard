import type { InputHTMLAttributes } from 'react';
import './Field.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  maxLength: number;
  error?: string;
}

export function Input({ label, maxLength, error, value, id, ...rest }: InputProps) {
  const length = typeof value === 'string' ? value.length : 0;
  const errorId = `${id}-error`;
  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        <span className="field-hint">
          {length}/{maxLength}
        </span>
      </div>
      <input
        id={id}
        className="field-input"
        maxLength={maxLength}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <div className="field-error" id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
