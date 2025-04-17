
export enum UserPermission {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export enum UserRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  role?: UserRole;
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
  displayName?: string; // Add displayName property
}
