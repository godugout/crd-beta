
// A centralized hook that re-exports from the auth context
import { useAuth as useAuthFromContext } from '@/context/auth';

/**
 * Hook for accessing auth functionality throughout the application
 * This is a convenience wrapper around the context's useAuth
 */
export function useAuth() {
  return useAuthFromContext();
}

export default useAuth;
