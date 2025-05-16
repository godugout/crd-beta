
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  userId: string | null;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isLoggedIn = !!session;
      setIsAuthenticated(isLoggedIn);
      setUserId(session?.user?.id || null);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name,
          displayName: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url
        });
      } else {
        setUser(null);
      }
      
      // In a real app, we'd check if the user is an admin
      // For demo purposes, we'll assume they are
      setIsAdmin(true);
      
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isLoggedIn = !!session;
      setIsAuthenticated(isLoggedIn);
      setUserId(session?.user?.id || null);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name,
          displayName: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setUserId(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    userId,
    signOut
  };
}
