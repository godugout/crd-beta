
import { User, UserRole } from '@/lib/types/user';

// Mock user repository implementation
export const userRepository = {
  getUsers: async () => {
    return { data: [], error: null };
  },
  
  getUserById: async (id: string) => {
    const mockUser: User = {
      id,
      email: 'user@example.com',
      name: 'Test User',
      role: UserRole.FAN,
      avatarUrl: 'https://ui-avatars.com/api/?name=Test+User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { data: mockUser, error: null };
  },
  
  getUserByEmail: async (email: string) => {
    const mockUser: User = {
      id: 'user-123',
      email,
      name: 'Test User',
      role: UserRole.FAN,
      avatarUrl: 'https://ui-avatars.com/api/?name=Test+User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { data: mockUser, error: null };
  },
  
  createUser: async (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email || 'user@example.com',
      name: userData.name || 'New User',
      role: userData.role || UserRole.FAN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    };
    return { data: newUser, error: null };
  },
  
  updateUser: async (id: string, userData: Partial<User>) => {
    console.log(`Updating user ${id}:`, userData);
    return { data: { id, ...userData } as User, error: null };
  },
  
  deleteUser: async (id: string) => {
    console.log(`Deleting user ${id}`);
    return { success: true, error: null };
  }
};
