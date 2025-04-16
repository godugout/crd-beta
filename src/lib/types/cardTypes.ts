/**
 * Consolidated Card Types for Cardshow (CRD)
 * This file serves as the central source of truth for all card-related types
 */

import { BaseEntity, JsonValue } from './index';
import { Reaction, Comment } from './interaction';
import { User } from './user';

/**
 * Fabric Swatch definition for card memorabilia
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
 * Card statistics for sports cards
 */
export interface CardStats {
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
  careerYears?: string;
  ranking?: string;
}

/**
 * Card style definition for visual appearance
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
  [key: string]: JsonValue | undefined;
}

/**
 * Text style definition for card typography
 */
export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  titleColor?: string;
  titleAlignment?: string;
  titleWeight?: string;
  descriptionColor?: string;
  [key: string]: JsonValue | undefined;
}

/**
 * Card effect definition for visual effects
 */
export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

/**
 * Settings for card effects
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
 * Card layer for the card creation canvas
 */
export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  content: string | any;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number | 'auto';
    height: number | 'auto';
  };
  rotation: number;
  opacity: number;
  zIndex: number;
  visible?: boolean;
  style?: Record<string, any>;
  locked?: boolean;
  effectIds?: string[];
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
  };
  imageUrl?: string;
  shapeType?: string;
  color?: string;
  [key: string]: any;
}

/**
 * Card metadata for additional card information
 */
export interface CardMetadata {
  edition?: string;
  serialNumber?: string;
  certification?: string;
  gradeScore?: string;
  category?: string;
  series?: string;
  cardType?: string;
  cardStyle?: CardStyle;
  textStyle?: TextStyle;
  effects?: string[];
  layers?: CardLayer[];
  effectClasses?: string;
  [key: string]: JsonValue | undefined;
}

/**
 * Market metadata for card marketplace information
 */
export interface MarketMetadata {
  lastSoldPrice?: number;
  currentAskingPrice?: number;
  estimatedMarketValue?: number;
  isPrintable?: boolean;
  isForSale?: boolean;
  includeInCatalog?: boolean;
  [key: string]: JsonValue | undefined;
}

/**
 * Oakland Memory Data definition
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
  [key: string]: JsonValue | undefined;
}

/**
 * Design metadata for card design information
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
  [key: string]: JsonValue | undefined;
}

/**
 * Hotspot data for interactive cards
 */
export interface HotspotData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: 'text' | 'link' | 'image' | 'video';
  visible: boolean;
}

/**
 * Card rarity types
 */
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'one-of-one';

/**
 * Base Card interface containing common properties
 */
export interface BaseCard extends BaseEntity {
  title: string;
  description?: string;
  imageUrl: string;
  image?: string; // Legacy support for older components
  thumbnailUrl?: string;
  tags?: string[];
  collectionId?: string;
  userId?: string;
  teamId?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
  effects: string[]; // Required for card viewer
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  
  // Baseball card properties
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  artistName?: string; // Use artistName instead of artist to avoid conflicts
  artist?: string; // For backward compatibility
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  stats?: CardStats;
  
  // Design related
  name?: string; // Legacy support
  cardStyle?: string;
  backTemplate?: string;
  designMetadata?: DesignMetadata;
  
  // Market data
  price?: number;
  estimatedValue?: string;
  condition?: string;
  rarity?: CardRarity;
  
  // Additional fields needed by some components
  creatorId?: string;
}

/**
 * Main Card interface that can be extended for specific use cases
 */
export interface Card extends BaseCard {}

/**
 * Enhanced Card with additional fields for premium features
 */
export interface EnhancedCard extends Card {
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistProfile?: User; // Use artistProfile instead of artist
  edition?: number;
  editionSize?: number;
  releaseDate?: string;
  qrCodeData?: string;
  hotspots?: HotspotData[];
  marketData?: {
    price?: number;
    currency?: string;
    availableForSale?: boolean;
    lastSoldPrice?: number;
    lastSoldDate?: string;
  };
}

/**
 * Series definition for card collections
 */
export interface Series {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  artistId: string;
  artist?: User;
  createdAt: string;
  updatedAt: string;
  releaseDate: string;
  totalCards: number;
  isPublished: boolean;
  cardIds: string[];
  cards?: EnhancedCard[];
  releaseType: 'standard' | 'limited' | 'exclusive';
}

/**
 * Database representation of Card for Supabase mapping
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
  design_metadata?: any;
  creator_id: string;
  price?: number;
  edition_size: number;
  rarity: string;
}

// Re-export Reaction for components that need it
export { Reaction } from './interaction';
