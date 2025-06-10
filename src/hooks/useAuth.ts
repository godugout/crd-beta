
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
    signIn: auth.login,
    signUp: auth.register,
    signOut: auth.logout,
    loading: auth.isLoading
  };
};

export default useAuth;
