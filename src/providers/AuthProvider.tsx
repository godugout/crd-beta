
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthSession, AuthState, AuthUser } from '@/lib/types/auth';
import { UserRole } from '@/lib/types/user';
import { toast } from 'sonner';
import { logger } from '@/lib/monitoring/logger';

// Default auth context
const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USER: AuthUser = {
  id: 'mock-user-id',
  email: 'dusty@godugout.com',
  name: 'Dusty Baker',
  displayName: 'Dusty',
  role: UserRole.ADMIN,
  permissions: ['all'] as any, // Cast to satisfy TypeScript
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DB',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock session data
const MOCK_SESSION: AuthSession = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: Date.now() + 3600000, // Expires in 1 hour
};

/**
 * The main Auth Provider for the application
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if we have a session in localStorage
        const savedSession = localStorage.getItem('auth_session');
        const savedUser = localStorage.getItem('auth_user');
        
        if (savedSession && savedUser) {
          try {
            const sessionData = JSON.parse(savedSession);
            const userData = JSON.parse(savedUser);
            
            // Check if session is expired
            if (sessionData.expiresAt && sessionData.expiresAt > Date.now()) {
              setState({
                user: userData,
                session: sessionData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              logger.info('Auth: Restored session from localStorage');
              return;
            }
          } catch (parseError) {
            logger.error('Auth: Failed to parse stored session', parseError);
            // Continue with initialization if parsing fails
          }
        }
        
        // For development: auto login with mock user
        if (import.meta.env.DEV) {
          setState({
            user: MOCK_USER,
            session: MOCK_SESSION,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          localStorage.setItem('auth_user', JSON.stringify(MOCK_USER));
          localStorage.setItem('auth_session', JSON.stringify(MOCK_SESSION));
          logger.info('Auth: Using mock user for development');
          return;
        }
        
        // No valid session found
        setState({
          ...initialState,
          isLoading: false,
        });
      } catch (err) {
        logger.error('Auth: Initialization error', err);
        setState({
          ...initialState,
          isLoading: false,
          error: 'Authentication system initialization failed',
        });
      }
    };

    initAuth();
  }, []);

  // Sign in implementation
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real app, we'd call an auth service here
      // For now, just simulate a login with mock data
      
      // Implement credential validation
      if (email !== MOCK_USER.email || password !== 'CRD') {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Invalid email or password' 
        }));
        logger.warn('Auth: Failed login attempt', { 
          context: { email } 
        });
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Successful login
      const session: AuthSession = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
      };
      
      setState({
        user: MOCK_USER,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      localStorage.setItem('auth_user', JSON.stringify(MOCK_USER));
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      logger.info('Auth: User signed in', { 
        context: { userId: MOCK_USER.id } 
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in';
      logger.error('Auth: Sign in error', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign up implementation
  const signUp = async (email: string, password: string, userData?: Partial<AuthUser>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real app, we'd call an auth service here
      // For now, just simulate a signup with mock data
      
      // Check if email is already used (mock check)
      if (email === MOCK_USER.email) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Email already in use' 
        }));
        return { success: false, error: 'Email already in use' };
      }
      
      // Create a new user
      const newUser: AuthUser = {
        id: 'user-' + Date.now(),
        email,
        name: userData?.name || email.split('@')[0],
        displayName: userData?.displayName,
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const session: AuthSession = {
        accessToken: 'access-token-' + Date.now(),
        refreshToken: 'refresh-token-' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
      };
      
      setState({
        user: newUser,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      logger.info('Auth: User signed up', { 
        context: { userId: newUser.id } 
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up';
      logger.error('Auth: Sign up error', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Sign out implementation
  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real app, we'd call an auth service here
      
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
      
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      logger.info('Auth: User signed out');
    } catch (error) {
      logger.error('Auth: Sign out error', error);
      // Still sign out the user locally even if the server request fails
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  // Reset password implementation
  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real app, we'd call an auth service here
      // For now, just simulate success
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      logger.info('Auth: Password reset requested', { 
        context: { email: email } 
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password';
      logger.error('Auth: Password reset error', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Update profile implementation
  const updateProfile = async (data: Partial<AuthUser>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Make sure we have a user to update
      if (!state.user) {
        throw new Error('No authenticated user');
      }
      
      // In a real app, we'd call an API service here
      // For now, just update the local user data
      const updatedUser = { ...state.user, ...data, updatedAt: new Date().toISOString() };
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
      
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      logger.info('Auth: Profile updated', { 
        context: { userId: updatedUser.id } 
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      logger.error('Auth: Profile update error', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return { success: false, error: errorMessage };
    }
  };

  // Session refresh implementation
  const refreshSession = async () => {
    if (!state.session?.refreshToken) return false;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real app, we'd call an auth service here
      // For now, just simulate a session refresh
      
      const newSession: AuthSession = {
        accessToken: 'refreshed-access-token-' + Date.now(),
        refreshToken: state.session.refreshToken,
        expiresAt: Date.now() + 3600000, // 1 hour
      };
      
      setState(prev => ({
        ...prev,
        session: newSession,
        isLoading: false,
      }));
      
      localStorage.setItem('auth_session', JSON.stringify(newSession));
      
      logger.info('Auth: Session refreshed');
      return true;
    } catch (error) {
      logger.error('Auth: Session refresh error', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to refresh session'
      }));
      return false;
    }
  };

  // Create the context value with all methods and state
  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
    // Add loading as an alias to isLoading for backward compatibility
    loading: state.isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
