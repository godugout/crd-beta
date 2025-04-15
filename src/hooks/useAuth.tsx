
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';
import { AuthContext } from '@/context/auth/AuthContext';
import { AuthContextType } from '@/context/auth/types';
import { User } from '@/lib/types';

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

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the new provider first, 
 * and falls back to the old context if needed.
 */
export const useAuth = (): UnifiedAuthContextType => {
  try {
    // Try to use the new AuthProvider
    return useAuthFromProvider() as UnifiedAuthContextType;
  } catch (error) {
    // Fall back to the old AuthContext
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    // Add compatibility layer for old context
    const compatContext: UnifiedAuthContextType = {
      ...context as AuthContextType,
      // Map properties from old context to match new context properties
      isAuthenticated: !!context.user,
      signInWithProvider: async (provider: 'google' | 'github' | 'facebook') => {
        throw new Error('Social login not supported with old auth provider');
      },
      updateUserProfile: async (data: Partial<User>) => {
        throw new Error('Profile updates not supported with old auth provider');
      }
    };
    
    return compatContext;
  }
};

export default useAuth;
