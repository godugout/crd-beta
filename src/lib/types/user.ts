
import { BaseEntity } from './index';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  TEAM_ADMIN = 'team_admin',
  ARTIST = 'artist'
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string; // Make name required
  avatarUrl?: string;
  username?: string;
  role?: UserRole;
  isVerified: boolean;
  isActive: boolean;
  permissions: string[];
  displayName?: string;
  bio?: string; // Add the missing bio property
}

// Define role permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.ADMIN]: ['read:all', 'write:all', 'delete:all', 'manage:users'],
  [UserRole.MODERATOR]: ['read:all', 'moderate:content', 'delete:flagged'],
  [UserRole.TEAM_ADMIN]: ['read:team', 'write:team', 'delete:team', 'manage:team'],
  [UserRole.ARTIST]: ['read:own', 'write:own', 'delete:own', 'create:series']
};
