
import { useAuth as useAuthFromContext } from '@/context/auth';

/**
 * Hook for accessing auth functionality throughout the application.
 * This is a convenience wrapper around the context's useAuth that provides
 * a fallback for development and testing environments.
 */
export function useAuth() {
  try {
    // First attempt to use the auth context from @/context/auth
    return useAuthFromContext();
  } catch (error) {
    // For development purposes, provide a fallback mock implementation
    console.warn('Auth context not found, using fallback mock implementation');
    
    return {
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      signIn: async () => ({ success: false, error: 'Auth provider not available' }),
      signUp: async () => ({ success: false, error: 'Auth provider not available' }),
      signOut: async () => {},
      resetPassword: async () => ({ success: false, error: 'Auth provider not available' }),
      updateProfile: async () => ({ success: false, error: 'Auth provider not available' }),
      refreshSession: async () => false,
      loading: false,
    };
  }
}

export default useAuth;
