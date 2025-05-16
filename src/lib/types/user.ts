
import { BaseEntity } from './index';

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  CREATOR = 'creator',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

/**
 * Extended user interface with detailed profile information
 */
export interface UserProfile {
  bio?: string;
  website?: string;
  location?: string;
  favoriteTeams?: string[];
  favoriteCards?: string[];
  interests?: string[];
  joinDate?: string;
  socialLinks?: Record<string, string>;
  achievements?: string[];
  preferences?: Record<string, any>;
}

/**
 * User interface extending the base entity
 */
export interface User extends BaseEntity {
  email?: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
  profile?: UserProfile;
}

/**
 * Auth user interface with authentication-specific properties
 */
export interface AuthUser extends User {
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
  permissions?: string[];
  lastLogin?: string;
}

/**
 * Team member user interface for team context
 */
export interface TeamUser extends User {
  teamRole: string;
  joinedAt: string;
  contributions?: number;
  isActive: boolean;
}
