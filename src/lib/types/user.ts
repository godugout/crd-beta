
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  ARTIST = 'artist',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: UserRole;
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

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
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
