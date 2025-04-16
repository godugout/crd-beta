
/**
 * Core Types for CRD (Collector's Republic Digital) App
 * Single source of truth for all type definitions
 */

/**
 * User Roles and Permissions
 */
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

/**
 * User Interface - Core user properties
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  role: UserRole;  // Make role required for compatibility with UserProfile
  permissions?: UserPermission[];
  preferences?: Record<string, any>;
}

/**
 * Safe types for Supabase metadata
 * These types ensure all properties can be serialized to JSON
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Card Style Definition
 */
export interface CardStyle {
  borderRadius?: string;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  effect?: string;
  shadowColor?: string;
  frameWidth?: number;
  frameColor?: string;
  [key: string]: JsonValue | undefined;  // Add index signature
}

/**
 * Text Style Definition
 */
export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  titleColor?: string;
  titleAlignment?: string;
  titleWeight?: string;
  descriptionColor?: string;
  [key: string]: JsonValue | undefined;  // Add index signature
}

/**
 * Card Metadata Definition
 */
export interface CardMetadata {
  edition?: string;
  serialNumber?: string;
  certification?: string;
  gradeScore?: string;
  category?: string;
  series?: string;
  cardType?: string;
  [key: string]: JsonValue | undefined;  // Add index signature
}

/**
 * Market Metadata Definition
 */
export interface MarketMetadata {
  lastSoldPrice?: number;
  currentAskingPrice?: number;
  estimatedMarketValue?: number;
  isPrintable?: boolean;
  isForSale?: boolean;
  includeInCatalog?: boolean;
  [key: string]: JsonValue | undefined;  // Add index signature
}

/**
 * Oakland Memory Data Definition
 */
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
  template?: string;
  [key: string]: JsonValue | undefined;  // Add index signature
}

/**
 * Design Metadata Definition - Parent object for card design details
 */
export interface DesignMetadata {
  cardStyle?: CardStyle;
  textStyle?: TextStyle;
  cardMetadata?: CardMetadata;
  marketMetadata?: MarketMetadata;
  oaklandMemory?: OaklandMemoryData;
  effects?: string[];
  layers?: CardLayer[];
  effectClasses?: string;
  [key: string]: JsonValue | undefined;  // Add index signature
}

// Import CardLayer from the canonical source
import { CardLayer } from '@/components/card-creation/types/cardTypes';

/**
 * Card Effect Definition
 */
export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: Record<string, JsonValue>;
  className?: string;
}

/**
 * Card Effect Settings
 */
export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  animationEnabled?: boolean;
  [key: string]: JsonValue | undefined;
}

/**
 * Fabric Swatch Definition
 */
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

/**
 * Instagram Post Definition
 */
export interface InstagramPost {
  id: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

/**
 * Reaction Definition
 */
export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  user?: User;
}

/**
 * Card Definition - Core card properties
 */
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  player?: string;
  team?: string;
  year?: string;
  position?: string;
  rarity?: string;
  
  // Baseball card stats
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
  careerYears?: string;
  ranking?: string;
  estimatedValue?: string;
  condition?: string;
  
  // Design metadata
  designMetadata?: DesignMetadata;
  
  // Collection properties
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  creatorId?: string;
  teamId?: string;
  isPublic?: boolean;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
  oaklandMemory?: OaklandMemoryData;
  
  // Backward compatibility
  image?: string;
  name?: string;
  
  // Instagram card specific fields
  instagramUsername?: string;
  instagramPostId?: string;
  instagramPost?: InstagramPost;
  
  // Visual effects (required for card viewer)
  effects: string[];
}

/**
 * Collection Definition - Group of cards
 */
export interface Collection {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: DesignMetadata;
  cards?: Card[];
  cardIds?: string[]; // Added for backward compatibility
  instagramSource?: {
    username: string;
    lastFetched?: string;
    autoUpdate?: boolean;
  };
}

/**
 * Comment Definition
 */
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

/**
 * Team Member Definition
 */
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}

/**
 * Shop Definition
 */
export interface Shop {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerId: string;
  status: 'open' | 'closed' | 'vacation' | 'pending';
  website?: string;
  email?: string;
  specialties?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Shop Product Definition
 */
export interface ShopProduct {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  status: 'available' | 'sold' | 'draft' | 'nfs';
  productType: 'card' | 'collectible' | 'apparel' | 'custom';
  cardId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Card Design State (for card creation flow)
 */
export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
  [key: string]: any;
}

/**
 * Database Representation Types - For Supabase mapping
 */
export interface DbCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection_id?: string;
  user_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
  tags?: string[];
  design_metadata?: JsonObject;
  creator_id: string;
  price?: number;
  edition_size: number;
  rarity: string;
}

export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: JsonObject;
}

export interface DbReaction {
  id: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  comment_id?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  created_at: string;
}

/**
 * Utility function to serialize design metadata to JSON-safe format
 * @param metadata The design metadata to serialize
 */
export function serializeMetadata(metadata: DesignMetadata | undefined): JsonObject {
  if (!metadata) return {};
  
  // Create a deep copy to avoid modifying the original
  const serialized = JSON.parse(JSON.stringify(metadata)) as JsonObject;
  
  // Handle specific nested objects that might need special serialization
  if (metadata.oaklandMemory && typeof metadata.oaklandMemory === 'object') {
    serialized.oaklandMemory = JSON.parse(JSON.stringify(metadata.oaklandMemory));
  }
  
  // Handle layers which might contain functions or complex objects
  if (metadata.layers && Array.isArray(metadata.layers)) {
    serialized.layers = metadata.layers.map(layer => {
      const layerCopy = { ...layer } as Record<string, any>;
      
      // Convert any non-serializable values
      Object.keys(layerCopy).forEach(key => {
        if (typeof layerCopy[key] === 'function') {
          delete layerCopy[key];
        }
      });
      
      return layerCopy;
    });
  }
  
  return serialized;
}

/**
 * Card Effects Result Definition
 */
export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects?: (effects: string[]) => void;  // Add optional method for ImmersiveCardViewer
}

/**
 * Effect Settings Definition
 */
export interface EffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  animationEnabled?: boolean;
  [key: string]: any;
}

