import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export function Card({
  className,
  title,
  subtitle,
  action,
  actions,
  footer,
  noPadding = false,
  children,
  ...props
}: CardProps) {
  const headerAction = action || actions;
  return (
    <div className={cn('card vyavsa-card mb-4 overflow-hidden', className)} {...props}>
      {(title || headerAction) && (
        <div
          className="card-header bg-white d-flex flex-wrap align-items-center justify-content-between gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <div>
            {title && (
              <h5
                className="card-title fw-bold mb-0 text-dark"
                style={{ fontSize: '0.96rem', letterSpacing: '-0.015em' }}
              >
                {title}
              </h5>
            )}
            {subtitle && (
              <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="ms-auto d-flex align-items-center gap-2">{headerAction}</div>}
        </div>
      )}
      <div className={cn('card-body', noPadding ? 'p-0' : 'p-4')}>{children}</div>
      {footer && (
        <div
          className="card-footer bg-light py-3 px-4"
          style={{ borderTop: '1px solid var(--color-border-subtle)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
