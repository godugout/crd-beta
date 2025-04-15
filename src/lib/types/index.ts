// Re-export all types from the new location
// This provides backward compatibility with existing code
export * from '@/types/card';

// Export from our newly created type files
export * from './card';
export * from './collection';
export * from './user';
export * from './interaction';

// Base types that might be used across modules
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Common types used throughout the application
export interface Card extends BaseEntity {
  title: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  collectionId?: string;
  metadata?: Record<string, any>;
  effects?: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  isPublic?: boolean;
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  artist?: string;
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  name?: string; // For backward compatibility
}

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

export interface Collection extends BaseEntity {
  title: string;
  description: string;
  coverImageUrl?: string;
  userId: string;
  cards?: Card[];
  isPublic?: boolean;
  tags?: string[];
  featured?: boolean;
  viewCount?: number;
  name?: string; // For backward compatibility
}

export interface Comment extends BaseEntity {
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  parentId?: string;
  user?: User;
  replies?: Comment[];
  reactions?: Reaction[];
}

export interface Reaction extends BaseEntity {
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  user?: User;
}

export interface OaklandMemoryData extends BaseEntity {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  historicalContext?: string;
  personalSignificance?: string;
  userId?: string;
}

export interface Town extends BaseEntity {
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  location?: string;
  website?: string;
  memberCount?: number;
}

export interface TownMember extends BaseEntity {
  townId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  user?: User;
}
