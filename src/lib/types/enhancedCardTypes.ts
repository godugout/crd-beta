
import { BaseEntity } from './index';
import { Card } from './cardTypes';
import { User } from './user';

/**
 * Enhanced card interface with additional fields
 */
export interface EnhancedCard extends Card {
  seriesId?: string;
  series?: Series;
  rarity?: string;
  attributes?: Record<string, any>;
  effects?: string[];
}

/**
 * Series interface for card series
 */
export interface Series extends BaseEntity {
  name: string;
  description?: string;
  coverImageUrl?: string;
  totalCards?: number;
  releaseDate?: string;
  publisher?: string;
  isLimited?: boolean;
  edition?: string;
  ownerId: string;
  owner?: User;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  cards?: EnhancedCard[];
}

/**
 * Deck interface for card decks
 */
export interface Deck extends BaseEntity {
  name: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  owner: User;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  cards?: EnhancedCard[];
  cardIds?: string[];
  isPublic?: boolean;
}
