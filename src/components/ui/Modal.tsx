'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let sizeClass = '';
  if (size === 'sm') sizeClass = 'modal-sm';
  if (size === 'lg') sizeClass = 'modal-lg';
  if (size === 'xl') sizeClass = 'modal-xl';

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={onClose} />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1055 }}
      >
        <div
          className={cn('modal-dialog modal-dialog-centered animate-scale-in', sizeClass)}
          role="document"
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {title && (
              <div
                className="modal-header bg-white px-4 py-3 d-flex align-items-center justify-content-between"
                style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
              >
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
                    {title}
                  </h5>
                  {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  className="btn btn-light btn-sm rounded-circle p-1 d-inline-flex align-items-center justify-content-center text-muted"
                  style={{ width: 32, height: 32 }}
                  aria-label="Close"
                  onClick={onClose}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="modal-body p-4">{children}</div>
            {footer && (
              <div
                className="modal-footer bg-light px-4 py-3"
                style={{ borderTop: '1px solid var(--color-border-subtle)' }}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
