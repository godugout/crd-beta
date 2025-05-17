import { Card } from './cardTypes';
import { Team, TeamMember } from './teamTypes';

/**
 * Core user interface
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: UserRole;
  teams?: Team[];
  cards?: Card[];
  username?: string;
  bio?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  preferences?: Record<string, any>;
  isVerified?: boolean;
}

/**
 * User roles for authorization
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
  VIEWER = 'viewer'  // Add VIEWER role for backward compatibility
}

/**
 * User permissions for fine-grained access control
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'all';
}

// Add UserPermission type alias for backward compatibility
export type UserPermission = string;

/**
 * User profile for public display
 */
export interface UserProfile {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  website?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  featuredCards?: Card[];
  badges?: string[];
}

/**
 * Extended user stats
 */
export interface UserStats {
  totalCards: number;
  totalCollections: number;
  totalLikes: number;
  totalViews: number;
  completedChallenges: number;
  streak: number;
  memberSince: string;
  lastActive: string;
}

/**
 * User settings
 */
export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  privacyOptions: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityVisibility: 'public' | 'private' | 'friends';
    discoverability: boolean;
  };
}

// Re-exports from other related types
export { Team, TeamMember };

// Export Comment and Collection type from their respective files
export type { Comment } from './interaction';
export type { Collection } from './collection';
