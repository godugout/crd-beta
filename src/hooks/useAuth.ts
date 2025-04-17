
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
    return useContextAuth();
  } catch (contextError) {
    // If that fails, try the provider from /providers
    try {
      return useProviderAuth();
    } catch (providerError) {
      console.warn('Auth provider not found or not initialized properly');
      throw new Error('useAuth must be used within an AuthProvider');
    }
  }
};

export default useAuth;
