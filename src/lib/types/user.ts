
import { BaseEntity } from './index';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

export type UserPermission = 
  | 'read:own'
  | 'write:own'
  | 'delete:own'
  | 'read:all'
  | 'write:all'
  | 'delete:all'
  | 'manage:users'
  | 'manage:settings';

export interface User extends BaseEntity {
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  permissions: UserPermission[] | string[];
  bio?: string;
}

export interface UserProfile extends BaseEntity {
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  permissions: UserPermission[] | string[];
  bio?: string;
}

export interface UserStats {
  cardsCreated: number;
  collectionsCreated: number;
  favorites: number;
  followers: number;
  following: number;
}

export interface UserWithStats extends User {
  stats: UserStats;
}
