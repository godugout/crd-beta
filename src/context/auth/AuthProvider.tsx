
import React, { createContext, useState, useEffect } from 'react';
import { ROLE_PERMISSIONS } from '@/lib/types/user';
import { UserRole } from '@/lib/types/user';
import { User } from '@/lib/types';

// Context interface
export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  updateProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing user on mount
  useEffect(() => {
    // Simulate loading user from storage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);
  
  // Handle login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock successful login after 1s
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser: User = {
        id: '123',
        email,
        name: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: UserRole.USER,
        isVerified: true,
        isActive: true,
        permissions: ROLE_PERMISSIONS[UserRole.USER],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save user
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Handle signup
  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Mock successful signup after 1s
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser: User = {
        id: '123',
        email,
        name,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: UserRole.USER,
        isVerified: true,
        isActive: true,
        permissions: ROLE_PERMISSIONS[UserRole.USER],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save user
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle profile update
  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Mock successful update after 1s
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // Save updated user
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Profile update failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout, 
        signup, 
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
