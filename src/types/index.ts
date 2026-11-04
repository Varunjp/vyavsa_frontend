import { Role, UserType } from '@/lib/constants';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  user_type: UserType;
  tenant_id?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface ApiPagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface ApiErrorInfo {
  code: string;
  message: string;
  details?: Record<string, string>;
  fields?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorInfo;
  pagination?: ApiPagination;
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string;
  price_inr: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  max_users: number;
  is_active: boolean;
}

export interface FinancialSummary {
  cash_balance: number;
  bank_balance: number;
  total_receivable: number;
  total_payable: number;
  updated_at: string;
}
