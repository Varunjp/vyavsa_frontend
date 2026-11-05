'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { PlatformDashboardTab } from '@/features/platform/components/PlatformDashboardTab';
import { PlatformTenantsTab } from '@/features/platform/components/PlatformTenantsTab';
import { PlatformPlansTab } from '@/features/platform/components/PlatformPlansTab';
import { PlatformSubscriptionsTab } from '@/features/platform/components/PlatformSubscriptionsTab';
import { PlatformTransactionsTab } from '@/features/platform/components/PlatformTransactionsTab';

export default function PlatformDashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const tabTitles: Record<string, { title: string; desc: string }> = {
    dashboard: {
      title: 'Platform Analytics & KPIs',
      desc: 'Real-time multi-tenant health, global revenues, and MRR aggregates',
    },
    tenants: {
      title: 'Tenant Directory & Onboarding',
      desc: 'Provision organizations, manage subscriptions, and oversee tenant lifecycles',
    },
    plans: {
      title: 'Subscription Plans Catalog',
      desc: 'Create, publish, and configure platform pricing tiers and billing intervals',
    },
    subscriptions: {
      title: 'Active Tenant Subscriptions',
      desc: 'Monitor tenant subscription renewals, expirations, and entitlement statuses',
    },
    transactions: {
      title: 'Billing & Gateway Transactions',
      desc: 'Audit trail of captured subscription fees and payments across all tenants',
    },
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.dashboard;

  return (
    <ProtectedLayout requiredRole="platform_admin">
      <PageHeader title={currentMeta.title} description={currentMeta.desc} />

      {currentTab === 'dashboard' && <PlatformDashboardTab />}
      {currentTab === 'tenants' && <PlatformTenantsTab />}
      {currentTab === 'plans' && <PlatformPlansTab />}
      {currentTab === 'subscriptions' && <PlatformSubscriptionsTab />}
      {currentTab === 'transactions' && <PlatformTransactionsTab />}
    </ProtectedLayout>
  );
}
