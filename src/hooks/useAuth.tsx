
import { useAuth as useContextAuth } from '@/context/auth/AuthProvider';

export const useAuth = () => {
  return useContextAuth();
};

// Re-export AuthProvider for convenience
export { AuthProvider } from '@/context/auth/AuthProvider';
