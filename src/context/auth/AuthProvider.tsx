import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, AuthUser, AuthSession } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Mock authentication functions for now
  const login = (user: AuthUser) => {
    const mockSession: AuthSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_at: Date.now() + 3600000,
      expires_in: 3600,
      token_type: 'Bearer'
    };

    setState({
      user,
      session: mockSession,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  };

  const logout = () => {
    setState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  const signup = (user: AuthUser) => {
    login(user); // For now, just treat signup like login
  };

  const updateUser = (user: AuthUser) => {
    setState(prev => ({
      ...prev,
      user,
    }));
  };

  const signOut = async () => {
    logout();
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions?.some(p => p.name === permission) || false;
  };

  const isAdmin = (): boolean => {
    return state.user?.role === 'admin' || false;
  };

  const isViewer = (): boolean => {
    return state.user?.role === 'viewer' || false;
  };

  const isGuest = (): boolean => {
    return !state.isAuthenticated;
  };

  const isManager = (): boolean => {
    return state.user?.role === 'manager' || false;
  };

  const isUser = (): boolean => {
    return state.user?.role === 'user' || false;
  };

  const setSession = (session: AuthSession | null) => {
    setState(prev => ({
      ...prev,
      session,
      isAuthenticated: !!session,
    }));
  };

  useEffect(() => {
    // Initialize auth state
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  const value: AuthContextType = {
    state,
    user: state.user,
    session: state.session,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    signup,
    updateUser,
    signOut,
    hasPermission,
    isAdmin,
    isViewer,
    isLoggedIn: state.isAuthenticated,
    isGuest,
    isManager,
    isUser,
    setSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a fallback auth context instead of throwing
    return {
      state: {
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: () => {},
      logout: () => {},
      signup: () => {},
      updateUser: () => {},
      signOut: async () => {},
      hasPermission: () => false,
      isAdmin: () => false,
      isViewer: () => false,
      isLoggedIn: false,
      isGuest: () => true,
      isManager: () => false,
      isUser: () => false,
      setSession: () => {},
    };
  }
  return context;
};

// Export both as named exports
export { AuthProvider };
export default AuthProvider;
