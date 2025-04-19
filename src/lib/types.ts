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

// Design Metadata Interface
export interface DesignMetadata {
  cardStyle: {
    template: string;
    effect: string;
    borderRadius: string;
    borderColor: string;
    frameColor: string;
    frameWidth: number;
    shadowColor: string;
  };
  textStyle: {
    titleColor: string;
    titleAlignment: string;
    titleWeight: string;
    descriptionColor: string;
  };
  marketMetadata: {
    isPrintable: boolean;
    isForSale: boolean;
    includeInCatalog: boolean;
  };
  cardMetadata: {
    category: string;
    cardType: string;
    series: string;
  };
}

// Define the GroupUploadType enum
export enum GroupUploadType {
  PHOTOS = 'photos',
  CARDS = 'cards',
  MIXED = 'mixed'
}

// For Oakland Memories
export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}

// Re-export from main types.ts file for compatibility
export { DEFAULT_DESIGN_METADATA } from './utils/cardDefaults';

// Export updated type definitions
export * from './types/cardTypes';
export * from './types/interaction';
export * from './types/user';
export * from './types/collection';
export * from './types/instagram';
export * from './types/teamTypes';
export type { CardEffect, CardEffectSettings } from './types/cardEffects';

// Don't re-export enhancedCardTypes directly to avoid ambiguity
import * as EnhancedCardTypes from './types/enhancedCardTypes';
export type { 
  HotspotData as EnhancedHotspotData,
  EnhancedCard as ExtendedCard,
  Series as EnhancedSeries,
  Deck,
  CardRarity,
} from './types/enhancedCardTypes';

// For backward compatibility, keep the old imports as well
import * as OldTypes from '@/types/card';
export const oldTypes = OldTypes;

// Card Interface
export interface Card {
  id: string;
  title: string;
  description: string; // Make required for compatibility
  imageUrl: string;
  backImageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  designMetadata?: DesignMetadata;
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
  artist?: string;
  rarity?: string;
  reactions?: Reaction[];
  fabricSwatches?: any[];
  viewCount?: number;
  name?: string;
  collectionId?: string;
}

// User Interface
export interface User {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  displayName?: string;
  username?: string;
  role?: UserRole;
}

// Collection Interface
export interface Collection {
  id: string;
  title: string;
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic?: boolean;
  coverImageUrl?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  featured?: boolean;
  cards?: Card[];
  allowComments?: boolean;
  designMetadata?: any;
  tags?: string[]; // Add tags support
}

// Comment Interface
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

// Reaction Interface
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
