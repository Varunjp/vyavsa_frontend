import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'd-flex flex-column align-items-center justify-content-center text-center p-5 border border-dashed rounded-3 bg-light',
        className
      )}
    >
      <div className="text-muted mb-3">
        {icon || <Inbox size={48} className="text-secondary opacity-50" />}
      </div>
      <h6 className="fw-bold text-dark mb-1">{title}</h6>
      {description && <p className="text-muted small mb-3 max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
