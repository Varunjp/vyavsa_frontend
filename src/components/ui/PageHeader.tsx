import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
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
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="mb-1">
            <ol className="breadcrumb mb-0 d-flex align-items-center gap-1 small">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight size={13} className="text-muted opacity-75" />}
                  <li
                    className={cn(
                      'small fw-medium',
                      idx === breadcrumbs.length - 1 ? 'text-primary fw-semibold' : 'text-muted'
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
                </React.Fragment>
              ))}
            </ol>
          </nav>
        )}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h1
            className="fw-extrabold text-dark mb-0"
            style={{ fontSize: '1.425rem', letterSpacing: '-0.025em' }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.86rem' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
