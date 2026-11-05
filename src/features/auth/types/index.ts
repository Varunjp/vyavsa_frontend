import { TokenResponse, UserProfile } from '@/types';

export interface TenantLoginInput {
  email: string;
  password: string;
  tenant_id?: string;
}

export interface PlatformLoginInput {
  identifier: string;
  password: string;
}

export interface TenantRegisterInput {
  name: string;
  admin_name?: string;
  email: string;
  password: string;
  phone?: string;
  plan_id?: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetOTPInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  reset_token: string;
  new_password: string;
}

export interface TenantRegisterResponseData {
  tokens?: TokenResponse;
  tenant: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
  admin_user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthContextState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginTenant: (input: TenantLoginInput) => Promise<void>;
  loginPlatform: (input: PlatformLoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
