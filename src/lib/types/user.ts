
import { BaseEntity, UserRole } from '../types';

export interface User extends BaseEntity {
  email: string;
  name?: string;
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  role?: UserRole;
  createdAt: string;
  updatedAt?: string;
  bio?: string; // Add bio field for profiles.ts compatibility
}

// Fixed re-export syntax
export type { UserPermission } from '../types';
