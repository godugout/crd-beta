
import { CardRarity } from './cardTypes';
import { Card as BaseCard } from './card';

/**
 * EnhancedCard with additional properties, maintaining compatibility
 * with the main Card type but allowing for specialized usage
 * 
 * NOTE: This extends the main Card type but overrides 'edition'
 * to use a different format (number instead of object)
 */
export interface EnhancedCard extends Omit<BaseCard, 'edition'> {
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistName?: string;
  editionSize?: number;
  edition?: number; // Numeric edition format differs from Card's object format
  releaseDate?: string;
  qrCodeData?: string;
  marketData?: {
    price: number;
    currency: string;
    availableForSale: boolean;
    lastSoldPrice?: number;
    lastSoldDate?: string;
  };
  views: number;
  likes: number;
  shares: number;
}

/**
 * Deck represents a collection of cards that can be used together
 */
export interface Deck {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  cardIds: string[];
  isPublic: boolean;
  cards?: BaseCard[];
}

/**
 * Defines the types of card releases
 */
export type ReleaseType = 'standard' | 'limited' | 'promotional' | 'exclusive';

/**
 * Series represents a collection of related cards that form a set
 */
export interface Series {
  id: string;
  name: string;
  title?: string;
  description: string;
  coverImageUrl: string;
  artistId: string;
  createdAt: string;
  updatedAt: string;
  releaseDate: string;
  totalCards: number;
  isPublished: boolean;
  cardIds: string[];
  releaseType: ReleaseType;
  cards?: BaseCard[];
}
