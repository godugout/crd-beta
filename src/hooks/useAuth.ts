
import { useAuth as useProviderAuth } from '@/providers/AuthProvider';

/**
 * Custom hook for accessing auth context.
 * This simplified version uses the main AuthProvider.
 */
export const useAuth = () => {
  const auth = useProviderAuth();
  
  // Add missing methods for compatibility with AuthContextType
  return {
    ...auth,
    signIn: async (email: string, password: string) => {
      const result = await auth.login(email, password);
      return { success: !!result, error: result ? undefined : 'Login failed' };
    },
    signUp: async (email: string, password: string, userData?: any) => {
      const result = await auth.register(email, password, userData);
      return { success: !!result, error: result ? undefined : 'Registration failed' };
    },
    signOut: auth.logout,
    resetPassword: async (email: string) => {
      return { success: false, error: 'Reset password not implemented' };
    },
    updateProfile: async (data: any) => {
      const result = await auth.updateUser(data);
      return { success: !!result, error: result ? undefined : 'Update failed' };
    },
    refreshSession: async () => false,
    loading: auth.isLoading
  };
};

export default useAuth;
