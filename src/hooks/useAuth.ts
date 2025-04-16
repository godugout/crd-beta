
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the provider
 */
export const useAuth = () => {
  try {
    // Use the AuthProvider from providers directory
    return useAuthFromProvider();
  } catch (error) {
    console.warn('Auth provider not found or not initialized properly');
    throw new Error('useAuth must be used within an AuthProvider');
  }
};

export default useAuth;
