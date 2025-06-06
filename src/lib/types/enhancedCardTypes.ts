
import { Card, CardRarity as BaseCardRarity } from './cardTypes';

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
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: EnhancedCard[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export type CardRarity = BaseCardRarity;
