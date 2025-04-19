
import { BaseEntity } from './index';
import { CardRarity } from './cardTypes';

/**
 * Enhanced card types with additional features
 */
export interface EnhancedCard extends BaseEntity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[]; // Changed from optional to required
  userId: string;
  effects: string[];
  
  // Enhanced fields
  series?: string;
  edition?: string;
  seriesId?: string; // Add seriesId field
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
  designMetadata: any; // Make this required
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
  name: string;
  title?: string; // Optional as some code uses name, some uses title
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
  name?: string;
  title: string;
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
