
import { BaseEntity } from './index';

export interface User extends BaseEntity {
  email: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
  preferences?: Record<string, any>;
  socialLinks?: Record<string, string>;
  role?: 'user' | 'admin' | 'moderator';
}
