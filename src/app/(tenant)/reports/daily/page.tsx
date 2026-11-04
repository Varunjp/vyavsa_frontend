'use client';

import React, { useState } from 'react';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Download, Calendar, DollarSign, Wallet, TrendingUp } from 'lucide-react';

export default function DailyReportPage() {
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);

  const reportData = {
    date: reportDate,
    generatedAt: new Date().toISOString(),
    openingCash: 12500,
    cashSales: 28400,
    customerCollections: 15000,
    cashAdded: 5000,
    cashExpenses: 4200,
    supplierDisbursements: 12000,
    closingCash: 44700,
    totalLineSales: 68500,
    totalCounterSales: 32400,
    grossSalesRevenue: 100900,
    bankInflows: 45000,
    bankOutflows: 38000,
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ProtectedLayout>
      <PageHeader
        title="Daily Financial Settlement Report"
        description="Consolidated end-of-day reconciliation across drawer cash, multi-channel billing, and bank movements"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/dashboard?tab=reports' },
          { label: 'Daily Settlement' },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <Calendar size={14} className="text-muted" />
              </span>
              <input
                type="date"
                className="form-control form-control-sm"
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer size={15} />}
              onClick={handlePrint}
            >
              Print Report
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download size={15} />}>
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="row g-4">
        {/* Cash Drawer Breakdown */}
        <div className="col-lg-6">
          <Card
            title="Physical Cash Drawer Reconciliation"
            subtitle={`Closing statement for ${formatDate(reportData.date)}`}
          >
            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                <span className="text-muted">Opening Cash Balance</span>
                <span className="fw-semibold font-mono text-dark">
                  {formatCurrency(reportData.openingCash)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                <span>(+) Cash Collected from Counter Sales</span>
                <span className="fw-bold font-mono">{formatCurrency(reportData.cashSales)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                <span>(+) Customer Khata Collections</span>
                <span className="fw-bold font-mono">
                  {formatCurrency(reportData.customerCollections)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                <span>(+) Additional Drawer Cash Deposits</span>
                <span className="fw-bold font-mono">{formatCurrency(reportData.cashAdded)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-danger">
                <span>(-) Cash Operating Expenses</span>
                <span className="fw-bold font-mono">
                  ({formatCurrency(reportData.cashExpenses)})
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-danger">
                <span>(-) Supplier Cash Disbursements</span>
                <span className="fw-bold font-mono">
                  ({formatCurrency(reportData.supplierDisbursements)})
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-light border-top border-2 mt-2">
                <span className="fw-bold text-dark fs-6">Closing Drawer Cash Balance</span>
                <span className="fw-bold font-mono fs-6 text-primary">
                  {formatCurrency(reportData.closingCash)}
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Daily Sales & Revenue Performance */}
        <div className="col-lg-6">
          <Card
            title="Sales Velocity & Multi-Channel Billing"
            subtitle="Gross operational volume recorded today"
          >
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-3 bg-light rounded border">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                    <TrendingUp size={16} className="text-primary" />
                    <span>Line Distribution</span>
                  </div>
                  <h5 className="fw-bold font-mono text-dark mb-0">
                    {formatCurrency(reportData.totalLineSales)}
                  </h5>
                </div>
              </div>

              <div className="col-6">
                <div className="p-3 bg-light rounded border">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                    <Wallet size={16} className="text-success" />
                    <span>Counter Retail</span>
                  </div>
                  <h5 className="fw-bold font-mono text-dark mb-0">
                    {formatCurrency(reportData.totalCounterSales)}
                  </h5>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary-subtle rounded border border-primary-subtle d-flex align-items-center justify-content-between mb-4">
              <div>
                <span className="fw-bold text-primary small text-uppercase">
                  Cumulative Gross Turnover
                </span>
                <h4 className="fw-bold font-mono text-dark mb-0">
                  {formatCurrency(reportData.grossSalesRevenue)}
                </h4>
              </div>
              <DollarSign size={32} className="text-primary opacity-50" />
            </div>

            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span>Bank Account Collections (UPI/NEFT/Cheque):</span>
                <span className="font-mono text-dark fw-semibold">
                  {formatCurrency(reportData.bankInflows)}
                </span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span>Bank Settlement Outflows (Suppliers/Salaries):</span>
                <span className="font-mono text-dark fw-semibold">
                  ({formatCurrency(reportData.bankOutflows)})
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
