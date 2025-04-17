
import { useContext } from 'react';
import { useAuth as useProviderAuth } from '@/providers/AuthProvider';
import { useAuth as useContextAuth } from '@/context/auth/useAuth';
import { AuthContextType } from '@/context/auth/types';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the provider or context
 */
export const useAuth = (): AuthContextType => {
  // Try to use the main provider first (the one configured in main.tsx)
  try {
    const providerAuth = useProviderAuth();
    // Ensure loading property exists for compatibility with AuthContextType
    return {
      ...providerAuth,
      loading: providerAuth.isLoading || false,
    };
  } catch (providerError) {
    // If that fails, try the context from /context/auth
    try {
      const contextAuth = useContextAuth();
      // Add isLoading as an alias to loading for compatibility
      return {
        ...contextAuth,
        isLoading: contextAuth.loading
      };
    } catch (contextError) {
      console.warn('Auth provider not found or not initialized properly');
      // Instead of throwing an error, return a safe default version
      // This prevents crashes when auth is not fully set up
      return {
        user: null,
        isAuthenticated: false, 
        loading: true,
        error: null,
        signIn: async () => { console.warn('Auth not initialized'); },
        signUp: async () => { console.warn('Auth not initialized'); },
        signOut: async () => { console.warn('Auth not initialized'); },
        isLoading: true
      };
    }
  }
};

export default useAuth;
