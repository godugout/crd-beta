
import { User, Permission } from '@/lib/types';

export interface AuthUser extends Omit<User, 'email'> {
  email?: string; // Make email optional in AuthUser
  permissions?: Permission[];
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
}

export interface AuthContextType {
  state: AuthState;
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
  login: (user: AuthUser) => void;
  logout: () => void;
  signup: (user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isViewer: () => boolean;
  isLoggedIn: boolean;
  isGuest: () => boolean;
  isManager: () => boolean;
  isUser: () => boolean;
  setSession: (session: AuthSession | null) => void;
}
