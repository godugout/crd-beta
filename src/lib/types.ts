
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  backImageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  designMetadata?: any;
  effects?: string[];
  isPublic?: boolean;
  player?: string;
  team?: string;
  year?: string;
  sport?: string;
  cardType?: string;
  set?: string;
  condition?: string;
  manufacturer?: string;
  cardNumber?: string;
  grade?: string;
  gradingCompany?: string;
  height?: number;
  width?: number;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
}

export interface GroupMeta {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
}

export enum GroupUploadType {
  PHOTOS = 'photos',
  CARDS = 'cards',
  MIXED = 'mixed'
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

// Add UserRole enum to be exported directly from this file
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

/**
 * User permission types
 */
export type UserPermission = 
  | 'read:own' 
  | 'write:own' 
  | 'delete:own' 
  | 'read:all' 
  | 'write:all' 
  | 'delete:all' 
  | 'premium:features'
  | 'create:premium'
  | 'moderate:content'
  | 'all';

/**
 * Role to permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.PREMIUM]: ['read:own', 'write:own', 'delete:own', 'premium:features'],
  [UserRole.CREATOR]: ['read:own', 'write:own', 'delete:own', 'create:premium'],
  [UserRole.MODERATOR]: ['read:own', 'write:own', 'delete:own', 'moderate:content']
};
