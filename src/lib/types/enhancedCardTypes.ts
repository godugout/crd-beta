
// New file to split up the large cardTypes.ts file
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
}

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
  name: string;
  description: string;
  releaseDate: string;
  cards: EnhancedCard[];
  totalCards: number;
  rarity: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Deck of cards
 */
export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: EnhancedCard[];
  creator: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
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
