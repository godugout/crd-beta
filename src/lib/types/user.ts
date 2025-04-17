
import { BaseEntity } from './index';

export enum UserPermission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  TEAM_MEMBER = 'team_member',
  TEAM_ADMIN = 'team_admin',
  MODERATOR = 'moderator' // Added missing moderator role
}

// Define User interface
export interface User extends BaseEntity {
  username?: string;
  email: string;
  displayName?: string;
  name?: string; // Add name property for backward compatibility
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  permissions: UserPermission[];
  role: UserRole;
}

// Define role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [UserRole.USER]: [UserPermission.READ],
  [UserRole.ADMIN]: [UserPermission.READ, UserPermission.WRITE],
  [UserRole.SUPER_ADMIN]: [UserPermission.READ, UserPermission.WRITE, UserPermission.ADMIN, UserPermission.SUPER_ADMIN],
  [UserRole.TEAM_MEMBER]: [UserPermission.READ],
  [UserRole.TEAM_ADMIN]: [UserPermission.READ, UserPermission.WRITE],
  [UserRole.MODERATOR]: [UserPermission.READ, UserPermission.WRITE]
};
