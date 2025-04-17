
import { Card } from './card';

/**
 * CardRarity enumeration defines possible rarity levels for cards
 * Used for display and filtering purposes
 */
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  ULTRA_RARE = 'ultra-rare',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
  ONE_OF_ONE = 'one-of-one'
}

/**
 * EnhancedCard with additional properties, maintaining compatibility
 * with the main Card type but allowing for specialized usage
 */
export interface EnhancedCard extends Omit<Card, 'edition'> {
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistName?: string;
  editionSize?: number;
  edition?: number;
  // Overriding edition from Card to be numeric for EnhancedCard
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
  description: string;
  coverImageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  cardIds: string[];
  isPublic: boolean;
  cards?: Card[];
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
  title: string;
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
  cards?: Card[];
}
