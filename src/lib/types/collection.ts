
import { BaseEntity } from './index';
import { Card } from './cardTypes';
import { User } from './user';

/**
 * Collection interface for card collections
 */
export interface Collection extends BaseEntity {
  title: string;
  description?: string;
  coverImageUrl?: string;
  ownerId: string;
  owner?: User;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  designMetadata?: any;
  cards?: Card[];
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
}
