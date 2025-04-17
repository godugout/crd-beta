
import { useContext } from 'react';
import { useAuth as useProviderAuth } from '@/providers/AuthProvider';
import { useAuth as useContextAuth } from '@/context/auth/useAuth';
import { AuthContextType } from '@/context/auth/types';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the provider or context
 */
export const useAuth = (): AuthContextType => {
  // First try to use the auth context from /context/auth
  try {
    const contextAuth = useContextAuth();
    // Add isLoading as an alias to loading for compatibility
    return {
      ...contextAuth,
      isLoading: contextAuth.loading
    };
  } catch (contextError) {
    // If that fails, try the provider from /providers
    try {
      const providerAuth = useProviderAuth();
      // Ensure loading property exists for compatibility with AuthContextType
      return {
        ...providerAuth,
        loading: providerAuth.isLoading || false,
      };
    } catch (providerError) {
      console.warn('Auth provider not found or not initialized properly');
      throw new Error('useAuth must be used within an AuthProvider');
    }
  }
};

export default useAuth;
