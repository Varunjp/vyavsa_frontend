'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { TenantOverviewTab } from '@/features/dashboard/components/TenantOverviewTab';
import { LineSalesTab } from '@/features/sales/components/LineSalesTab';
import { CounterSalesTab } from '@/features/sales/components/CounterSalesTab';
import { PurchasesSuppliersTab } from '@/features/purchases/components/PurchasesSuppliersTab';
import { CustomersTab } from '@/features/customers/components/CustomersTab';
import { PartiesTab } from '@/features/parties/components/PartiesTab';
import { CashBankTab } from '@/features/cash-bank/components/CashBankTab';
import { AttendancePayrollTab } from '@/features/employees/components/AttendancePayrollTab';
import { ExpensesTab } from '@/features/expenses/components/ExpensesTab';
import { SubscriptionTab } from '@/features/subscription/components/SubscriptionTab';
import { SettingsTab } from '@/features/settings/components/SettingsTab';
import { FileText } from 'lucide-react';

export default function TenantDashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const tabTitles: Record<string, { title: string; desc: string }> = {
    overview: {
      title: 'Financial & Operational Overview',
      desc: 'Authoritative physical cash balances, multi-bank accounts, and khata receivables',
    },
    'line-sales': {
      title: 'Field Distribution Line Sales',
      desc: 'Route deliveries, salesman tracking, split payments, and PDF receipts',
    },
    'counter-sales': {
      title: 'Point-of-Sale Counter Retail',
      desc: 'Walk-in cash and split counter sales with instant receipt generation',
    },
    purchases: {
      title: 'Inventory Procurement & Suppliers',
      desc: 'Vendor stock purchases, supplier statements, and settlement disbursements',
    },
    customers: {
      title: 'Customer Khata & Receivables',
      desc: 'Customer collection ledger, unallocated customer advances, dues aging, and advance-to-due settlement',
    },
    parties: {
      title: 'Unified Parties & Contra Settlements',
      desc: 'Dual-role customer-suppliers and automated mutual dues contra offset',
    },
    'cash-bank': {
      title: 'Cash Drawer & Multi-Bank Governance',
      desc: 'Physical cash drawer balancing with audit trail, and bank account reconciliation',
    },
    attendance: {
      title: 'Staff Attendance & Payroll',
      desc: 'Daily attendance shifts, overtime tracking, salary advances, and monthly payroll disbursements',
    },
    expenses: {
      title: 'Operating Expenses',
      desc: 'Track shop utilities, rent, vehicle fuel, and daily overhead disbursements',
    },
    subscription: {
      title: 'Workspace Subscription & Billing',
      desc: 'Manage your active subscription plan, billing cycle, and official receipts',
    },
    settings: {
      title: 'Organization Settings & Team',
      desc: 'Business profile, company branding logo, and staff RBAC access management',
    },
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.overview;

  return (
    <ProtectedLayout>
      <PageHeader
        title={currentMeta.title}
        description={currentMeta.desc}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Link
              href="/reports/daily"
              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
            >
              <FileText size={15} />
              <span>Financial Reports</span>
            </Link>
          </div>
        }
      />

      {currentTab === 'overview' && <TenantOverviewTab />}
      {currentTab === 'line-sales' && <LineSalesTab />}
      {currentTab === 'counter-sales' && <CounterSalesTab />}
      {currentTab === 'purchases' && <PurchasesSuppliersTab />}
      {currentTab === 'customers' && <CustomersTab />}
      {currentTab === 'parties' && <PartiesTab />}
      {currentTab === 'cash-bank' && <CashBankTab />}
      {currentTab === 'attendance' && <AttendancePayrollTab />}
      {currentTab === 'expenses' && <ExpensesTab />}
      {currentTab === 'subscription' && <SubscriptionTab />}
      {currentTab === 'settings' && <SettingsTab />}
    </ProtectedLayout>
  );
}
