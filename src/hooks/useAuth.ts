
import { AuthContextType } from '@/lib/types/auth';
import { useAuth as useProviderAuth } from '@/providers/AuthProvider';

/**
 * Custom hook for accessing auth context.
 * This simplified version uses the main AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  return useProviderAuth();
};

export default useAuth;
