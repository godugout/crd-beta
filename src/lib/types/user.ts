
import { BaseEntity } from '../types';

// Define UserRole enum
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CREATOR = 'creator',
  USER = 'user',
  GUEST = 'guest'
}

// Define UserPermission enum
export enum UserPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_CONTENT = 'manage_content',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SYSTEM = 'manage_system',
  ACCESS_API = 'access_api',
  MODERATE_COMMENTS = 'moderate_comments',
  CREATE_CONTENT = 'create_content',
  EDIT_OWN_CONTENT = 'edit_own_content',
  DELETE_OWN_CONTENT = 'delete_own_content',
  CREATE_COLLECTIONS = 'create_collections',
  EDIT_OWN_COLLECTIONS = 'edit_own_collections',
  VIEW_CONTENT = 'view_content'
}

export interface User extends BaseEntity {
  email: string;
  name?: string;
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  role?: UserRole;
  createdAt: string;
  updatedAt?: string;
  bio?: string;
  permissions?: UserPermission[]; 
}

// Removed the duplicate exports at the end
