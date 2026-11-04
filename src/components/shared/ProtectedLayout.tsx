'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPlatform = pathname.startsWith('/platform');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(isPlatform ? '/platform/login' : '/login');
    }
  }, [isLoading, isAuthenticated, router, isPlatform]);

  if (isLoading) {
    return <LoadingSpinner fullPage label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'platform_admin') {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
        <div className="card shadow-sm border-0 p-4 text-center max-w-md">
          <h4 className="text-danger fw-bold mb-2">Access Denied</h4>
          <p className="text-muted small mb-3">
            You do not possess the required role permissions ({requiredRole}) to view this resource.
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
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
