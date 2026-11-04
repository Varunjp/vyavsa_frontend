'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Building2, DollarSign, TrendingUp, Plus, ShieldCheck } from 'lucide-react';

export default function PlatformDashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Sample seed data reflecting platform metrics
  const mockMetrics = {
    totalTenants: 124,
    activeSubscriptions: 118,
    mrr: 148500,
    totalRevenue: 1782000,
  };

  const mockTenants = [
    {
      id: 'tenant-1',
      name: 'Om Supermarket & Traders',
      email: 'owner@omsupermarket.com',
      plan: 'Growth',
      status: 'active',
      joinedAt: '2026-10-15',
    },
    {
      id: 'tenant-2',
      name: 'Kerala Spices Distribution',
      email: 'finance@keralaspices.in',
      plan: 'Enterprise',
      status: 'active',
      joinedAt: '2026-09-28',
    },
    {
      id: 'tenant-3',
      name: 'National Bakery & Sweets',
      email: 'admin@nationalbakery.com',
      plan: 'Starter',
      status: 'inactive',
      joinedAt: '2026-11-01',
    },
  ];

  return (
    <ProtectedLayout requiredRole="platform_admin">
      <PageHeader
        title="Platform Administration Portal"
        description="Monitor multi-tenant operations, global revenues, and subscription entitlements"
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
            Onboard New Tenant
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Tenants</span>
                <h3 className="fw-bold text-dark mt-1 mb-0">{mockMetrics.totalTenants}</h3>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3">
                <Building2 size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Active Plans</span>
                <h3 className="fw-bold text-success mt-1 mb-0">
                  {mockMetrics.activeSubscriptions}
                </h3>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <ShieldCheck size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Monthly Run Rate (MRR)
                </span>
                <h3 className="fw-bold text-dark mt-1 mb-0 font-mono">
                  {formatCurrency(mockMetrics.mrr)}
                </h3>
              </div>
              <div className="p-3 bg-info-subtle text-info rounded-3">
                <TrendingUp size={24} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-xl-3">
          <Card className="mb-0">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Cumulative Revenue
                </span>
                <h3 className="fw-bold text-dark mt-1 mb-0 font-mono">
                  {formatCurrency(mockMetrics.totalRevenue)}
                </h3>
              </div>
              <div className="p-3 bg-warning-subtle text-warning rounded-3">
                <DollarSign size={24} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Tenant Table */}
      <Card
        title={currentTab === 'tenants' ? 'Tenant Organizations' : 'Recent Onboarded Businesses'}
        subtitle="Manage active customer accounts and plan allocations"
      >
        <DataTable
          columns={[
            {
              key: 'name',
              header: 'Business Name',
              render: item => (
                <div className="d-flex flex-column">
                  <span className="fw-semibold text-dark">{item.name}</span>
                  <small className="text-muted">{item.email}</small>
                </div>
              ),
            },
            {
              key: 'plan',
              header: 'Subscription Tier',
              render: item => (
                <span className="badge bg-light text-dark border px-2 py-1">{item.plan}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: item => (
                <span
                  className={`badge ${item.status === 'active' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary'}`}
                >
                  {item.status.toUpperCase()}
                </span>
              ),
            },
            {
              key: 'joinedAt',
              header: 'Registration Date',
              className: 'text-muted small font-mono',
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: () => (
                <Button variant="ghost" size="sm">
                  Manage &rarr;
                </Button>
              ),
            },
          ]}
          data={mockTenants}
          keyExtractor={item => item.id}
        />
      </Card>
    </ProtectedLayout>
  );
}
