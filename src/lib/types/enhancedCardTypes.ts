
import { Card as BaseCard } from '../types';

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  ULTRA_RARE = 'ultra-rare',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

export interface EnhancedCard extends BaseCard {
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistName?: string;
  edition?: number;
  editionSize?: number;
  releaseDate?: string;
  qrCodeData?: string;
  marketData?: {
    price: number;
    currency: string;
    availableForSale: boolean;
    lastSoldPrice?: number;
    lastSoldDate?: string;
  };
}

export type ReleaseType = 'standard' | 'limited' | 'promotional' | 'exclusive';

export interface Series {
  id: string;
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
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  cardIds: string[];
  isPublic: boolean;
}
