'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { TodayOverview } from '@/types';
import { Truck, ShoppingCart, Receipt, CalendarCheck } from 'lucide-react';

interface TodayOverviewCardProps {
  overview?: TodayOverview;
  isLoading: boolean;
}

export function TodayOverviewCard({ overview, isLoading }: TodayOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="card p-4 border rounded shadow-sm placeholder-glow mb-4">
        <span className="placeholder col-4 mb-3"></span>
        <div className="row g-3">
          <div className="col-3">
            <span className="placeholder col-12"></span>
          </div>
          <div className="col-3">
            <span className="placeholder col-12"></span>
          </div>
          <div className="col-3">
            <span className="placeholder col-12"></span>
          </div>
          <div className="col-3">
            <span className="placeholder col-12"></span>
          </div>
        </div>
      </div>
    );
  }

  const lineSale = Number(overview?.line_sale || 0);
  const counterSale = Number(overview?.counter_sale || 0);
  const employeeAdvance = Number(overview?.employee_advance || 0);
  const attendance = overview?.attendance;

  return (
    <Card
      title="Today's Pulse & Operations"
      subtitle={`Live operational tracking for ${overview?.date || 'today'}`}
      className="mb-4"
    >
      <div className="row g-3">
        <div className="col-sm-6 col-md-3">
          <div className="p-3 bg-light rounded border">
            <div className="d-flex align-items-center gap-2 mb-1 text-primary">
              <Truck size={18} />
              <span className="small fw-semibold">Line Distribution Sales</span>
            </div>
            <h4 className="fw-bold font-mono text-dark mb-0">{formatCurrency(lineSale)}</h4>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="p-3 bg-light rounded border">
            <div className="d-flex align-items-center gap-2 mb-1 text-success">
              <ShoppingCart size={18} />
              <span className="small fw-semibold">Retail Counter Sales</span>
            </div>
            <h4 className="fw-bold font-mono text-dark mb-0">{formatCurrency(counterSale)}</h4>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="p-3 bg-light rounded border">
            <div className="d-flex align-items-center gap-2 mb-1 text-info">
              <CalendarCheck size={18} />
              <span className="small fw-semibold">Staff Attendance</span>
            </div>
            <h4 className="fw-bold text-dark mb-0">
              {attendance?.present ?? 0}
              <span className="fs-6 text-muted fw-normal"> / {attendance?.total ?? 0} Present</span>
            </h4>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="p-3 bg-light rounded border">
            <div className="d-flex align-items-center gap-2 mb-1 text-secondary">
              <Receipt size={18} />
              <span className="small fw-semibold">Staff Advances Disbursed</span>
            </div>
            <h4 className="fw-bold font-mono text-dark mb-0">{formatCurrency(employeeAdvance)}</h4>
          </div>
        </div>
      </div>
    </Card>
  );
}
