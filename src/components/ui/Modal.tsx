'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
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
        <div className={cn('modal-dialog modal-dialog-centered', sizeClass)} role="document">
          <div className="modal-content shadow border-0" onClick={e => e.stopPropagation()}>
            {title && (
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fs-5 fw-bold text-dark">{title}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
            )}
            <div className="modal-body p-4">{children}</div>
            {footer && <div className="modal-footer border-top bg-light p-3">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
