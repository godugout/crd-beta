
import { BaseEntity } from './index';

/**
 * Enumeration of possible user roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

/**
 * Type definition for user permissions
 * These control specific actions users can perform within the application
 */
export type UserPermission = 
  | 'read:cards' 
  | 'write:cards' 
  | 'delete:cards'
  | 'read:collections'
  | 'write:collections'
  | 'delete:collections'
  | 'read:users'
  | 'write:users'
  | 'admin:access'
  | 'create:series'
  | 'read:all'
  | 'write:all';

/**
 * Mapping of roles to permissions
 * Defines which permissions are granted to each role by default
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['read:cards', 'write:cards', 'delete:cards', 'read:collections', 'write:collections', 'delete:collections', 'read:users', 'write:users', 'admin:access', 'create:series', 'read:all', 'write:all'],
  [UserRole.MODERATOR]: ['read:cards', 'write:cards', 'read:collections', 'write:collections', 'read:users'],
  [UserRole.USER]: ['read:cards', 'write:cards', 'read:collections'],
  [UserRole.GUEST]: ['read:cards', 'read:collections']
};

/**
 * User interface representing a user in the system
 */
export interface User extends BaseEntity {
  email: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  role: UserRole;
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  isActive?: boolean;
  teamIds?: string[];
}

/**
 * Team interface representing a team in the system
 */
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  memberIds?: string[];
}

/**
 * TeamMember interface representing a member of a team
 */
export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}
