'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Bell } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header bg-white border-bottom px-4 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <span className="badge bg-light text-dark border px-2 py-1 small fw-medium">
          {user?.role ? `Role: ${user.role.toUpperCase()}` : 'Connected'}
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light rounded-circle p-2 text-muted position-relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        <div className="d-flex align-items-center gap-2 border-start ps-3">
          <div className="d-flex align-items-center gap-2 text-dark small fw-medium">
            <User size={16} className="text-muted" />
            <span className="d-none d-md-inline">{user?.name || user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut size={16} />}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
