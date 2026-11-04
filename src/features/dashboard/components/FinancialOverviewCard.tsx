'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { FinancialMetrics } from '@/types';
import { Wallet, Building2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface FinancialOverviewCardProps {
  metrics?: FinancialMetrics;
  isLoading: boolean;
}

export function FinancialOverviewCard({ metrics, isLoading }: FinancialOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="col-sm-6 col-xl-3">
            <div className="card p-4 border rounded shadow-sm placeholder-glow">
              <span className="placeholder col-6 mb-2"></span>
              <span className="placeholder col-8 fs-4"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cash = Number(metrics?.cash_balance || 0);
  const bank = Number(metrics?.bank_balance || 0);
  const receivable = Number(metrics?.total_receivable || 0);
  const payable = Number(metrics?.total_payable || 0);

  return (
    <div className="row g-3 mb-4">
      {/* Cash In Drawer */}
      <div className="col-sm-6 col-xl-3">
        <Card className="mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Drawer Cash</span>
              <h3 className="fw-bold text-dark mt-1 mb-0 font-mono">{formatCurrency(cash)}</h3>
              <span className="small text-muted">Authoritative drawer tally</span>
            </div>
            <div className="p-3 bg-success-subtle text-success rounded-3">
              <Wallet size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Bank Balances */}
      <div className="col-sm-6 col-xl-3">
        <Card className="mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Bank Balance</span>
              <h3 className="fw-bold text-dark mt-1 mb-0 font-mono">{formatCurrency(bank)}</h3>
              <span className="small text-muted">Across connected accounts</span>
            </div>
            <div className="p-3 bg-primary-subtle text-primary rounded-3">
              <Building2 size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Total Receivables (Customer Dues) */}
      <div className="col-sm-6 col-xl-3">
        <Card className="mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Khata Receivables</span>
              <h3 className="fw-bold text-danger mt-1 mb-0 font-mono">
                {formatCurrency(receivable)}
              </h3>
              <span className="small text-muted">Pending customer dues</span>
            </div>
            <div className="p-3 bg-danger-subtle text-danger rounded-3">
              <ArrowDownLeft size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Total Payables (Supplier Dues) */}
      <div className="col-sm-6 col-xl-3">
        <Card className="mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Supplier Payables</span>
              <h3 className="fw-bold text-warning mt-1 mb-0 font-mono">
                {formatCurrency(payable)}
              </h3>
              <span className="small text-muted">Pending purchase bills</span>
            </div>
            <div className="p-3 bg-warning-subtle text-warning rounded-3">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
