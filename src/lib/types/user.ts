
import { BaseEntity } from './index';

/**
 * Enumeration of possible user roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
  ARTIST = 'artist',  // Added ARTIST role
  FAN = 'fan'         // Added FAN role
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
  | 'write:all'
  | 'create:card'   // Added additional permissions
  | 'edit:card'     // to match those used in the code
  | 'delete:card'
  | 'view:dashboard'
  | 'manage:users';

// Constants for permission values to use in code
export const UserPermissionValues = {
  CREATE_CARD: 'create:card' as UserPermission,
  EDIT_CARD: 'edit:card' as UserPermission,
  DELETE_CARD: 'delete:card' as UserPermission,
  VIEW_DASHBOARD: 'view:dashboard' as UserPermission,
  MANAGE_USERS: 'manage:users' as UserPermission,
  ADMIN_ACCESS: 'admin:access' as UserPermission,
  READ_ALL: 'read:all' as UserPermission,
  WRITE_ALL: 'write:all' as UserPermission
};

/**
 * Mapping of roles to permissions
 * Defines which permissions are granted to each role by default
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['read:cards', 'write:cards', 'delete:cards', 'read:collections', 'write:collections', 'delete:collections', 'read:users', 'write:users', 'admin:access', 'create:series', 'read:all', 'write:all', 'create:card', 'edit:card', 'delete:card', 'view:dashboard', 'manage:users'],
  [UserRole.MODERATOR]: ['read:cards', 'write:cards', 'read:collections', 'write:collections', 'read:users', 'create:card', 'edit:card'],
  [UserRole.USER]: ['read:cards', 'write:cards', 'read:collections', 'create:card'],
  [UserRole.GUEST]: ['read:cards', 'read:collections'],
  [UserRole.ARTIST]: ['read:cards', 'write:cards', 'read:collections', 'write:collections', 'create:card', 'edit:card', 'create:series'],
  [UserRole.FAN]: ['read:cards', 'read:collections']
};

/**
 * User interface representing a user in the system
 */
export interface User extends BaseEntity {
  email: string;
  name?: string;
  username?: string;
  displayName?: string; // Added displayName
  avatarUrl?: string;
  role: UserRole;
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  isActive?: boolean;
  teamIds?: string[];
  bio?: string;       // Added bio
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
