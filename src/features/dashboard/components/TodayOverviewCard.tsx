'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { TodayOverview } from '@/types';
import { Truck, ShoppingCart, Receipt, CalendarCheck, Activity } from 'lucide-react';

interface TodayOverviewCardProps {
  overview?: TodayOverview;
  isLoading: boolean;
}

export function TodayOverviewCard({ overview, isLoading }: TodayOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="card vyavsa-card p-4 placeholder-glow mb-4">
        <span className="placeholder col-4 mb-3 rounded"></span>
        <div className="row g-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="col-sm-6 col-md-3">
              <span className="placeholder col-12 py-4 rounded"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const lineSale = Number(overview?.line_sale || 0);
  const counterSale = Number(overview?.counter_sale || 0);
  const employeeAdvance = Number(overview?.employee_advance || 0);
  const attendance = overview?.attendance;

  const items = [
    {
      label: 'Line Distribution Sales',
      value: formatCurrency(lineSale),
      icon: Truck,
      accent: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      label: 'Retail Counter Sales',
      value: formatCurrency(counterSale),
      icon: ShoppingCart,
      accent: '#10b981',
      bg: '#ecfdf5',
    },
    {
      label: 'Staff Shift Attendance',
      value: `${attendance?.present ?? 0} / ${attendance?.total ?? 0}`,
      suffix: 'Present',
      icon: CalendarCheck,
      accent: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      label: 'Staff Advances Disbursed',
      value: formatCurrency(employeeAdvance),
      icon: Receipt,
      accent: '#f59e0b',
      bg: '#fffbeb',
    },
  ];

  return (
    <Card
      title={
        <div className="d-flex align-items-center gap-2">
          <Activity size={18} className="text-primary" />
          <span>Today&apos;s Operational Pulse</span>
        </div>
      }
      subtitle={`Real-time shift, counter, and route billing activity for ${overview?.date || 'today'}`}
      className="mb-4"
    >
      <div className="row g-3">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div key={idx} className="col-sm-6 col-md-3">
              <div
                className="p-3 rounded-3 border h-100 d-flex align-items-center gap-3"
                style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 42, height: 42, backgroundColor: it.bg, color: it.accent }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <span className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem' }}>
                    {it.label}
                  </span>
                  <div className="d-flex align-items-baseline gap-1 mt-0.5">
                    <h4
                      className="fw-extrabold font-mono text-dark mb-0"
                      style={{ fontSize: '1.15rem' }}
                    >
                      {it.value}
                    </h4>
                    {it.suffix && <span className="small text-muted">{it.suffix}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
