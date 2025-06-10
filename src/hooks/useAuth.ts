
import { useAuth as useContextAuth } from '@/context/auth/AuthProvider';

/**
 * Custom hook for accessing auth context.
 * This uses the AuthProvider from the context directory.
 */
export const useAuth = () => {
  const auth = useContextAuth();
  
  // For compatibility, ensure we have all expected properties
  return {
    ...auth,
    signIn: async (email: string, password: string) => {
      try {
        const result = await auth.login(email, password);
        return { success: !!result, error: result ? undefined : 'Login failed' };
      } catch (error: any) {
        return { success: false, error: error.message || 'Login failed' };
      }
    },
    signUp: async (email: string, password: string, metadata?: any) => {
      try {
        const result = await auth.register(email, password, metadata);
        return { success: !!result, error: result ? undefined : 'Registration failed' };
      } catch (error: any) {
        return { success: false, error: error.message || 'Registration failed' };
      }
    },
    signOut: auth.logout,
    resetPassword: async (email: string) => {
      // TODO: Implement password reset functionality
      return { success: false, error: 'Password reset not implemented yet' };
    },
    updateProfile: async (data: any) => {
      try {
        const result = await auth.updateUser(data);
        return { success: !!result, error: result ? undefined : 'Update failed' };
      } catch (error: any) {
        return { success: false, error: error.message || 'Update failed' };
      }
    },
    refreshSession: async () => false,
    loading: auth.isLoading
  };
};

export default useAuth;
