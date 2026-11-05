'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesService } from '@/features/sales/services/salesService';
import { formatCurrency, getTodayDateString } from '@/lib/utils';
import { Truck, ShoppingCart, BarChart3, ArrowRight, Eye } from 'lucide-react';
import { LineSaleBreakdownModal } from './LineSaleBreakdownModal';
import { CounterSaleBreakdownModal } from './CounterSaleBreakdownModal';
import { TodayOverview } from '@/types';

export interface TodaySalesOverviewProps {
  todayOverview?: TodayOverview;
  isLoading: boolean;
  date?: string;
}

export function TodaySalesOverview({ todayOverview, isLoading, date }: TodaySalesOverviewProps) {
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  const effectiveDate = date || todayOverview?.date || getTodayDateString();

  // Fetch breakdown queries to get authoritative transaction counts and payment splits
  const { data: lineBreakdown, isLoading: isLineBreakdownLoading } = useQuery({
    queryKey: ['line-sales-breakdown-card', effectiveDate],
    queryFn: () => salesService.getLineSaleBreakdown({ date: effectiveDate }),
  });

  const { data: counterBreakdown, isLoading: isCounterBreakdownLoading } = useQuery({
    queryKey: ['counter-sales-breakdown-card', effectiveDate],
    queryFn: () => salesService.getCounterSaleBreakdown({ date: effectiveDate }),
  });

  // Calculate figures
  const lineAmount = Number(lineBreakdown?.total_sales ?? todayOverview?.line_sale ?? 0);
  const lineTxnCount = Number(lineBreakdown?.sales_count ?? 0);
  const lineCash = Number(lineBreakdown?.cash_received ?? 0);
  const lineBank = Number(lineBreakdown?.bank_received ?? 0);

  const counterAmount = Number(counterBreakdown?.total_sales ?? todayOverview?.counter_sale ?? 0);
  const counterTxnCount = Number(counterBreakdown?.sales_count ?? 0);
  const counterCash = Number(counterBreakdown?.cash_received ?? 0);
  const counterBank = Number(counterBreakdown?.bank_received ?? 0);

  if (isLoading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2].map(idx => (
          <div key={idx} className="col-lg-6">
            <div className="card vyavsa-card p-4 placeholder-glow h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="placeholder col-4 rounded py-2"></span>
                <span className="placeholder col-2 rounded py-2"></span>
              </div>
              <span className="placeholder col-6 rounded py-3 mb-3"></span>
              <div className="d-flex gap-2">
                <span className="placeholder col-4 rounded py-2"></span>
                <span className="placeholder col-3 rounded py-2"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="row g-3 mb-4">
        {/* Card 1: Today's Line Sales */}
        <div className="col-lg-6">
          <div
            className="card vyavsa-card vyavsa-card-interactive p-4 h-100 position-relative"
            style={{
              borderLeft: '4px solid #4f46e5',
              cursor: 'pointer',
            }}
            onClick={() => setIsLineModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsLineModalOpen(true);
              }
            }}
            aria-label="View Today's Line Sales breakdown"
          >
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: '#eef2ff', color: '#4f46e5' }}
                >
                  <Truck size={24} />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}
                    >
                      Today&apos;s Line Sales
                    </span>
                    <span
                      className="badge rounded-pill bg-primary-subtle text-primary fw-semibold"
                      style={{ fontSize: '0.65rem' }}
                    >
                      Route Deliveries
                    </span>
                  </div>
                  <h3
                    className="fw-extrabold text-dark mt-1 mb-0 font-mono"
                    style={{ fontSize: '1.75rem' }}
                  >
                    {formatCurrency(lineAmount)}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                onClick={e => {
                  e.stopPropagation();
                  setIsLineModalOpen(true);
                }}
              >
                <Eye size={14} />
                <span className="fw-semibold" style={{ fontSize: '0.78rem' }}>
                  View Breakdown
                </span>
              </button>
            </div>

            {/* Sub-indicators: Transaction count & collected payment split */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 border-top mt-auto gap-2">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge bg-light text-dark border font-mono px-2.5 py-1.5"
                  style={{ fontSize: '0.75rem' }}
                >
                  <BarChart3 size={13} className="text-primary me-1 d-inline" />
                  <strong>{isLineBreakdownLoading ? '...' : lineTxnCount}</strong>{' '}
                  {lineTxnCount === 1 ? 'Transaction' : 'Transactions'}
                </span>
                {(lineCash > 0 || lineBank > 0) && (
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Cash:{' '}
                    <strong className="text-dark font-mono">{formatCurrency(lineCash)}</strong>
                    {lineBank > 0 && (
                      <>
                        {' · '}Bank:{' '}
                        <strong className="text-dark font-mono">{formatCurrency(lineBank)}</strong>
                      </>
                    )}
                  </span>
                )}
              </div>

              <span className="text-primary small fw-semibold d-inline-flex align-items-center gap-1">
                <span>View Details</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Counter Sales */}
        <div className="col-lg-6">
          <div
            className="card vyavsa-card vyavsa-card-interactive p-4 h-100 position-relative"
            style={{
              borderLeft: '4px solid #10b981',
              cursor: 'pointer',
            }}
            onClick={() => setIsCounterModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsCounterModalOpen(true);
              }
            }}
            aria-label="View Today's Counter Sales breakdown"
          >
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: '#ecfdf5', color: '#10b981' }}
                >
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="text-muted fw-bold text-uppercase"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}
                    >
                      Today&apos;s Counter Sales
                    </span>
                    <span
                      className="badge rounded-pill bg-success-subtle text-success fw-semibold"
                      style={{ fontSize: '0.65rem' }}
                    >
                      Retail POS
                    </span>
                  </div>
                  <h3
                    className="fw-extrabold text-dark mt-1 mb-0 font-mono"
                    style={{ fontSize: '1.75rem' }}
                  >
                    {formatCurrency(counterAmount)}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                onClick={e => {
                  e.stopPropagation();
                  setIsCounterModalOpen(true);
                }}
              >
                <Eye size={14} />
                <span className="fw-semibold" style={{ fontSize: '0.78rem' }}>
                  View Breakdown
                </span>
              </button>
            </div>

            {/* Sub-indicators: Transaction count & collected payment split */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 border-top mt-auto gap-2">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge bg-light text-dark border font-mono px-2.5 py-1.5"
                  style={{ fontSize: '0.75rem' }}
                >
                  <BarChart3 size={13} className="text-success me-1 d-inline" />
                  <strong>{isCounterBreakdownLoading ? '...' : counterTxnCount}</strong>{' '}
                  {counterTxnCount === 1 ? 'Transaction' : 'Transactions'}
                </span>
                {(counterCash > 0 || counterBank > 0) && (
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Cash:{' '}
                    <strong className="text-dark font-mono">{formatCurrency(counterCash)}</strong>
                    {counterBank > 0 && (
                      <>
                        {' · '}Bank:{' '}
                        <strong className="text-dark font-mono">
                          {formatCurrency(counterBank)}
                        </strong>
                      </>
                    )}
                  </span>
                )}
              </div>

              <span className="text-success small fw-semibold d-inline-flex align-items-center gap-1">
                <span>View Details</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Sales Breakdown Modal */}
      <LineSaleBreakdownModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        date={effectiveDate}
      />

      {/* Counter Sales Breakdown Modal */}
      <CounterSaleBreakdownModal
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        date={effectiveDate}
      />
    </>
  );
}
