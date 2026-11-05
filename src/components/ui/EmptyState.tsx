import React from 'react';
import { Inbox, Plus } from 'lucide-react';
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
        'd-flex flex-column align-items-center justify-content-center text-center p-5 rounded-4 bg-white border',
        className
      )}
      style={{
        borderStyle: 'dashed',
        borderColor: '#cbd5e1',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mb-3"
        style={{ width: 60, height: 60 }}
      >
        {icon || <Inbox size={28} />}
      </div>
      <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.98rem' }}>
        {title}
      </h6>
      {description && (
        <p className="text-muted small mb-3" style={{ maxWidth: 420 }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" leftIcon={<Plus size={15} />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
