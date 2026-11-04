import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'd-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-4 border-bottom gap-3',
        className
      )}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              {breadcrumbs.map((bc, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'breadcrumb-item',
                    idx === breadcrumbs.length - 1 ? 'active text-muted' : ''
                  )}
                  {...(idx === breadcrumbs.length - 1 ? { 'aria-current': 'page' } : {})}
                >
                  {bc.href ? (
                    <a href={bc.href} className="text-decoration-none text-muted">
                      {bc.label}
                    </a>
                  ) : (
                    bc.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="h4 fw-bold text-dark mb-1">{title}</h1>
        {description && <p className="text-muted small mb-0">{description}</p>}
      </div>
      {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
