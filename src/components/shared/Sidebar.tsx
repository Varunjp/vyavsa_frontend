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
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    href: string;
    badge?: string;
  }>;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();

  const isPlatform = pathname.startsWith('/platform');
  const role = user?.role || 'user';
  const isAdmin = role === 'admin';
  const isOfficeOrAdmin = role === 'admin' || role === 'office';

  const tenantGroups: NavGroup[] = [
    {
      label: 'Command Center',
      items: [
        { id: 'overview', label: 'Financial Overview', icon: LayoutDashboard, href: '/dashboard' },
        { id: 'reports', label: 'Daily Settlements', icon: FileText, href: '/reports/daily' },
      ],
    },
    {
      label: 'Sales & Billing',
      items: [
        {
          id: 'line-sales',
          label: 'Line Distribution',
          icon: Truck,
          href: '/dashboard?tab=line-sales',
          badge: 'Route',
        },
        ...(isOfficeOrAdmin
          ? [
              {
                id: 'counter-sales',
                label: 'POS Counter Sales',
                icon: ShoppingCart,
                href: '/dashboard?tab=counter-sales',
              },
            ]
          : []),
      ],
    },
    {
      label: 'Khata & Ledger',
      items: [
        {
          id: 'customers',
          label: 'Customers & Dues',
          icon: Users,
          href: '/dashboard?tab=customers',
        },
        {
          id: 'parties',
          label: 'Unified Parties & Contra',
          icon: Building2,
          href: '/dashboard?tab=parties',
        },
        ...(isOfficeOrAdmin
          ? [
              {
                id: 'purchases',
                label: 'Purchases & Suppliers',
                icon: Receipt,
                href: '/dashboard?tab=purchases',
              },
            ]
          : []),
      ],
    },
    ...(isOfficeOrAdmin
      ? [
          {
            label: 'Treasury & Workforce',
            items: [
              {
                id: 'cash-bank',
                label: 'Cash Drawer & Banks',
                icon: Wallet,
                href: '/dashboard?tab=cash-bank',
              },
              {
                id: 'expenses',
                label: 'Operating Expenses',
                icon: DollarSign,
                href: '/dashboard?tab=expenses',
              },
              {
                id: 'attendance',
                label: 'Attendance & Payroll',
                icon: CalendarCheck,
                href: '/dashboard?tab=attendance',
              },
            ],
          },
        ]
      : []),
    {
      label: 'Organization',
      items: [
        {
          id: 'subscription',
          label: 'Plan & Billing',
          icon: CreditCard,
          href: '/dashboard?tab=subscription',
        },
        ...(isAdmin
          ? [
              {
                id: 'settings',
                label: 'Workspace Settings',
                icon: Settings,
                href: '/dashboard?tab=settings',
              },
            ]
          : []),
      ],
    },
  ];

  const platformGroups: NavGroup[] = [
    {
      label: 'Platform Governance',
      items: [
        { id: 'dashboard', label: 'Platform KPIs', icon: TrendingUp, href: '/platform/dashboard' },
        {
          id: 'tenants',
          label: 'Tenant Directory',
          icon: Building2,
          href: '/platform/dashboard?tab=tenants',
        },
      ],
    },
    {
      label: 'Monetization & Billing',
      items: [
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
          label: 'Gateway Transactions',
          icon: Receipt,
          href: '/platform/dashboard?tab=transactions',
        },
      ],
    },
  ];

  const groups = isPlatform ? platformGroups : tenantGroups;

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1035, backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={cn('app-sidebar', isOpen && 'sidebar-open')}
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', height: 68 }}
        >
          <div className="d-flex align-items-center gap-3 overflow-hidden">
            <Image
              src="/images/logo.svg"
              alt="Vyavsa Logo"
              width={34}
              height={34}
              className="flex-shrink-0 rounded-2"
            />
            <div className="d-flex flex-column overflow-hidden">
              <span
                className="fw-extrabold text-white text-truncate"
                style={{ fontSize: '0.96rem', letterSpacing: '-0.02em' }}
              >
                {isPlatform ? 'Vyavsa Cloud' : 'Vyavsa Bill Book'}
              </span>
              <span
                className="text-truncate d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}
              >
                <span
                  className="rounded-circle d-inline-block"
                  style={{ width: 6, height: 6, backgroundColor: '#10b981' }}
                />
                {isPlatform ? 'SUPER ADMIN PORTAL' : user?.name || 'LIVE WORKSPACE'}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              className="btn btn-sm text-white d-lg-none p-1"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-grow-1 overflow-auto py-2 px-3">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="mb-2">
              <div className="sidebar-nav-group-label">{group.label}</div>
              <ul className="nav flex-column gap-1">
                {group.items.map(item => {
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
                        onClick={onClose}
                        className={cn('sidebar-link', isActive && 'active')}
                      >
                        <Icon
                          size={17}
                          className={isActive ? 'text-white' : 'text-secondary'}
                        />
                        <span className="flex-grow-1 text-truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              fontSize: '0.625rem',
                              backgroundColor: isActive
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(99, 102, 241, 0.16)',
                              color: isActive ? '#ffffff' : '#a5b4fc',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Workspace Card & User Profile */}
        <div
          className="p-3 mt-auto"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.2)' }}
        >
          {!isPlatform && (
            <div
              className="p-2 px-3 mb-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{
                background:
                  'linear-gradient(135deg, rgba(79, 70, 229, 0.22) 0%, rgba(16, 185, 129, 0.12) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.28)',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={14} style={{ color: '#a5b4fc' }} />
                <span style={{ fontSize: '0.73rem', color: '#e2e8f0', fontWeight: 600 }}>
                  Real-Time Khata Sync
                </span>
              </div>
              <span
                className="badge rounded-pill"
                style={{ fontSize: '0.62rem', backgroundColor: '#10b981', color: '#fff' }}
              >
                2026
              </span>
            </div>
          )}

          <div className="d-flex align-items-center gap-2 px-1">
            <div
              className="rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0 text-white"
              style={{
                width: 36,
                height: 36,
                fontSize: '0.85rem',
                background: 'var(--gradient-primary)',
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="d-flex flex-column overflow-hidden">
              <span className="fw-semibold text-white text-truncate" style={{ fontSize: '0.82rem' }}>
                {user?.name || 'Workspace Operator'}
              </span>
              <span className="text-truncate" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {user?.email || 'operator@vyavsa.com'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
