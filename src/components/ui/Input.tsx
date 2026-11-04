import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="mb-3 w-100">
        {label && (
          <label htmlFor={inputId} className="form-label fw-semibold text-secondary small mb-1">
            {label}
          </label>
        )}
        <div className="input-group">
          {leftIcon && <span className="input-group-text bg-light text-muted">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn('form-control', error && 'is-invalid', className)}
            {...props}
          />
          {rightIcon && <span className="input-group-text bg-light text-muted">{rightIcon}</span>}
          {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
        {!error && helperText && (
          <div className="form-text text-muted small mt-1">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
