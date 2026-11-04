'use client';

import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
        aria-live="polite"
      >
        {toasts.map(toast => {
          let bgClass = 'text-bg-primary';
          let Icon = Info;
          if (toast.type === 'success') {
            bgClass = 'text-bg-success';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            bgClass = 'text-bg-danger';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            bgClass = 'text-bg-warning';
            Icon = AlertCircle;
          }

          return (
            <div
              key={toast.id}
              className={`toast show align-items-center ${bgClass} border-0 mb-2 shadow-sm`}
              role="alert"
            >
              <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2">
                  <Icon size={18} />
                  <span>{toast.message}</span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  aria-label="Close"
                  onClick={() => removeToast(toast.id)}
                />
              </div>
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
