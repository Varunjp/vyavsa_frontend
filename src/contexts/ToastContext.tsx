'use client';

import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3 d-flex flex-column gap-2"
        style={{ zIndex: 9999, maxWidth: '400px', width: '100%' }}
        aria-live="polite"
      >
        {toasts.map(toast => {
          let Icon = Info;
          let accentColor = '#4f46e5';
          let badgeBg = '#eef2ff';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            accentColor = '#10b981';
            badgeBg = '#ecfdf5';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            accentColor = '#ef4444';
            badgeBg = '#fef2f2';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            accentColor = '#f59e0b';
            badgeBg = '#fffbeb';
          }

          return (
            <div
              key={toast.id}
              className="d-flex align-items-center justify-content-between gap-3 bg-white p-3 rounded-3 shadow-lg border animate-fade-in"
              style={{
                borderLeft: `4px solid ${accentColor}`,
              }}
              role="alert"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: badgeBg,
                    color: accentColor,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="small fw-semibold text-dark">{toast.message}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-muted p-1 text-decoration-none"
                aria-label="Close"
                onClick={() => removeToast(toast.id)}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
