
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
  teamId?: string; // Add teamId field
  isPublic?: boolean;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  featured?: boolean;
  cards?: Card[];
  cardIds?: string[]; // Add cardIds for backward compatibility
  allowComments?: boolean;
  designMetadata?: any;
  tags?: string[];
}

/**
 * Featured Collection interface with additional properties
 */
export interface FeaturedCollection extends Collection {
  spotlight?: boolean;
  highlightText?: string;
  displayOrder?: number;
}
