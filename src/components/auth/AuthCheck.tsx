
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to safely check if auth context is available before rendering children
 * This helps prevent the "useAuth must be used within an AuthProvider" error
 */
export const AuthCheck: React.FC<AuthCheckProps> = ({ 
  children, 
  fallback = <div>Loading authentication...</div> 
}) => {
  // Use try/catch to safely check auth context availability
  try {
    const auth = useAuth();
    
    // Still show fallback if auth is loading
    if (auth.isLoading || auth.loading) {
      return <>{fallback}</>;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.warn('Auth context not available:', error);
    return <>{fallback}</>;
  }
};

export default AuthCheck;
