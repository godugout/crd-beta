
import { BaseEntity } from './index';
import { CardRarity } from './cardTypes';

/**
 * Enhanced card types with additional features
 */
export interface EnhancedCard extends BaseEntity {
  title: string;
  description: string; // Changed from optional to required for compatibility
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId: string; // Made required for compatibility
  effects: string[];
  
  // Enhanced fields
  series?: string;
  edition?: string; // Changed to string for compatibility
  serialNumber?: string;
  rarity: CardRarity;
  artist?: string;
  artistId?: string;
  releaseDate?: string;
  license?: string;
  
  // Interactive elements
  hotspots?: HotspotData[];
  
  // Market data
  mintDate?: string;
  mintQuantity?: number;
  currentOwner?: string;
  previousOwners?: string[];
  price?: number;
  forSale?: boolean;
  marketData?: Record<string, any>;
  editionSize?: number;
  cardNumber?: string;
  
  // Required fields for compatibility with base Card
  createdAt: string;
  updatedAt: string;
  
  // Additional fields to fix type mismatches
  seriesId?: string; // Added for compatibility with CardEnhancedContext
}

/**
 * Hotspot for interactive cards
 */
export interface HotspotData {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'info' | 'link' | 'audio' | 'video' | 'ar' | 'text' | 'image';
  content: {
    title?: string;
    description?: string;
    url?: string;
    mediaUrl?: string;
  } | string;  // Support both object and string content
  style?: {
    color?: string;
    icon?: string;
  };
  visible?: boolean;
  width?: number;
  height?: number;
}

/**
 * Series definition for card collections
 */
export interface Series {
  id: string;
  name: string; // Required field
  title?: string; // Optional field to maintain compatibility
  description?: string;
  cards: EnhancedCard[];
  totalCards: number;
  releaseDate?: string;
  creator?: string;
  rarity?: CardRarity;
  
  // Additional properties used in components
  coverImageUrl?: string;
  artistId?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  releaseType?: string;
  cardIds?: string[];
}

/**
 * Deck interface for card grouping
 */
export interface Deck {
  id: string;
  title: string; // Required field
  name?: string; // Optional field to maintain compatibility
  description?: string;
  coverImageUrl?: string;
  cards: EnhancedCard[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  visibility?: 'public' | 'private' | 'team';
  totalCards?: number;
  isPublic?: boolean;
  cardIds?: string[];
}

export { CardRarity };
