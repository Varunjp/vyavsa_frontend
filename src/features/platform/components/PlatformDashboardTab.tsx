'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Building2, ShieldCheck, DollarSign, TrendingUp, Users } from 'lucide-react';
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
            <div className="card p-4 border rounded shadow-sm placeholder-glow">
              <span className="placeholder col-6 mb-2"></span>
              <span className="placeholder col-8 fs-4"></span>
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

  return (
    <div>
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Tenants</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{totalTenants}</h3>
                <span className="small text-muted">{recent7d} joined in last 7 days</span>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <Building2 size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Active Subscriptions
                </span>
                <h3 className="fw-bold text-success mt-1 mb-0">{activeTenants}</h3>
                <span className="small text-muted">Paying tenant workspaces</span>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <ShieldCheck size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Monthly Received
                </span>
                <h3 className="fw-bold text-dark mt-1 mb-0 font-mono">
                  {formatCurrency(monthlyIncome)}
                </h3>
                <span className="small text-muted">Subscription fees received</span>
              </div>
              <div className="p-3 bg-info-subtle text-info rounded-3">
                <DollarSign size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Recent Signups</span>
                <h3 className="fw-bold text-primary mt-1 mb-0">+{recent7d}</h3>
                <span className="small text-muted">Growth in past week</span>
              </div>
              <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3">
                <TrendingUp size={24} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <Card
        title="Platform Subscription Revenue Growth"
        subtitle="Monthly collected subscription income trends"
        className="mb-4"
      >
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
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
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
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
