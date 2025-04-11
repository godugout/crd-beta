
import { User } from '@/lib/types';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Adding optional properties to make it compatible with the new context
  isAuthenticated?: boolean;
  signInWithProvider?: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  updateUserProfile?: (data: Partial<User>) => Promise<void>;
}

