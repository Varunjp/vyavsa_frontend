'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/ToastContext';
import { resetPasswordSchema } from '@/features/auth/schemas';
import { authService } from '@/features/auth/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { parseApiError } from '@/lib/errors';
import { STORAGE_KEYS } from '@/lib/constants';

interface ResetPasswordFormValues {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      reset_token: tokenParam,
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (!tokenParam && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEYS.RESET_TOKEN);
      if (stored) {
        setValue('reset_token', stored);
      }
    }
  }, [tokenParam, setValue]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      const msg = await authService.resetPassword({
        reset_token: data.reset_token,
        new_password: data.new_password,
      });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
      }
      showToast(msg, 'success');
      router.push('/login');
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
            <h4 className="fw-bold text-dark mb-1">Set New Password</h4>
            <p className="text-muted small">Choose a strong password with at least 6 characters</p>
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
            <input type="hidden" {...register('reset_token')} />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.new_password?.message}
              {...register('new_password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />

            <Button type="submit" variant="primary" className="w-100 mb-3" isLoading={isSubmitting}>
              Update Password & Sign In
            </Button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <Link
              href="/login"
              className="text-secondary small fw-medium d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
