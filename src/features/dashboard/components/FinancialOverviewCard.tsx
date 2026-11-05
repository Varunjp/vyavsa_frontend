'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { FinancialMetrics } from '@/types';
import {
  Wallet,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Package,
  CalendarCheck,
  Users,
  ChevronRight,
} from 'lucide-react';

export interface FinancialOverviewCardProps {
  metrics?: FinancialMetrics;
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function FinancialOverviewCard({
  metrics,
  isLoading,
  error,
  onRetry,
}: FinancialOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="placeholder col-3 rounded py-2"></span>
        </div>
        <div className="row g-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className="col-12 col-sm-6 col-xl-3">
              <div className="kpi-stat-card placeholder-glow h-100">
                <span className="placeholder col-6 mb-2 rounded d-block"></span>
                <span className="placeholder col-8 fs-4 rounded d-block mb-3"></span>
                <div className="pt-2 border-top">
                  <span className="placeholder col-5 rounded"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 mb-4">
        <div>
          <strong>Failed to load financial overview metrics.</strong>
          <div className="small text-muted">{error.message || 'Network or server issue'}</div>
        </div>
        {onRetry && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  // Authoritative metrics mapping
  const cash = Number(metrics?.cash_balance ?? 0);
  const bank = Number(metrics?.bank_balance ?? 0);
  const receivable = Number(metrics?.total_receivable ?? 0);
  const payable = Number(metrics?.total_payable ?? 0);
  const purchases = Number(metrics?.today_stats?.purchase_amount ?? 0);
  const expenses = Number(metrics?.today_stats?.expense_amount ?? 0);
  const advance = Number(
    metrics?.today_stats?.advance_amount ?? metrics?.today_overview?.employee_advance ?? 0
  );
  const pendingSalary = Number(metrics?.pending_salary ?? 0);

  const cards = [
    {
      id: 'cash-balance',
      label: 'Cash Balance',
      value: formatCurrency(cash),
      sub: 'Physical drawer cash tally',
      icon: Wallet,
      accent: '#10b981',
      bg: '#ecfdf5',
      pill: 'Drawer Tally',
      href: '/dashboard?tab=cash-bank',
    },
    {
      id: 'bank-balance',
      label: 'Bank Balance',
      value: formatCurrency(bank),
      sub: 'Connected commercial banks',
      icon: Building2,
      accent: '#4f46e5',
      bg: '#eef2ff',
      pill: 'Commercial Banks',
      href: '/dashboard?tab=cash-bank',
    },
    {
      id: 'pending-receivables',
      label: 'Pending Receivables',
      value: formatCurrency(receivable),
      sub: 'Customer ledger dues to collect',
      icon: ArrowDownLeft,
      accent: '#0ea5e9',
      bg: '#f0f9ff',
      pill: 'Customer Khata',
      href: '/dashboard?tab=customers',
    },
    {
      id: 'outstanding-payable',
      label: 'Outstanding Payable',
      value: formatCurrency(payable),
      sub: 'Supplier khata bills owed',
      icon: ArrowUpRight,
      accent: '#f59e0b',
      bg: '#fffbeb',
      pill: 'Vendor Bills',
      href: '/dashboard?tab=purchases',
    },
    {
      id: 'total-purchases',
      label: 'Total Purchases',
      value: formatCurrency(purchases),
      sub: 'Stock intake & procurement today',
      icon: Package,
      accent: '#0284c7',
      bg: '#f0f9ff',
      pill: 'Procurement',
      href: '/dashboard?tab=purchases',
    },
    {
      id: 'total-expenses',
      label: 'Total Expenses',
      value: formatCurrency(expenses),
      sub: 'Overhead & utilities today',
      icon: DollarSign,
      accent: '#ef4444',
      bg: '#fef2f2',
      pill: 'Overheads',
      href: '/dashboard?tab=expenses',
    },
    {
      id: 'employee-advance',
      label: 'Total Employee Advance',
      value: formatCurrency(advance),
      sub: 'Staff advances disbursed today',
      icon: Users,
      accent: '#8b5cf6',
      bg: '#f5f3ff',
      pill: 'Workforce',
      href: '/dashboard?tab=attendance',
    },
    {
      id: 'pending-salary',
      label: 'Pending Staff Salary',
      value: formatCurrency(pendingSalary),
      sub: 'Outstanding unpaid payroll',
      icon: CalendarCheck,
      accent: '#d97706',
      bg: '#fffbeb',
      pill: 'Payroll Due',
      href: '/dashboard?tab=attendance',
    },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-dark mb-0" style={{ fontSize: '1.05rem' }}>
            Financial Overview
          </h4>
          <span className="text-muted small">
            Authoritative physical liquidity, khata receivables, payables, and payroll
          </span>
        </div>
      </div>

      <div className="row g-3">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.id} className="col-12 col-sm-6 col-xl-3">
              <Link
                href={c.href}
                className="text-decoration-none d-block h-100"
                aria-label={`View details for ${c.label}`}
              >
                <div
                  className="kpi-stat-card vyavsa-card-interactive h-100 d-flex flex-column justify-content-between"
                  style={{ borderTop: `3px solid ${c.accent}` }}
                >
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div className="overflow-hidden">
                      <span
                        className="text-muted fw-bold text-uppercase text-truncate d-block"
                        style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}
                      >
                        {c.label}
                      </span>
                      <h3
                        className="fw-extrabold text-dark mt-1 mb-0 font-mono text-truncate"
                        style={{ fontSize: '1.35rem' }}
                      >
                        {c.value}
                      </h3>
                    </div>
                    <div
                      className="kpi-icon-box"
                      style={{ backgroundColor: c.bg, color: c.accent }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2">
                    <span className="text-muted text-truncate" style={{ fontSize: '0.74rem' }}>
                      {c.sub}
                    </span>
                    <span
                      className="badge rounded-pill flex-shrink-0 d-inline-flex align-items-center gap-0.5"
                      style={{
                        backgroundColor: c.bg,
                        color: c.accent,
                        fontSize: '0.65rem',
                      }}
                    >
                      <span>{c.pill}</span>
                      <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
