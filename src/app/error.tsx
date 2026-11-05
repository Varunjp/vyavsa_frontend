'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error captured in global boundary:', error);
  }, [error]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-sm border-0 p-5 text-center" style={{ maxWidth: 480 }}>
        <div className="text-danger mb-3">
          <AlertTriangle size={52} className="mx-auto" />
        </div>
        <h3 className="fw-bold text-dark mb-2">Unexpected Application Error</h3>
        <p className="text-muted small mb-4">
          {error.message || 'An unhandled exception occurred while rendering this view.'}
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="primary" leftIcon={<RotateCcw size={16} />} onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
