
import { BaseEntity } from './index';
import { Card } from './cardTypes';

/**
 * Collection visibility options
 */
export type CollectionVisibility = 'public' | 'private' | 'team' | 'unlisted';

/**
 * Collection interface
 */
export interface Collection extends BaseEntity {
  name: string;
  description: string;
  coverImageUrl?: string;
  userId: string;
  teamId?: string;  
  cards?: Card[];
  cardIds: string[];
  designMetadata?: Record<string, any>;
  visibility: CollectionVisibility;
  isPublic: boolean;
  allowComments?: boolean;
}

/**
 * Deck interface for card decks
 */
export interface Deck extends BaseEntity {
  name: string;
  description: string;
  coverImageUrl: string;
  userId?: string;  // Making userId optional 
  ownerId: string;  // Added as alternative to userId
  cards: any[];
  cardIds: string[];
  isPublic: boolean;
}
