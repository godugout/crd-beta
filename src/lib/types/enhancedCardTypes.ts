
// Enhanced card types for the card system
import { BaseCard } from './cardTypes';

/**
 * Enhanced Card with additional functionality
 */
export interface EnhancedCard extends BaseCard {
  seriesId?: string; 
  deckId?: string;
  specialFeatures?: string[];
  interactiveElements?: string[];
  graded?: boolean;
  gradingService?: string;
  gradingScore?: string;
  hotspots?: HotspotData[];
  backSideImage?: string;
  cardNumber?: string;
  artist?: string;
  artistId?: string;
  edition?: number;
  editionSize?: number;
  releaseDate?: string;
  qrCodeData?: string;
  marketData?: {
    price?: number;
    currency?: string;
    lastSoldPrice?: number;
    availableForSale?: boolean;
  };
  rarity?: CardRarity;
}

/**
 * Card rarity types
 */
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'one-of-one';

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
 * Series of cards
 */
export interface Series {
  id: string;
  name?: string;
  title: string;
  description: string;
  releaseDate: string;
  cards: EnhancedCard[];
  totalCards: number;
  rarity?: string;
  creator?: string;
  artistId?: string;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  isPublished?: boolean;
  cardIds: string[];
  releaseType?: 'standard' | 'limited' | 'exclusive';
}

/**
 * Deck of cards
 */
export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: EnhancedCard[];
  creator?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  coverImageUrl?: string;
  cardIds: string[];
}

/**
 * Card set for play
 */
export interface CardSet {
  id: string;
  name: string;
  description: string;
  cards: EnhancedCard[];
  category: string;
  rules?: string;
  createdAt: string;
  updatedAt: string;
}
