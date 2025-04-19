
import { BaseEntity } from './index';
import { UserRole, UserPermission, ROLE_PERMISSIONS } from '../types';

// Re-export what we're importing from the main types file for backward compatibility
export { UserRole, UserPermission, ROLE_PERMISSIONS };

/**
 * User interface for authentication and profiles
 */
export interface User extends BaseEntity {
  email: string;
  name?: string;
  displayName?: string; // Already defined
  username?: string; // Already defined
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
