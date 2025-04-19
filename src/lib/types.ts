
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
  artist?: string; // Added for CardDetailPanel
  rarity?: string; // Added for CardDetailPanel
  reactions?: any[]; // Added for CardItem
  fabricSwatches?: any[]; // Added for CardBack
  viewCount?: number; // Added for CardGrid
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  displayName?: string; // Added for CommentSection
  username?: string; // Added for CommentSection
}

export interface Collection {
  id: string;
  title: string;
  name?: string; // Added for compatibility with components that use name
  description?: string;
  thumbnailUrl?: string;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
  coverImageUrl?: string; // Added for CollectionsSection
  visibility?: 'public' | 'private' | 'team' | 'unlisted'; // Added for CollectionGrid
  featured?: boolean; // Added for CollectionGrid
  cards?: Card[]; // Added for CollectionGrid
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

// User Role, Permission and Mapping
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

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

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [UserRole.ADMIN]: ['all'],
  [UserRole.USER]: ['read:own', 'write:own', 'delete:own'],
  [UserRole.PREMIUM]: ['read:own', 'write:own', 'delete:own', 'premium:features'],
  [UserRole.CREATOR]: ['read:own', 'write:own', 'delete:own', 'create:premium'],
  [UserRole.MODERATOR]: ['read:own', 'write:own', 'delete:own', 'moderate:content']
};

// Adding Comment and Reaction for components that need them
export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Reaction {
  id: string;
  userId: string;
  targetType: 'card' | 'collection' | 'comment' | string;
  targetId: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  user?: User;
}
