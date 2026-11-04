'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsService } from '../services/settingsService';
import { updateSettingsSchema, UpdateSettingsInput } from '../schemas/settingsSchema';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useToast } from '@/contexts/ToastContext';
import { TenantUserItem } from '@/types';
import { Building2, Upload, Trash2, Plus, Users } from 'lucide-react';
import { CreateTenantUserModal } from './CreateTenantUserModal';

export function SettingsTab() {
  const { showToast } = useToast();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Queries
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['tenant-profile'],
    queryFn: () => settingsService.getProfile(),
  });

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['tenant-users'],
    queryFn: () => settingsService.listTenantUsers(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    values: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address_line1: profile?.address_line1 || '',
      address_line2: profile?.address_line2 || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postal_code: profile?.postal_code || '',
      country: profile?.country || 'India',
      invoice_footer_heading: profile?.invoice_footer_heading || '',
      invoice_footer_paragraph: profile?.invoice_footer_paragraph || '',
    },
  });

  const onSaveProfile = async (data: UpdateSettingsInput) => {
    try {
      await settingsService.updateSettings(data);
      showToast('Business organization details updated successfully!', 'success');
      refetchProfile();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      await settingsService.uploadLogo(file);
      showToast('Company logo updated successfully!', 'success');
      refetchProfile();
    } catch (err: any) {
      showToast(err.message || 'Failed to upload logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm('Are you sure you want to remove the business logo?')) return;
    try {
      await settingsService.deleteLogo();
      showToast('Logo removed successfully.', 'info');
      refetchProfile();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove logo', 'error');
    }
  };

  const handleDeleteUser = async (u: TenantUserItem) => {
    if (!confirm(`Are you sure you want to remove user "${u.name}" (${u.email})?`)) return;
    try {
      await settingsService.deleteTenantUser(u.id);
      showToast(`User ${u.name} removed`, 'info');
      refetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  const userColumns: Column<TenantUserItem>[] = [
    {
      key: 'name',
      header: 'User Name',
      render: u => (
        <div>
          <div className="fw-semibold text-dark">{u.name}</div>
          <span className="small text-muted">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: u => (
        <span className="badge bg-primary-subtle text-primary text-uppercase small">{u.role}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: u => (
        <span className="badge bg-success-subtle text-success small text-uppercase">
          {u.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: u => (
        <button
          className="btn btn-sm btn-link text-danger p-0"
          title="Remove User"
          onClick={() => handleDeleteUser(u)}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Organization Settings */}
      <Card
        title="Business Organization & Invoice Profile"
        subtitle="Manage business address, contact numbers, and printed bill invoice footer notes"
        className="mb-4"
      >
        <form onSubmit={handleSubmit(onSaveProfile)}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <Input
                label="Organization / Business Name *"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Registered Business Email *"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <Input label="Phone Number" error={errors.phone?.message} {...register('phone')} />
            </div>
            <div className="col-md-6">
              <Input
                label="Address Line 1"
                error={errors.address_line1?.message}
                {...register('address_line1')}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <Input label="City" error={errors.city?.message} {...register('city')} />
            </div>
            <div className="col-md-4">
              <Input label="State" error={errors.state?.message} {...register('state')} />
            </div>
            <div className="col-md-4">
              <Input
                label="Postal / PIN Code"
                error={errors.postal_code?.message}
                {...register('postal_code')}
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Input
                label="Invoice Footer Heading"
                placeholder="e.g. Terms & Conditions"
                error={errors.invoice_footer_heading?.message}
                {...register('invoice_footer_heading')}
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Invoice Footer Paragraph / Declaration"
                placeholder="e.g. Goods once sold cannot be returned without original cash memo."
                error={errors.invoice_footer_paragraph?.message}
                {...register('invoice_footer_paragraph')}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Business Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Business Logo Upload */}
      <Card
        title="Company Logo & Branding"
        subtitle="Upload your business emblem to display on downloaded PDF invoices and statements"
        className="mb-4"
      >
        <div className="d-flex align-items-center gap-4">
          <div
            className="rounded border p-2 d-flex align-items-center justify-content-center bg-light"
            style={{ width: '100px', height: '100px' }}
          >
            {profile?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logo_url}
                alt="Business Logo"
                className="img-fluid"
                style={{ maxHeight: '80px', objectFit: 'contain' }}
              />
            ) : (
              <Building2 size={36} className="text-muted" />
            )}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <label className="btn btn-outline-primary btn-sm mb-0">
                <Upload size={14} className="me-1" />
                {isUploadingLogo ? 'Uploading...' : 'Upload New Logo'}
                <input
                  type="file"
                  className="d-none"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                />
              </label>

              {profile?.logo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 size={14} className="text-danger" />}
                  onClick={handleDeleteLogo}
                >
                  Remove Logo
                </Button>
              )}
            </div>
            <span className="text-muted small d-block">
              Recommended: PNG, JPG, or SVG under 2MB. Square dimensions look best.
            </span>
          </div>
        </div>
      </Card>

      {/* Tenant User Accounts Management */}
      <Card
        title={
          <div className="d-flex align-items-center gap-2">
            <Users size={18} className="text-primary" />
            <span>Workspace Team & RBAC Members</span>
          </div>
        }
        subtitle="Manage operators, drivers, and accountants with scoped role permissions"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsUserModalOpen(true)}
          >
            Add Team Member
          </Button>
        }
      >
        <DataTable
          columns={userColumns}
          data={users || []}
          keyExtractor={u => u.id}
          isLoading={usersLoading}
          emptyTitle="No Additional Users Found"
          emptyDescription="Create secondary user accounts for store cashiers, salesman drivers, and office staff."
          emptyActionLabel="Add Team Member"
          onEmptyAction={() => setIsUserModalOpen(true)}
        />
      </Card>

      {/* Add User Modal */}
      <CreateTenantUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => refetchUsers()}
      />
    </div>
  );
}
