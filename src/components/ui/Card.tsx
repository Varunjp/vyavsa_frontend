import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  className,
  title,
  subtitle,
  action,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn('card vyavsa-card shadow-sm border-1 mb-4', className)} {...props}>
      {(title || action) && (
        <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3">
          <div>
            {title && <h5 className="card-title fs-6 fw-bold mb-0 text-dark">{title}</h5>}
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          {action && <div className="ms-auto">{action}</div>}
        </div>
      )}
      <div className="card-body p-4">{children}</div>
      {footer && <div className="card-footer bg-light border-top py-2 px-4">{footer}</div>}
    </div>
  );
}
