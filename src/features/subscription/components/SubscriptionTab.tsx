'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';
import { Card } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plan, PlanTransaction } from '@/types';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function SubscriptionTab() {
  const { showToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    data: sub,
    isLoading: subLoading,
    refetch: refetchSub,
  } = useQuery({
    queryKey: ['tenant-subscription'],
    queryFn: () => subscriptionService.getCurrentSubscription(),
  });

  const { data: plans } = useQuery({
    queryKey: ['tenant-plans'],
    queryFn: () => subscriptionService.listAvailablePlans(),
  });

  const { data: txns, isLoading: txnsLoading } = useQuery({
    queryKey: ['subscription-transactions'],
    queryFn: () => subscriptionService.listTransactions({ page_size: 20 }),
  });

  const handlePurchase = async (plan: Plan) => {
    setIsPurchasing(plan.id);
    try {
      await subscriptionService.purchasePlan(plan.id, 'card');
      showToast(`Subscription plan "${plan.plan_name}" activated!`, 'success');
      refetchSub();
    } catch (err: any) {
      showToast(err.message || 'Payment initiation failed', 'error');
    } finally {
      setIsPurchasing(null);
    }
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      await subscriptionService.cancelSubscription(false);
      showToast('Subscription scheduled to cancel at the end of the billing cycle.', 'info');
      setIsCancelConfirmOpen(false);
      refetchSub();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel subscription', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const txnColumns: Column<PlanTransaction>[] = [
    {
      key: 'transaction_id',
      header: 'Transaction ID',
      render: t => (
        <span className="font-mono small text-primary fw-semibold">
          {t.transaction_id || `#${t.id.slice(0, 8)}`}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: t => <span className="text-muted small">{formatDate(t.created_at)}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      render: t => <span className="fw-semibold text-dark">{t.plan_name}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: t => <span className="font-mono fw-bold text-dark">{formatCurrency(t.amount)}</span>,
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: t => (
        <span className="badge bg-light text-dark border small text-uppercase">
          {t.payment_method}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: t => {
        const isSuccess = t.status === 'success' || t.status === 'captured';
        return (
          <span
            className={`badge ${isSuccess ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'} small text-uppercase`}
          >
            {t.status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Current Subscription Card */}
      <Card
        title="Current Active Subscription"
        subtitle="Manage your business billing tier and recurring renewal"
        className="mb-4"
      >
        {subLoading ? (
          <div className="placeholder-glow p-3">
            <span className="placeholder col-6 fs-4 mb-2"></span>
            <span className="placeholder col-4 d-block"></span>
          </div>
        ) : sub ? (
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Sparkles size={18} className="text-primary" />
                <h3 className="fw-extrabold text-dark mb-0">
                  {sub.current_plan_name || 'Standard Tier'}
                </h3>
                <span
                  className={`badge ${sub.status === 'active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'} text-uppercase small`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-muted small mb-2">
                Plan Rate:{' '}
                <strong className="font-mono text-dark">{formatCurrency(sub.price || 0)}</strong> /{' '}
                {sub.billing_interval || 'month'}
              </p>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                {sub.start_date && <span>Activated: {formatDate(sub.start_date)}</span>}
                {sub.end_date && <span>Renews / Expires: {formatDate(sub.end_date)}</span>}
                <span className="badge bg-primary-subtle text-primary">
                  {sub.days_remaining} Days Remaining
                </span>
              </div>

              {sub.queued_subscription && (
                <div className="alert alert-info small mt-3 mb-0">
                  <strong>Queued Plan:</strong> &ldquo;{sub.queued_subscription.plan_name}&rdquo; is
                  scheduled to activate automatically in{' '}
                  {sub.queued_subscription.days_until_activation} days.
                </div>
              )}
            </div>

            <div className="col-md-5 text-md-end">
              {sub.cancel_at_period_end ? (
                <div className="alert alert-warning small mb-0 d-inline-block text-start">
                  <AlertTriangle size={16} className="me-1 inline" />
                  Subscription scheduled for termination on {formatDate(sub.end_date || '')}.
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsCancelConfirmOpen(true)}>
                  Cancel Renewal
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted small">No active subscription record found.</div>
        )}
      </Card>

      {/* Available Plans Catalog */}
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-1">Available Subscription Plans</h5>
        <p className="text-muted small mb-3">
          Upgrade your workspace to access advanced line distributions and multi-bank
          reconciliations.
        </p>

        <div className="row g-3">
          {plans && plans.length > 0 ? (
            plans.map(plan => {
              const isCurrent = plan.id === sub?.current_plan_id || plan.is_current;

              return (
                <div key={plan.id} className="col-md-4">
                  <div
                    className={`card vyavsa-card h-100 p-4 mb-0 ${isCurrent ? 'border-primary border-2' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{plan.plan_name}</h5>
                      {isCurrent && <span className="badge bg-primary small">Current Plan</span>}
                    </div>
                    <div className="my-3">
                      <span className="fs-3 fw-extrabold font-mono text-dark">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-muted small"> / {plan.billing_interval}</span>
                    </div>
                    {plan.note && <p className="text-muted small mb-4">{plan.note}</p>}

                    <div className="mt-auto">
                      <Button
                        variant={isCurrent ? 'outline' : 'primary'}
                        className="w-100"
                        disabled={isCurrent || isPurchasing === plan.id}
                        isLoading={isPurchasing === plan.id}
                        onClick={() => handlePurchase(plan)}
                      >
                        {isCurrent ? 'Active Plan' : plan.action_label || 'Upgrade Plan'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-4 text-muted small">
              No plans catalog currently published.
            </div>
          )}
        </div>
      </div>

      {/* Payment & Billing Transactions History */}
      <Card
        title="Billing & Renewal Transaction History"
        subtitle="Official invoices and payment gateway logs"
        noPadding
      >
        <DataTable
          columns={txnColumns}
          data={txns?.data || []}
          keyExtractor={t => t.id}
          isLoading={txnsLoading}
          className="border-0 shadow-none rounded-0"
          emptyTitle="No Billing Transactions Yet"
          emptyDescription="Plan subscriptions and upgrades will generate official invoices and transaction receipts here."
        />
      </Card>

      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Recurring Subscription"
        message="Are you sure you want to cancel your recurring subscription? Your workspace will remain active until the current billing period ends."
        confirmLabel="Cancel Renewal"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}
