'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { platformLoginSchema } from '@/features/auth/schemas';
import { PlatformLoginInput } from '@/features/auth/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { parseApiError } from '@/lib/errors';

export default function PlatformLoginPage() {
  const { loginPlatform } = useAuth();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlatformLoginInput>({
    resolver: zodResolver(platformLoginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: PlatformLoginInput) => {
    setServerError(null);
    try {
      await loginPlatform(data);
      showToast('Super-admin session authenticated successfully.', 'success');
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card border-danger-subtle">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-2 rounded-circle bg-danger-subtle text-danger mb-3">
              <ShieldCheck size={36} />
            </div>
            <h4 className="fw-bold text-dark mb-1">Platform Super Admin</h4>
            <p className="text-muted small">Restricted platform governance and tenant control</p>
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
              label="Admin Identifier (Email / Username)"
              placeholder="admin@vyavsa.internal"
              leftIcon={<User size={16} />}
              error={errors.identifier?.message}
              {...register('identifier')}
            />

            <Input
              label="Master Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" variant="danger" className="w-100 mb-3" isLoading={isSubmitting}>
              Authenticate Platform Session
            </Button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <Link href="/login" className="text-muted small text-decoration-none">
              &larr; Return to Tenant Workspace Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
