
import { Card, CardRarity as BaseCardRarity, CardStats } from './cardTypes';

export interface HotspotData {
  id: string;
  position: { x: number; y: number };
  content: string;
  type: 'info' | 'stat' | 'achievement' | 'text' | 'link' | 'image' | 'video';
  visible?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface EnhancedCard extends Card {
  hotspots?: HotspotData[];
  interactiveElements?: any[];
  animationPresets?: string[];
  artistId?: string;
  marketData?: any;
  editionSize?: number;
  releaseDate?: string;
}

export interface Series {
  id: string;
  name: string;
  year: string;
  manufacturer: string;
  cardCount: number;
  artistId?: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  cardIds?: string[];
  totalCards?: number;
  isPublished?: boolean;
  releaseDate?: string;
  releaseType?: string;
  createdAt?: string;
  updatedAt?: string;
  // Remove 'cards' property as it doesn't exist in the interface
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: EnhancedCard[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  coverImageUrl?: string;
  cardIds?: string[];
  userId?: string;
  isPublic?: boolean;
}

export type CardRarity = BaseCardRarity;
