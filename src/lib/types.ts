
// Base types that might be used across modules
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

// Add JsonObject type that was missing
export type JsonObject = { [key: string]: JsonValue };

// Add serializeMetadata utility function
export const serializeMetadata = (metadata: any): string => {
  return JSON.stringify(metadata || {});
};

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
    teamSpecific?: boolean; // Added to fix OaklandMemoryCreator error
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
    cardNumber?: string;
    artist?: string;
  };
  oaklandMemory?: OaklandMemoryData;
  teamId?: string; // Added for compatibility
}

// Define the GroupUploadType enum
export enum GroupUploadType {
  GROUP = 'group',
  MEMORABILIA = 'memorabilia',
  MIXED = 'mixed',
  PHOTOS = 'photos',
  CARDS = 'cards'
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
  template: string; // Required property for template
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
export type { CardEffect, EffectSettings as CardEffectSettings } from './types/cardEffects';

// Don't re-export enhancedCardTypes directly to avoid ambiguity
import * as EnhancedCardTypes from './types/enhancedCardTypes';
export type { 
  HotspotData as EnhancedHotspotData,
  EnhancedCard as ExtendedCard,
  Series as EnhancedSeries,
  Deck,
} from './types/enhancedCardTypes';
// Re-export CardRarity from cardTypes, not enhancedCardTypes
export type { CardRarity } from './types/cardTypes';

// For backward compatibility, keep the old imports as well
import * as OldTypes from '@/types/card';
export const oldTypes = OldTypes;

// Card Interface - explicitly export for use in other modules
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backImageUrl?: string;
  thumbnailUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  designMetadata: DesignMetadata; // Required
  effects: string[];
  isPublic?: boolean;
  player?: string;
  team?: string;
  teamId?: string; // Added for compatibility
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
  rarity?: CardRarity;
  reactions?: Reaction[];
  fabricSwatches?: any[];
  viewCount?: number;
  name?: string;
  collectionId?: string;
  // Extra fields needed for compatibility
  instagramSource?: string;
  stats?: CardStats; // Add stats field for ImmersiveCardViewer
}

// Card stats for use in ImmersiveCardViewer
export interface CardStats {
  battingAverage?: string;
  homeRuns?: number;
  rbis?: number;
  era?: string;
  wins?: number;
  strikeouts?: number;
  careerYears?: string;
  ranking?: string;
  [key: string]: any;
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
  role: UserRole; // Make required for consistency
  bio?: string; // Add bio for Profile pages
  permissions?: UserPermission[]; // Add permissions for Dashboard
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
  cardIds?: string[]; // Added for compatibility with collectionOperations
  teamId?: string; // Added for compatibility
  allowComments?: boolean;
  designMetadata?: any;
  tags?: string[];
  instagramSource?: string;
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
  createdAt: string; // Added required
  updatedAt?: string;
  user?: User;
}

// Add DbCollection interface
export interface DbCollection {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: string;
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}
