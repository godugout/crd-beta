
import { User } from '@/lib/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  // Adding isLoading as an alias to loading for compatibility with different auth providers
  isLoading?: boolean;
}
