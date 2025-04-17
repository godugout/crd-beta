
import { User, UserRole, UserPermission } from '@/lib/types';

export interface AuthUser extends User {
  role: UserRole;
  permissions?: UserPermission[];
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<boolean>;
  loading?: boolean; // For backwards compatibility
}
