import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthContextType, AuthState, AuthUser, AuthSession } from './types';
import { UserRole } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/types/user';

// Default auth context
const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // For development purposes, use a mock user if running locally
  useEffect(() => {
    const setupAuthState = async () => {
      try {
        // First attempt to get an actual session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUser(profile as AuthUser);
            setIsAuthenticated(true);
          }
        } else {
          // If no session, use the mock user for development
          const isDevelopment = import.meta.env.DEV;
          if (isDevelopment) {
            console.log('Development environment detected, using mock user');
            setUser(MOCK_USER);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupAuthState();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profile as AuthUser);
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      // Instead of querying users table directly, query profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      // Get auth user data
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        return null;
      }
      
      // Combine auth data with profile data
      return {
        id: userId,
        email: authUser.user.email || '',
        displayName: data?.full_name || authUser.user.user_metadata?.full_name,
        name: data?.full_name || authUser.user.user_metadata?.name,
        avatarUrl: data?.avatar_url || authUser.user.user_metadata?.avatar_url,
        role: UserRole.USER, // Add default role 
        createdAt: authUser.user.created_at || new Date().toISOString(),
        updatedAt: data?.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error('Login failed:', error);
        return { success: false, error: error.message };
      }
      
      if (!data.user) {
        return { success: false, error: "No user returned from sign in" };
      }
      
      const profile = await getUserProfile(data.user.id);
      
      if (profile) {
        setUser(profile as AuthUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: "Failed to get user profile" };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || "Unknown error during sign in" };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout failed:', error);
      }
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        console.error('Registration failed:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // The profile will be created by a database trigger
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profile = await getUserProfile(data.user.id);
        
        if (profile) {
          setUser(profile as AuthUser);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      
      return { success: false, error: "User registration failed" };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || "Unknown error during registration" };
    }
  };

  const updateProfile = async (data: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    try {
      // Convert User updates to profile updates
      const profileUpdates: Record<string, any> = {};
      
      if (data.displayName) profileUpdates.full_name = data.displayName;
      if (data.avatarUrl) profileUpdates.avatar_url = data.avatarUrl;
      
      // Only update if we have changes
      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating user profile:', error);
          return { success: false, error: error.message };
        }
      }
      
      // Update local user state
      const updatedUser: AuthUser = {
        ...user,
        ...data,
      };
      
      setUser(updatedUser);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message || "Unknown error updating profile" };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Unknown error resetting password" };
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session: state.session,
    isAuthenticated,
    isLoading,
    error: state.error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
    loading: isLoading, // Backward compatibility
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
