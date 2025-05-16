
import { BaseEntity } from './index';
import { Card } from './cardTypes';
import { User } from './user';

/**
 * Collection interface for card collections
 */
export interface Collection extends BaseEntity {
  title: string;
  name?: string;              // Added for backward compatibility
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  owner?: User;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  designMetadata?: any;
  cards?: Card[];
  featured?: boolean;         // Added for CollectionGrid component
  isPublic?: boolean;         // Flag to determine if collection is public
  tags?: string[];            // Collection tags for filtering and categorization
  cardIds?: string[];         // For referencing cards without loading full card data
}

/**
 * Collection card relationship interface
 */
export interface CollectionCard extends BaseEntity {
  collectionId: string;
  cardId: string;
  order?: number;
  featured?: boolean;
  card?: Card;
  collection?: Collection;
}

/**
 * Collection display interface for UI components
 */
export interface CollectionDisplayData {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  cardCount?: number;
  ownerName?: string;
  visibility: 'public' | 'private' | 'team';
  createdAt: string;
  updatedAt: string;
  tags?: string[];            // Added for consistency
  isPublic?: boolean;         // Added for consistency
}
