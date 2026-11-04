import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'd-flex flex-column align-items-center justify-content-center text-center p-5 border border-danger-subtle rounded-3 bg-danger-subtle',
        className
      )}
    >
      <div className="text-danger mb-3">
        <AlertCircle size={44} />
      </div>
      <h6 className="fw-bold text-danger mb-1">{title}</h6>
      <p className="text-muted small mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RotateCcw size={14} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
