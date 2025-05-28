
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  ARTIST = 'artist',
  VIEWER = 'viewer',
  CREATOR = 'creator'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole; // Make role required
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  MODERATE = 'moderate'
}

// Create UserPermission alias for backward compatibility
export type UserPermission = Permission;

// Define role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN, Permission.MODERATE],
  [UserRole.MODERATOR]: [Permission.READ, Permission.WRITE, Permission.MODERATE],
  [UserRole.ARTIST]: [Permission.READ, Permission.WRITE],
  [UserRole.CREATOR]: [Permission.READ, Permission.WRITE],
  [UserRole.USER]: [Permission.READ],
  [UserRole.VIEWER]: [Permission.READ]
};

export interface UserProfile {
  id: string;
  userId: string;
  email: string; // Add email property
  bio?: string;
  location?: string;
  website?: string;
  role: UserRole;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    theme?: string;
    notifications?: boolean;
    privacy?: string;
  };
  stats?: {
    cardsCreated: number;
    collectionsCreated: number;
    totalViews: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Export types properly for isolatedModules
export type { User as UserType, UserProfile as UserProfileType };
