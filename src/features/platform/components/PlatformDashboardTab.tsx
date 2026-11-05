'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Building2, ShieldCheck, DollarSign, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function PlatformDashboardTab() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: () => platformService.getDashboardMetrics(),
  });

  if (isLoading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="col-sm-6 col-xl-3">
            <div className="kpi-stat-card placeholder-glow">
              <span className="placeholder col-6 mb-2 rounded"></span>
              <span className="placeholder col-8 fs-4 rounded"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activeTenants = metrics?.active_tenants ?? 0;
  const totalTenants = metrics?.total_tenants ?? 0;
  const monthlyIncome = Number(metrics?.monthly_received_income || 0);
  const recent7d = metrics?.recent_registrations_7d ?? 0;
  const chartData = metrics?.revenue_trend || [];

  const cards = [
    {
      label: 'Total Tenant Workspaces',
      value: String(totalTenants),
      sub: `${recent7d} onboarded in last 7 days`,
      icon: Building2,
      accent: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      label: 'Active Subscriptions',
      value: String(activeTenants),
      sub: 'Paying tenant organizations',
      icon: ShieldCheck,
      accent: '#10b981',
      bg: '#ecfdf5',
    },
    {
      label: 'Monthly Captured MRR',
      value: formatCurrency(monthlyIncome),
      sub: 'Subscription fees settled',
      icon: DollarSign,
      accent: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      label: '7-Day Velocity',
      value: `+${recent7d}`,
      sub: 'New tenant signups',
      icon: TrendingUp,
      accent: '#f59e0b',
      bg: '#fffbeb',
    },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="col-sm-6 col-xl-3">
              <div
                className="kpi-stat-card h-100"
                style={{ borderTop: `3px solid ${c.accent}` }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span
                      className="text-muted fw-bold text-uppercase d-block"
                      style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
                    >
                      {c.label}
                    </span>
                    <h3 className="fw-extrabold text-dark mt-1 mb-0 font-mono">{c.value}</h3>
                    <span className="small text-muted d-block mt-1">{c.sub}</span>
                  </div>
                  <div
                    className="kpi-icon-box"
                    style={{ backgroundColor: c.bg, color: c.accent }}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend Chart */}
      <Card
        title="Platform Subscription Revenue Growth"
        subtitle="Monthly collected subscription income trends across all tenants"
        className="mb-4"
      >
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={val => `₹${val}`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-5 text-center text-muted small">
            Revenue trend data will appear as monthly subscription renewals are captured.
          </div>
        )}
      </Card>
    </div>
  );
}
