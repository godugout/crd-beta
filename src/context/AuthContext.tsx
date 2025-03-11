
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/supabase';
import { AuthState, User } from '@/lib/types';
import { toast } from 'sonner';

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await auth.getCurrentUser();
        
        if (error) {
          setAuthState({
            user: null,
            isLoading: false,
            error: error.message
          });
          return;
        }
        
        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.name || '',
            avatarUrl: data.user.user_metadata.avatar_url
          };
          
          setAuthState({
            user,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthState({
          user: null,
          isLoading: false,
          error: 'Failed to authenticate'
        });
      }
    };

    checkUser();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        toast.error('Failed to sign in: ' + error.message);
        return;
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          avatarUrl: data.user.user_metadata.avatar_url
        };
        
        setAuthState({
          user,
          isLoading: false,
          error: null
        });
        
        toast.success('Signed in successfully');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to sign in'
      }));
      toast.error('An unexpected error occurred');
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await auth.signUp(email, password, name);
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        toast.error('Failed to sign up: ' + error.message);
        return;
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          avatarUrl: data.user.user_metadata.avatar_url
        };
        
        setAuthState({
          user,
          isLoading: false,
          error: null
        });
        
        toast.success('Account created successfully');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to sign up'
      }));
      toast.error('An unexpected error occurred');
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await auth.signOut();
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        toast.error('Failed to sign out: ' + error.message);
        return;
      }
      
      setAuthState({
        user: null,
        isLoading: false,
        error: null
      });
      
      toast.success('Signed out successfully');
    } catch (err: any) {
      console.error('Sign out error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to sign out'
      }));
      toast.error('An unexpected error occurred');
    }
  };

  const value = {
    ...authState,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
