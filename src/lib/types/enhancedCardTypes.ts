
import { BaseCard } from './cardTypes';
import { User } from './user';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'one-of-one';

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

export interface EnhancedCard extends BaseCard {
  rarity?: CardRarity; // Make rarity optional to match cardTypes.ts
  cardNumber?: string;
  seriesId?: string;
  artistId?: string;
  artistProfile?: User;
  artistName?: string;
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

export interface Deck {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  cardIds: string[];
  cards?: EnhancedCard[];
  isPublic: boolean;
}
