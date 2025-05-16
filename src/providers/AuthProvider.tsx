
import React from 'react';
import { AuthProvider as ContextAuthProvider } from '@/context/auth';

/**
 * @deprecated Use the AuthProvider from @/context/auth directly
 * This is a wrapper for backward compatibility
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ContextAuthProvider>{children}</ContextAuthProvider>;
};

export default AuthProvider;
