
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
 * User permission enum
 */
export enum UserPermission {
  CREATE_CARD = 'create_card',
  EDIT_CARD = 'edit_card',
  DELETE_CARD = 'delete_card',
  CREATE_COLLECTION = 'create_collection',
  EDIT_COLLECTION = 'edit_collection',
  DELETE_COLLECTION = 'delete_collection',
  ADMIN_ACCESS = 'admin_access',
  TEAM_MANAGEMENT = 'team_management'
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
  displayName?: string;        // Required by CommentSection
  username?: string;
  avatarUrl?: string;
  role?: string;               // Required by CommentSection
  profile?: UserProfile;
}

/**
 * Auth user interface with authentication-specific properties
 */
export interface AuthUser extends User {
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
  permissions?: UserPermission[];
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
