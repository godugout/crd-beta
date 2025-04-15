
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

  useEffect(() => {
    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        }
      }
      
      setIsLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
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
    };
    
    setupAuth();
  }, []);

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
      
      if (!data.user) {
        return null;
      }
      
      const profile = await getUserProfile(data.user.id);
      
      if (profile) {
        setUser(profile);
        setIsAuthenticated(true);
        return profile;
      }
      
      return null;
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
        // The profile will be created by a database trigger
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profile = await getUserProfile(data.user.id);
        
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
          return profile;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<User | null> => {
    if (!user) return null;
    
    try {
      // Convert User updates to profile updates
      const profileUpdates: Record<string, any> = {};
      
      if (updates.displayName) profileUpdates.full_name = updates.displayName;
      if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
      
      // Only update if we have changes
      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating user profile:', error);
          return null;
        }
      }
      
      // Update local user state
      const updatedUser: User = {
        ...user,
        ...updates,
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
  }), [user, isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
