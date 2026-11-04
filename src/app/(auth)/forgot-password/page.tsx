'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/ToastContext';
import { forgotPasswordSchema } from '@/features/auth/schemas';
import { ForgotPasswordInput } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { parseApiError } from '@/lib/errors';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    try {
      const msg = await authService.forgotPassword(data);
      showToast(msg, 'info');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
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
            <h4 className="fw-bold text-dark mb-1">Recover Password</h4>
            <p className="text-muted small">
              Enter your account email to receive a 6-digit recovery OTP
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

            <Button type="submit" variant="primary" className="w-100 mb-3" isLoading={isSubmitting}>
              Send Verification OTP
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
