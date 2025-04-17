
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';
import { useAuth as useContextAuth } from '@/context/auth/useAuth';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the provider or context
 */
export const useAuth = () => {
  try {
    // First try to use the AuthProvider from providers directory
    return useAuthFromProvider();
  } catch (error) {
    try {
      // If that fails, try the context implementation
      return useContextAuth();
    } catch (e) {
      console.warn('Auth provider not found or not initialized properly');
      throw new Error('useAuth must be used within an AuthProvider');
    }
  }
};

export default useAuth;
