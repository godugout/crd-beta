
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';
import { AuthContext } from '@/context/auth/AuthContext';
import { AuthContextType as OldAuthContextType } from '@/context/auth/types';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the new provider first, 
 * and falls back to the old context if needed.
 */
export const useAuth = () => {
  try {
    // Try to use the new AuthProvider
    return useAuthFromProvider();
  } catch (error) {
    // Fall back to the old AuthContext
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    // Add compatibility layer for old context
    const compatContext: any = {
      ...context,
      // Map properties from old context to match new context properties
      isAuthenticated: !!context.user,
      signInWithProvider: async () => {
        throw new Error('Social login not supported with old auth provider');
      },
      updateUserProfile: async () => {
        throw new Error('Profile updates not supported with old auth provider');
      }
    };
    
    return compatContext;
  }
};

export default useAuth;
