
import { useContext } from 'react';
import { useAuth as useAuthFromProvider } from '@/providers/AuthProvider';
import { AuthContext } from '@/context/auth/AuthContext';

/**
 * Custom hook for accessing auth context.
 * It tries to get auth from the new provider first, 
 * and falls back to the old context if needed.
 */
export const useAuth = () => {
  try {
    // Try to use the new AuthProvider
    return useAuthFromProvider();
  } catch (error) {
    // Fall back to the old AuthContext
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }
};

export default useAuth;
