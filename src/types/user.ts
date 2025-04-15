
export type UserRole = 'artist' | 'fan' | 'admin' | 'moderator';
export type UserPermission = 'create_card' | 'edit_card' | 'delete_card' | 'view_admin_dashboard';

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: UserRole;
  bio?: string;
  permissions?: string[];
  signature?: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ROLE_PERMISSIONS: { [key in UserRole]: UserPermission[] } = {
  'admin': ['create_card', 'edit_card', 'delete_card', 'view_admin_dashboard'],
  'moderator': ['edit_card'],
  'artist': ['create_card'],
  'fan': [],
};
