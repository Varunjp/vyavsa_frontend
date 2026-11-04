'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet,
  Building2,
  Receipt,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  FileText,
  Truck,
  ShoppingCart,
} from 'lucide-react';

export default function TenantDashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  // Financial Summary State
  const financialSummary = {
    cashBalance: 42850,
    bankBalance: 185600,
    totalReceivable: 98450,
    totalPayable: 34200,
  };

  // Recent operational transactions
  const recentTransactions = [
    {
      id: 'tx-1',
      date: 'Today, 11:30 AM',
      type: 'Line Sale',
      entity: 'Green Valley Grocers',
      amount: 14500,
      paymentMethod: 'Split (Cash + Bank)',
      status: 'Paid',
    },
    {
      id: 'tx-2',
      date: 'Today, 10:15 AM',
      type: 'Counter Sale',
      entity: 'Walk-in Retail Customer',
      amount: 850,
      paymentMethod: 'Cash',
      status: 'Paid',
    },
    {
      id: 'tx-3',
      date: 'Yesterday',
      type: 'Supplier Purchase',
      entity: 'Apex Agro Products Ltd',
      amount: 22000,
      paymentMethod: 'Bank Transfer',
      status: 'Settled',
    },
    {
      id: 'tx-4',
      date: 'Yesterday',
      type: 'Customer Advance',
      entity: 'Kiran Provision Stores',
      amount: 5000,
      paymentMethod: 'UPI',
      status: 'Unallocated',
    },
    {
      id: 'tx-5',
      date: '02 Nov 2026',
      type: 'Operational Expense',
      entity: 'Store Electricity Bill',
      amount: 3200,
      paymentMethod: 'Cash',
      status: 'Cleared',
    },
  ];

  return (
    <ProtectedLayout>
      <PageHeader
        title={
          currentTab === 'overview'
            ? 'Business Operations & Financial Summary'
            : currentTab.replace('-', ' ').toUpperCase()
        }
        description="Real-time multi-channel sales, counter billing, cash reconciliation, and khata dues"
        actions={
          <div className="d-flex align-items-center gap-2">
            <Link
              href="/reports/daily"
              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
            >
              <FileText size={16} />
              <span>Daily Report</span>
            </Link>
            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
              Create Sale
            </Button>
          </div>
        }
      />

      {/* Financial Health Summary Cards */}
      <div className="row g-3 mb-4">
        {/* Cash in Drawer */}
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Cash in Drawer</span>
                <h4 className="fw-bold text-dark mt-1 mb-0 font-mono">
                  {formatCurrency(financialSummary.cashBalance)}
                </h4>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <Wallet size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Bank Balances */}
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Bank Accounts</span>
                <h4 className="fw-bold text-dark mt-1 mb-0 font-mono">
                  {formatCurrency(financialSummary.bankBalance)}
                </h4>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <Building2 size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Outstanding Receivables */}
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Customer Dues (Receivable)
                </span>
                <h4 className="fw-bold text-warning mt-1 mb-0 font-mono">
                  {formatCurrency(financialSummary.totalReceivable)}
                </h4>
              </div>
              <div className="p-3 bg-warning-subtle text-warning rounded-3">
                <ArrowDownLeft size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Outstanding Payables */}
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Supplier Payables
                </span>
                <h4 className="fw-bold text-danger mt-1 mb-0 font-mono">
                  {formatCurrency(financialSummary.totalPayable)}
                </h4>
              </div>
              <div className="p-3 bg-danger-subtle text-danger rounded-3">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="p-3 bg-white rounded border d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-xs">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold small text-dark">Quick Operations:</span>
              <span className="text-muted small d-none d-md-inline">
                Fast entry for high-volume transactions
              </span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="outline" size="sm" leftIcon={<Truck size={14} />}>
                Line Sale Invoice
              </Button>
              <Button variant="outline" size="sm" leftIcon={<ShoppingCart size={14} />}>
                Counter POS Sale
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Receipt size={14} />}>
                Supplier Purchase
              </Button>
              <Button variant="outline" size="sm" leftIcon={<DollarSign size={14} />}>
                Add Cash Drawer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Activity Table */}
      <Card
        title="Recent Billing & Financial Activities"
        subtitle="Live audit trail of sales, purchases, and cash transactions"
        action={
          <Button variant="ghost" size="sm">
            View All Transactions &rarr;
          </Button>
        }
      >
        <DataTable
          columns={[
            {
              key: 'date',
              header: 'Date & Time',
              className: 'text-muted small font-mono',
            },
            {
              key: 'type',
              header: 'Activity Type',
              render: item => (
                <span className="badge bg-light text-dark border px-2 py-1">{item.type}</span>
              ),
            },
            {
              key: 'entity',
              header: 'Customer / Supplier / Entity',
              render: item => <span className="fw-semibold text-dark">{item.entity}</span>,
            },
            {
              key: 'amount',
              header: 'Amount',
              align: 'right',
              render: item => (
                <span className="fw-bold font-mono text-dark">{formatCurrency(item.amount)}</span>
              ),
            },
            {
              key: 'paymentMethod',
              header: 'Method',
              className: 'text-muted small',
            },
            {
              key: 'status',
              header: 'Status',
              align: 'center',
              render: item => (
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  {item.status}
                </span>
              ),
            },
          ]}
          data={recentTransactions}
          keyExtractor={item => item.id}
        />
      </Card>
    </ProtectedLayout>
  );
}
