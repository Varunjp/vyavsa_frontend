'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

export interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPlatform = pathname.startsWith('/platform');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(isPlatform ? '/platform/login' : '/login');
    }
  }, [isLoading, isAuthenticated, router, isPlatform]);

  if (isLoading) {
    return <LoadingSpinner fullPage label="Authenticating workspace session..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'platform_admin') {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
        <div className="card vyavsa-card p-5 text-center" style={{ maxWidth: 440 }}>
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mx-auto mb-3"
            style={{ width: 56, height: 56 }}
          >
            <ShieldAlert size={28} />
          </div>
          <h4 className="fw-bold text-dark mb-2">Restricted Access</h4>
          <p className="text-muted small mb-4">
            Your current role does not include permission (<code>{requiredRole}</code>) to view this
            section.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="app-content animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
