
import { BaseEntity } from './index';
import { Card } from '../types';

/**
 * Collection interface
 */
export interface Collection extends BaseEntity {
  title: string;
  name?: string; // For backward compatibility
  description?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;
  cardCount?: number;
  userId: string;
  teamId?: string;
  isPublic?: boolean; 
  visibility?: 'public' | 'private' | 'team' | 'unlisted'; // Include unlisted in visibility
  featured?: boolean; 
  cards?: Card[];
  cardIds?: string[];
  allowComments?: boolean;
  designMetadata?: any;
  tags?: string[]; 
  createdAt: string;
  updatedAt: string; // Changed from optional to required to match BaseEntity
}

/**
 * Featured Collection interface with additional properties
 */
export interface FeaturedCollection extends Collection {
  spotlight?: boolean;
  highlightText?: string;
  displayOrder?: number;
}
