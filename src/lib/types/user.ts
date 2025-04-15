
import { BaseEntity } from './index';
import { Collection } from './collection';
import { Card } from './card';

export interface User extends BaseEntity {
  email: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  collections?: Collection[];
  cards?: Card[];
  followingCount?: number;
  followerCount?: number;
}
