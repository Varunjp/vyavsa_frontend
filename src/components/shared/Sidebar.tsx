'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  CalendarCheck,
  FileText,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const isPlatform = pathname.startsWith('/platform');
  const role = user?.role || 'user';
  const isAdmin = role === 'admin';
  const isOfficeOrAdmin = role === 'admin' || role === 'office';

  const tenantNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'line-sales', label: 'Line Sales', icon: Truck, href: '/dashboard?tab=line-sales' },
    ...(isOfficeOrAdmin
      ? [
          {
            id: 'counter-sales',
            label: 'Counter Sales',
            icon: ShoppingCart,
            href: '/dashboard?tab=counter-sales',
          },
          {
            id: 'purchases',
            label: 'Purchases & Suppliers',
            icon: Receipt,
            href: '/dashboard?tab=purchases',
          },
          { id: 'expenses', label: 'Expenses', icon: DollarSign, href: '/dashboard?tab=expenses' },
          { id: 'cash-bank', label: 'Cash & Bank', icon: Wallet, href: '/dashboard?tab=cash-bank' },
          {
            id: 'attendance',
            label: 'Attendance & Payroll',
            icon: CalendarCheck,
            href: '/dashboard?tab=attendance',
          },
        ]
      : []),
    { id: 'customers', label: 'Customers & Dues', icon: Users, href: '/dashboard?tab=customers' },
    { id: 'parties', label: 'Unified Parties', icon: Building2, href: '/dashboard?tab=parties' },
    { id: 'reports', label: 'Daily Reports', icon: FileText, href: '/reports/daily' },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: CreditCard,
      href: '/dashboard?tab=subscription',
    },
    ...(isAdmin
      ? [{ id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard?tab=settings' }]
      : []),
  ];

  const platformNavItems = [
    { id: 'dashboard', label: 'Platform KPIs', icon: TrendingUp, href: '/platform/dashboard' },
    {
      id: 'tenants',
      label: 'Tenant Directory',
      icon: Building2,
      href: '/platform/dashboard?tab=tenants',
    },
    {
      id: 'plans',
      label: 'Subscription Plans',
      icon: CreditCard,
      href: '/platform/dashboard?tab=plans',
    },
    {
      id: 'subscriptions',
      label: 'Tenant Subscriptions',
      icon: ShieldCheck,
      href: '/platform/dashboard?tab=subscriptions',
    },
    {
      id: 'transactions',
      label: 'Billing Transactions',
      icon: Receipt,
      href: '/platform/dashboard?tab=transactions',
    },
  ];

  const items = isPlatform ? platformNavItems : tenantNavItems;

  return (
    <aside
      className="app-sidebar border-end bg-white d-flex flex-column"
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-2 px-4 py-3 border-bottom">
        <Image
          src="/images/logo.svg"
          alt="Vyavsa Logo"
          width={28}
          height={28}
          className="flex-shrink-0"
        />
        <div className="d-flex flex-column overflow-hidden">
          <span className="fw-bold text-dark fs-6 lh-sm text-truncate">
            {isPlatform ? 'Vyavsa Platform' : 'Vyavsa Bill Book'}
          </span>
          <span className="text-muted small text-uppercase" style={{ fontSize: '0.6875rem' }}>
            {isPlatform ? 'Super Admin' : user?.name || 'SaaS Workspace'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-auto py-3 px-2">
        <ul className="nav nav-pills flex-column gap-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive =
              (item.href === '/reports/daily' && pathname === '/reports/daily') ||
              (item.href === '/dashboard' &&
                pathname === '/dashboard' &&
                currentTab === 'overview') ||
              (item.href === '/platform/dashboard' &&
                pathname === '/platform/dashboard' &&
                currentTab === 'dashboard') ||
              (item.href.includes(`tab=${currentTab}`) &&
                pathname.includes(item.href.split('?')[0]));

            return (
              <li key={item.id} className="nav-item">
                <Link
                  href={item.href}
                  className={cn(
                    'nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2 fw-medium small transition-colors',
                    isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'
                  )}
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--color-text-main)',
                  }}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-muted'} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Footer */}
      <div className="p-3 border-top mt-auto bg-light">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, fontSize: '0.875rem' }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="d-flex flex-column overflow-hidden small">
            <span className="fw-semibold text-dark text-truncate">{user?.name || 'User'}</span>
            <span className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
              {user?.email || 'user@vyavsa.com'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
