
import { BaseEntity } from './index';

/**
 * User roles for permission management
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

/**
 * User permission types
 */
export type UserPermission = 
  | 'read:own' 
  | 'write:own' 
  | 'delete:own' 
  | 'read:all' 
  | 'write:all' 
  | 'delete:all' 
  | 'premium:features'
  | 'create:premium'
  | 'moderate:content'
  | 'all';

/**
 * Role to permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.PREMIUM]: ['read:own', 'write:own', 'delete:own', 'premium:features'],
  [UserRole.CREATOR]: ['read:own', 'write:own', 'delete:own', 'create:premium'],
  [UserRole.MODERATOR]: ['read:own', 'write:own', 'delete:own', 'moderate:content']
};

/**
 * User interface for authentication and profiles
 */
export interface User extends BaseEntity {
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  permissions?: UserPermission[];
  preferences?: Record<string, any>;
}

/**
 * Extended user profile with additional information
 */
export interface UserProfile extends User {
  followers?: number;
  following?: number;
  cardCount?: number;
  collectionCount?: number;
  joinDate?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

/**
 * Database representation of User for Supabase mapping
 */
export interface DbUser {
  id: string;
  email: string;
  display_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role?: string;
}
