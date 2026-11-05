'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { tenantLoginSchema } from '@/features/auth/schemas';
import { TenantLoginInput } from '@/features/auth/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { parseApiError } from '@/lib/errors';

export default function LoginPage() {
  const { loginTenant } = useAuth();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenantLoginInput>({
    resolver: zodResolver(tenantLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenant_id: '',
    },
  });

  const onSubmit = async (data: TenantLoginInput) => {
    setServerError(null);
    try {
      await loginTenant(data);
      showToast('Welcome back! Signed in successfully.', 'success');
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-split-container animate-fade-in">
          {/* Left Brand Showcase Panel */}
          <div className="auth-showcase-panel d-none d-lg-flex">
            <div>
              <Link
                href="/"
                className="d-inline-flex align-items-center gap-2 text-white text-decoration-none fw-bold mb-5"
              >
                <Image src="/images/logo.svg" alt="Vyavsa" width={36} height={36} priority />
                <span className="fs-5">Vyavsa Bill Book</span>
              </Link>

              <span className="badge rounded-pill glass-pill px-3 py-1.5 mb-3 text-white small">
                Multi-Tenant Treasury &amp; Billing
              </span>
              <h2 className="fw-extrabold text-white mb-3" style={{ lineHeight: 1.2 }}>
                Every rupee accounted for—from route vans to counter drawers.
              </h2>
              <p className="small mb-4" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                Sign in to access your real-time khata receivables, split UPI settlements, mutual
                party contra offsets, and daily closing reports.
              </p>

              <div className="d-flex flex-column gap-3 mt-4">
                {[
                  'Authoritative physical cash drawer & multi-bank ledger',
                  'Automated mutual customer-supplier contra settlements',
                  'Role-based access for Admin, Office, and Line Salesmen',
                ].map((point, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 small text-white">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-3 rounded-3 mt-5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between small text-white">
                <span className="fw-semibold">Need Platform Super-Admin Access?</span>
                <Link
                  href="/platform/login"
                  className="text-white fw-bold text-decoration-none d-inline-flex align-items-center gap-1"
                >
                  <span>Admin Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-4 p-sm-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4">
              <Link href="/" className="d-inline-flex d-lg-none mb-3">
                <Image src="/images/logo.svg" alt="Vyavsa" width={40} height={40} priority />
              </Link>
              <h4 className="fw-extrabold text-dark mb-1">Sign In to Vyavsa</h4>
              <p className="text-muted small mb-0">
                Enter your workspace credentials to access your business bill book
              </p>
            </div>

            {serverError && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2 p-3 small mb-4 rounded-3"
                role="alert"
              >
                <AlertCircle size={18} className="flex-shrink-0" />
                <div>{serverError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder="owner@business.com"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label small text-muted" htmlFor="rememberMe">
                    Keep session active
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-decoration-none text-primary small fw-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                isLoading={isSubmitting}
              >
                Sign In to Workspace
              </Button>
            </form>

            <div className="text-center text-muted small mt-3 pt-3 border-top">
              Don&apos;t have a business workspace yet?{' '}
              <Link href="/register" className="text-primary fw-bold text-decoration-none">
                Register business
              </Link>
            </div>

            <div className="text-center mt-3 d-lg-none">
              <Link
                href="/platform/login"
                className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1"
              >
                <ShieldCheck size={14} /> Platform Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
