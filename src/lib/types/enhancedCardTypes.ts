
import { BaseCard, DesignMetadata, CardRarity, HotspotData } from './cardTypes';

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

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: EnhancedCard[];
  creator?: string;
  userId: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  coverImageUrl?: string;
  cardIds: string[];
}
