import { User, Permission, UserPermission } from '@/lib/types';

export interface AuthUser extends Omit<User, 'email'> {
  email?: string; // Make email optional in AuthUser
  permissions?: Permission[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: any;
}

export interface AuthContextType {
  state: AuthState;
  login: (user: AuthUser) => void;
  logout: () => void;
  signup: (user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  loading: boolean;
  error: any;
  hasPermission: (permission: UserPermission) => boolean;
  isAdmin: () => boolean;
  isViewer: () => boolean;
  isLoggedIn: boolean;
  isGuest: () => boolean;
  isManager: () => boolean;
  isUser: () => boolean;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
}
