import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/lib/types';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const mockRegister = async (userData: Omit<User, 'id'>): Promise<User | null> => {
    try {
      setLoading(true);
      
      // Mock registration service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser: User = {
        id: 'newuser123',
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
        isActive: true,
        permissions: ['read:own']
      };
      
      setUser(mockUser);
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Registration successful! Please verify your email.');
      return mockUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      setError(error);
      toast.error(`Registration failed: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const mockLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    toast.success('Logged out successfully');
  };
  
  const mockLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Mock authentication service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const mockUser: User = {
          id: 'user123',
          email: email,
          name: 'Demo User',
          displayName: 'Demo User',
          avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isVerified: true,
          isActive: true,
          permissions: ['read:own', 'write:own']
        };
        
        setUser(mockUser);
        sessionStorage.setItem('user', JSON.stringify(mockUser));
        toast.success('Login successful!');
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      toast.error(`Login failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
