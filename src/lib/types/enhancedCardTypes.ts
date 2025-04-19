
import { BaseEntity } from './index';
import { CardRarity } from './cardTypes';

/**
 * Enhanced card types with additional features
 */
export interface EnhancedCard extends BaseEntity {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  effects?: string[];
  
  // Enhanced fields
  series?: string;
  edition?: string;
  serialNumber?: string;
  rarity: CardRarity;
  artist?: string;
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
}

/**
 * Hotspot for interactive cards
 */
export interface HotspotData {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'info' | 'link' | 'audio' | 'video' | 'ar';
  content: {
    title?: string;
    description?: string;
    url?: string;
    mediaUrl?: string;
  };
  style?: {
    color?: string;
    icon?: string;
  };
}

/**
 * Series definition for card collections
 */
export interface Series {
  id: string;
  name: string;
  description?: string;
  cards: EnhancedCard[];
  totalCards: number;
  releaseDate?: string;
  creator?: string;
  rarity?: CardRarity;
  
  // Additional properties used in components
  title?: string;
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
  title: string;
  description?: string;
  coverImageUrl?: string;
  cards: EnhancedCard[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  visibility?: 'public' | 'private' | 'team';
  totalCards?: number;
}

export { CardRarity };
