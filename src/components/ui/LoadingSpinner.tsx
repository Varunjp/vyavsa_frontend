import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  label,
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  let iconSize = 24;
  if (size === 'sm') iconSize = 16;
  if (size === 'lg') iconSize = 40;

  const content = (
    <div
      className={cn(
        'd-flex flex-column align-items-center justify-content-center gap-2',
        className
      )}
    >
      <Loader2 className="spinner-border-sm text-primary animate-spin" size={iconSize} />
      {label && <span className="text-muted small fw-medium">{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100 min-vh-100 bg-white"
        style={{ zIndex: 9999 }}
      >
        {content}
      </div>
    );
  }

  return content;
}
