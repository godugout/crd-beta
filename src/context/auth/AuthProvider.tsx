
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
      console.log('Fetching user profile for:', userId);
      
      // Get auth user data first
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser?.user) {
        console.error('Error fetching auth user:', authError);
        return null;
      }
      
      // Try to fetch profile data (optional)
      let profileData = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.warn('Profile not found, creating basic user:', error.message);
        } else {
          profileData = data;
        }
      } catch (profileError) {
        console.warn('Profile table might not exist, continuing with basic auth user');
      }
      
      // Create user object with available data
      return {
        id: userId,
        email: authUser.user.email || '',
        displayName: profileData?.full_name || authUser.user.user_metadata?.full_name,
        name: profileData?.full_name || authUser.user.user_metadata?.name,
        avatarUrl: profileData?.avatar_url || authUser.user.user_metadata?.avatar_url,
        role: UserRole.USER,
        createdAt: authUser.user.created_at || new Date().toISOString(),
        updatedAt: profileData?.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up authentication...');
    
    // Set a timeout to ensure loading doesn't hang forever
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout reached, forcing loading to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    const setupAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }
        
        if (session && session.user) {
          console.log('AuthProvider: Found existing session, fetching profile...');
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } else {
          console.log('AuthProvider: No existing session found');
        }
        
        setIsLoading(false);
        clearTimeout(loadingTimeout);
        
        // Set up auth state change listener
        console.log('AuthProvider: Setting up auth state listener...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
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
      } catch (error) {
        console.error('Auth setup error:', error);
        setIsLoading(false);
        clearTimeout(loadingTimeout);
      }
    };
    
    setupAuth();
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log('Attempting login for:', email);
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
      console.log('Attempting logout...');
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
      console.log('Attempting registration for:', email);
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
        // Wait a moment for any triggers to complete
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
      console.log('Updating user profile...');
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

  // Always render children, don't block on loading
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
