
import { JsonValue } from './index';

export enum UserRole {
  ADMIN = 'admin',
  ARTIST = 'artist',
  USER = 'user',
  GUEST = 'guest'
}

export enum UserPermission {
  CREATE_CARD = 'create:card',
  DELETE_CARD = 'delete:card',
  EDIT_CARD = 'edit:card',
  CREATE_COLLECTION = 'create:collection',
  DELETE_COLLECTION = 'delete:collection',
  EDIT_COLLECTION = 'edit:collection',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_USERS = 'manage:users',
  APPROVE_SUBMISSIONS = 'approve:submissions'
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: [
    UserPermission.CREATE_CARD,
    UserPermission.DELETE_CARD,
    UserPermission.EDIT_CARD,
    UserPermission.CREATE_COLLECTION,
    UserPermission.DELETE_COLLECTION,
    UserPermission.EDIT_COLLECTION,
    UserPermission.VIEW_ANALYTICS,
    UserPermission.MANAGE_USERS,
    UserPermission.APPROVE_SUBMISSIONS
  ],
  [UserRole.ARTIST]: [
    UserPermission.CREATE_CARD,
    UserPermission.EDIT_CARD,
    UserPermission.CREATE_COLLECTION,
    UserPermission.EDIT_COLLECTION
  ],
  [UserRole.USER]: [
    UserPermission.CREATE_COLLECTION,
    UserPermission.EDIT_COLLECTION
  ],
  [UserRole.GUEST]: []
};

export interface User {
  id: string;
  email: string;
  displayName: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  permissions?: UserPermission[];
  metadata?: Record<string, JsonValue>;
  [key: string]: JsonValue | undefined;
}
