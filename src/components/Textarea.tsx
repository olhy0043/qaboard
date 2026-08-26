import type { TextareaHTMLAttributes } from 'react';
import './Field.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  maxLength: number;
  error?: string;
}

export function Textarea({ label, maxLength, error, value, id, ...rest }: TextareaProps) {
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
      <textarea
        id={id}
        className="field-textarea"
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
