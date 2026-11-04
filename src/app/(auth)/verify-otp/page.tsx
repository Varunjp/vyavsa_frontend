'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/ToastContext';
import { verifyResetOTPSchema } from '@/features/auth/schemas';
import { VerifyResetOTPInput } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { KeyRound, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { parseApiError } from '@/lib/errors';
import { STORAGE_KEYS } from '@/lib/constants';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetOTPInput>({
    resolver: zodResolver(verifyResetOTPSchema),
    defaultValues: {
      email: emailParam,
      otp: '',
    },
  });

  const onSubmit = async (data: VerifyResetOTPInput) => {
    setServerError(null);
    try {
      const resetToken = await authService.verifyResetOTP(data);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.RESET_TOKEN, resetToken);
      }
      showToast('OTP verified successfully! Please set your new password.', 'success');
      router.push('/reset-password');
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
            <h4 className="fw-bold text-dark mb-1">Verify Recovery OTP</h4>
            <p className="text-muted small">
              Enter the 6-digit verification code sent to your email
            </p>
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
              label="Account Email Address"
              type="email"
              placeholder="name@business.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="6-Digit OTP Code"
              type="text"
              maxLength={6}
              placeholder="123456"
              className="text-center font-mono fs-5 letter-spacing-1"
              leftIcon={<KeyRound size={16} />}
              error={errors.otp?.message}
              {...register('otp')}
            />

            <Button type="submit" variant="primary" className="w-100 mb-3" isLoading={isSubmitting}>
              Verify OTP Code
            </Button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <Link
              href="/forgot-password"
              className="text-secondary small fw-medium d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <ArrowLeft size={14} /> Resend OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
