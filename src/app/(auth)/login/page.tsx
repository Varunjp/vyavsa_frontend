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
import { Lock, Mail, AlertCircle } from 'lucide-react';
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
        <div className="auth-card">
          <div className="text-center mb-4">
            <Link href="/" className="d-inline-flex mb-3">
              <Image src="/images/logo.svg" alt="Vyavsa" width={44} height={44} priority />
            </Link>
            <h4 className="fw-bold text-dark mb-1">Sign In to Vyavsa</h4>
            <p className="text-muted small">Access your business bill book workspace</p>
          </div>

          {serverError && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 p-3 small mb-4"
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
                  Remember session
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-decoration-none text-primary small fw-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-100 mb-3" isLoading={isSubmitting}>
              Sign In to Workspace
            </Button>
          </form>

          <div className="text-center text-muted small mt-4 pt-3 border-top">
            Don&apos;t have a workspace?{' '}
            <Link href="/register" className="text-primary fw-semibold text-decoration-none">
              Register business
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link href="/platform/login" className="text-muted small text-decoration-none">
              Platform Admin Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
