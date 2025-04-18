
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface SessionContextValue {
  session: any | null;
  user: any | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signOut: () => Promise<any>;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => null,
  signOut: async () => null,
  isAuthenticated: false
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, let's simulate a user session with localStorage
    const checkForSession = () => {
      const savedSession = localStorage.getItem('user_session');
      
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession);
          setSession(parsedSession);
          setUser(parsedSession.user);
        } catch (e) {
          console.error('Failed to parse user session:', e);
          localStorage.removeItem('user_session');
        }
      }
      
      setLoading(false);
    };

    checkForSession();
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      // This is a mock implementation - in a real app, we'd use Supabase auth
      const mockUser = {
        id: 'user-123',
        email: credentials.email,
        user_metadata: {
          full_name: 'Demo User',
        }
      };
      
      const mockSession = {
        user: mockUser,
        access_token: 'mock-token-123',
        expires_at: Date.now() + 3600 * 1000
      };
      
      localStorage.setItem('user_session', JSON.stringify(mockSession));
      localStorage.setItem('userId', mockUser.id);
      
      setSession(mockSession);
      setUser(mockUser);
      
      return { user: mockUser, session: mockSession, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, session: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear session data
      localStorage.removeItem('user_session');
      localStorage.removeItem('userId');
      
      setSession(null);
      setUser(null);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  const contextValue: SessionContextValue = {
    session,
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
