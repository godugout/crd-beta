
import { Card } from './cardTypes';
import { User } from './user';

/**
 * Interface for a collection of cards
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
  members?: User[];
  instagramSource?: string; // Add instagramSource for InstagramCollectionCreator
  owner?: User;
  displayOrder?: number;
  featured?: boolean;
  isPublic?: boolean;
  ownerId?: string;
}

/**
 * Interface for a deck of cards (specialized collection)
 */
export interface Deck {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  userId?: string; // Make optional to fix error
  ownerId?: string; // Add ownerId as alternative
  createdAt: string;
  updatedAt: string;
  cards: Card[];
  cardIds: string[];
  isPublic: boolean;
  featured?: boolean;
  displayOrder?: number;
  owner?: User;
}

/**
 * Types of collections available
 */
export enum CollectionType {
  Standard = 'standard',
  Series = 'series',
  Set = 'set',
  Team = 'team',
  Player = 'player',
  Personal = 'personal',
  Favorites = 'favorites',
  Custom = 'custom'
}

/**
 * Interface for collection metadata
 */
export interface CollectionMetadata {
  type: CollectionType;
  theme?: string;
  icon?: string;
  tags?: string[];
  featuredCardIds?: string[];
  customAttributes?: Record<string, any>;
}

/**
 * Interface for collection statistics
 */
export interface CollectionStats {
  totalCards: number;
  viewCount: number;
  shareCount: number;
  favoriteCount: number;
  averageRating?: number;
  lastUpdated: string;
}

// Add a DbCollection type for the collection converter
export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}
