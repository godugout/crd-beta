
// User permissions constants
export enum UserPermission {
  CREATE_CARD = 'create_card',
  EDIT_CARD = 'edit_card',
  DELETE_CARD = 'delete_card',
  VIEW_DASHBOARD = 'view_dashboard',
  MANAGE_USERS = 'manage_users',
  ADMIN_ACCESS = 'admin_access'
}

// User roles
export enum UserRole {
  ADMIN = 'admin',
  ARTIST = 'artist',
  FAN = 'fan',
  GUEST = 'guest',
  MODERATOR = 'moderator',
  USER = 'user'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    UserPermission.CREATE_CARD,
    UserPermission.EDIT_CARD,
    UserPermission.DELETE_CARD,
    UserPermission.VIEW_DASHBOARD,
    UserPermission.MANAGE_USERS,
    UserPermission.ADMIN_ACCESS
  ],
  [UserRole.ARTIST]: [
    UserPermission.CREATE_CARD,
    UserPermission.EDIT_CARD,
    UserPermission.DELETE_CARD,
    UserPermission.VIEW_DASHBOARD
  ],
  [UserRole.FAN]: [
    UserPermission.VIEW_DASHBOARD
  ],
  [UserRole.GUEST]: [],
  [UserRole.MODERATOR]: [
    UserPermission.VIEW_DASHBOARD,
    UserPermission.MANAGE_USERS
  ],
  [UserRole.USER]: [
    UserPermission.VIEW_DASHBOARD
  ]
};

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatarUrl?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  isActive?: boolean;
}
