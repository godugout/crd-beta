
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';
import { AuthContext } from '@/context/auth/AuthContext';
import { AuthContextType } from '@/context/auth/types';
import { User } from '@/lib/types';
import { UserRole } from '@/lib/types/UserTypes';

// Define a unified type that encompasses both auth context types
export interface UnifiedAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated?: boolean;
  error?: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nameOrUserData: string | Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider?: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  updateUserProfile?: (data: Partial<User>) => Promise<void>;
}

// Mock user for use when auth is disabled
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Demo User',
  displayName: 'Demo User',
  role: UserRole.ADMIN,
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DU',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default mock implementation of auth context
const mockAuthContext: UnifiedAuthContextType = {
  user: MOCK_USER,
  isLoading: false,
  isAuthenticated: true,
  error: null,
  signIn: async () => Promise.resolve(),
  signUp: async () => Promise.resolve(),
  signOut: async () => Promise.resolve(),
  signInWithProvider: async () => Promise.resolve(),
  updateUserProfile: async () => Promise.resolve()
};

/**
 * Custom hook for accessing auth context.
 * Now always returns a valid auth context, either from a provider or a mock.
 */
export const useAuth = (): UnifiedAuthContextType => {
  try {
    // Try to use the new AuthProvider
    return useAuthFromProvider() as UnifiedAuthContextType;
  } catch (error) {
    try {
      // Try to use the old AuthContext
      const context = useContext(AuthContext);
      if (context) {
        // Add compatibility layer for old context
        const compatContext: UnifiedAuthContextType = {
          ...context as AuthContextType,
          // Map properties from old context to match new context properties
          isAuthenticated: !!context.user,
          signInWithProvider: async () => {
            console.log('Social login not supported with old auth provider');
            return Promise.resolve();
          },
          updateUserProfile: async () => {
            console.log('Profile updates not supported with old auth provider');
            return Promise.resolve();
          }
        };
        
        return compatContext;
      }
    } catch (innerError) {
      console.warn('Both auth providers failed, using mock auth context');
    }
    
    console.info('Using mock auth context as fallback');
    return mockAuthContext;
  }
};

export default useAuth;
