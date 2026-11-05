'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, Bell, Menu, Plus, ShoppingCart, Calendar, ShieldCheck } from 'lucide-react';

export interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isPlatform = pathname.startsWith('/platform');

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="d-flex align-items-center gap-3">
        {onOpenSidebar && (
          <button
            type="button"
            className="btn btn-light btn-sm d-lg-none p-2 border"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="d-flex align-items-center gap-2">
          <span
            className="badge d-inline-flex align-items-center gap-1 px-2.5 py-1.5 border"
            style={{
              backgroundColor: isPlatform ? '#fef2f2' : '#eef2ff',
              color: isPlatform ? '#991b1b' : '#4338ca',
              borderColor: isPlatform ? '#fecaca' : '#c7d2fe',
              fontSize: '0.72rem',
            }}
          >
            <ShieldCheck size={13} />
            <span>{user?.role ? user.role.replace('_', ' ').toUpperCase() : 'CONNECTED'}</span>
          </span>

          <span className="d-none d-md-inline-flex align-items-center gap-1 text-muted small ms-2">
            <Calendar size={14} className="text-secondary" />
            <span className="fw-medium">{todayFormatted}</span>
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Quick Launch Actions for Tenant Workspace */}
        {!isPlatform && (
          <div className="d-none d-sm-flex align-items-center gap-2 me-1">
            <Link
              href="/dashboard?tab=counter-sales"
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
            >
              <ShoppingCart size={14} className="text-success" />
              <span>POS Sale</span>
            </Link>
            <Link
              href="/dashboard?tab=line-sales"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
            >
              <Plus size={14} />
              <span>Line Invoice</span>
            </Link>
          </div>
        )}

        <button
          type="button"
          className="btn btn-light rounded-circle p-2 text-secondary position-relative border"
          style={{ width: 36, height: 36 }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"
            style={{ width: 8, height: 8 }}
          >
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        <div className="d-flex align-items-center gap-2 border-start ps-3">
          <div className="d-none d-md-flex flex-column text-end me-1">
            <span className="fw-bold text-dark lh-sm" style={{ fontSize: '0.8125rem' }}>
              {user?.name || 'Active User'}
            </span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
              {user?.email || 'Authenticated Session'}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut size={14} />}
            aria-label="Logout"
          >
            <span className="d-none d-sm-inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
