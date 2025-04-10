export interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export type UserPermission = 
  | 'create:card'
  | 'edit:card'
  | 'delete:card'
  | 'create:collection'
  | 'edit:collection'
  | 'delete:collection'
  | 'manage:users'
  | 'manage:teams';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
  permissions?: UserPermission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  admin: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection',
    'edit:collection',
    'delete:collection',
    'manage:users',
    'manage:teams'
  ],
  moderator: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection',
    'edit:collection',
    'delete:collection'
  ],
  user: [
    'create:card',
    'edit:card',
    'delete:card',
    'create:collection'
  ]
};

export interface Team {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}
