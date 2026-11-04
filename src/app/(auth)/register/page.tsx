'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/ToastContext';
import { tenantRegisterSchema } from '@/features/auth/schemas';
import { TenantRegisterInput } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, Lock, Mail, Phone, User, AlertCircle } from 'lucide-react';
import { parseApiError } from '@/lib/errors';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenantRegisterInput>({
    resolver: zodResolver(tenantRegisterSchema),
    defaultValues: {
      name: '',
      admin_name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: TenantRegisterInput) => {
    setServerError(null);
    try {
      await authService.registerTenant(data);
      showToast('Workspace created successfully! Welcome to Vyavsa.', 'success');
      router.push('/dashboard');
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card auth-card-wide">
          <div className="text-center mb-4">
            <Link href="/" className="d-inline-flex mb-3">
              <Image src="/images/logo.svg" alt="Vyavsa" width={44} height={44} priority />
            </Link>
            <h4 className="fw-bold text-dark mb-1">Create Business Workspace</h4>
            <p className="text-muted small">
              Start managing your billing, khata, and payroll in minutes
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
            <div className="row g-2">
              <div className="col-12">
                <Input
                  label="Business / Enterprise Name"
                  placeholder="e.g. Om Supermarket & Wholesale"
                  leftIcon={<Building2 size={16} />}
                  error={errors.name?.message}
                  {...register('name')}
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Admin Full Name"
                  placeholder="e.g. Ramesh Kumar"
                  leftIcon={<User size={16} />}
                  error={errors.admin_name?.message}
                  {...register('admin_name')}
                />
              </div>

              <div className="col-md-6">
                <Input
                  label="Contact Phone (Optional)"
                  placeholder="9876543210"
                  leftIcon={<Phone size={16} />}
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <div className="col-12">
                <Input
                  label="Work Email Address"
                  type="email"
                  placeholder="admin@omsupermarket.com"
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="col-12">
                <Input
                  label="Secure Password"
                  type="password"
                  placeholder="At least 6 characters"
                  leftIcon={<Lock size={16} />}
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-2 mb-3"
              isLoading={isSubmitting}
            >
              Complete Registration & Enter Workspace
            </Button>
          </form>

          <div className="text-center text-muted small mt-3 pt-3 border-top">
            Already have an active workspace?{' '}
            <Link href="/login" className="text-primary fw-semibold text-decoration-none">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
