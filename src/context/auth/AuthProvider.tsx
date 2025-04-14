import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      const userData = data;
      
      // Make sure to include the role
      return {
        id: userId,
        email: userData?.email || '',
        displayName: userData?.user_metadata?.full_name,
        name: userData?.user_metadata?.name,
        avatarUrl: userData?.user_metadata?.avatar_url,
        role: UserRole.USER, // Add default role 
        createdAt: userData?.created_at || new Date().toISOString(),
        updatedAt: userData?.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update remaining getUserProfile instances to include role
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        getUserProfile(session.user.id).then(profile => {
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    
    const session = supabase.auth.getSession();
    session.then(({ data: { session } }) => {
      if (session) {
        getUserProfile(session.user.id).then(profile => {
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        });
      }
      setIsLoading(false);
    });
    
    return () => {
      supabase.auth.signOut();
    };
  }, []);

  // Update the login function to include role
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error('Login failed:', error);
        throw error;
      }
      
      const user = {
        id: data.user.id,
        email: data.user.email || '',
        displayName: data.user.user_metadata?.full_name,
        name: data.user.user_metadata?.name,
        avatarUrl: data.user.user_metadata?.avatar_url,
        role: UserRole.USER, // Add default role
        createdAt: data.user.created_at,
        updatedAt: data.user.created_at,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
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

  // Update the register function to include role
  const register = async (email: string, password: string, metadata?: { [key: string]: any }): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        console.error('Registration failed:', error);
        throw error;
      }
      
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: metadata?.full_name,
          name: metadata?.name,
          avatarUrl: metadata?.avatar_url,
          role: UserRole.USER, // Add default role
          createdAt: data.user.created_at,
          updatedAt: data.user.created_at,
        };
        
        setUser(user);
        setIsAuthenticated(true);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user?.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return null;
      }
      
      const updatedUser: User = {
        ...user!,
        ...data,
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }), [user, isAuthenticated, isLoading, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
