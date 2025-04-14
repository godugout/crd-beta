
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { UserRole } from '@/lib/types/UserTypes';

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user for development
const MOCK_ADMIN_USER: User = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  displayName: 'System Admin',
  role: UserRole.ADMIN,
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
  bio: 'System administrator with full access to all features.',
  signature: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default user for development
const DEFAULT_USER: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Demo User',
  role: UserRole.ADMIN,
  permissions: ['all'],
  preferences: {
    theme: 'light',
    notifications: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode; autoLogin?: boolean }> = ({ 
  children,
  autoLogin = true // Default to auto login
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto login for development
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // For development: auto login as admin
        if (autoLogin) {
          console.log('🔑 Auto-logging in as admin for development');
          setUser(MOCK_ADMIN_USER);
          localStorage.setItem('auth-user', JSON.stringify(MOCK_ADMIN_USER));
        } else {
          // Check if there's a stored user
          const storedUser = localStorage.getItem('auth-user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [autoLogin]);

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd call your auth service here
      // For now, simulate login with mock admin
      setUser(MOCK_ADMIN_USER);
      localStorage.setItem('auth-user', JSON.stringify(MOCK_ADMIN_USER));
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd call your auth service here
      // For now, just log the action
      console.log('Sign up called with', { email, userData });
      setUser(MOCK_ADMIN_USER);
      localStorage.setItem('auth-user', JSON.stringify(MOCK_ADMIN_USER));
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd call your auth service here
      setUser(null);
      localStorage.removeItem('auth-user');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd call your auth service here
      console.log(`Sign in with ${provider} called`);
      setUser(MOCK_ADMIN_USER);
      localStorage.setItem('auth-user', JSON.stringify(MOCK_ADMIN_USER));
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd call your auth service here
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
