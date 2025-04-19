
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
  isPublic?: boolean;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  featured?: boolean;
  cards?: Card[];
  allowComments?: boolean;
  designMetadata?: any;
}

/**
 * Featured Collection interface with additional properties
 */
export interface FeaturedCollection extends Collection {
  spotlight?: boolean;
  highlightText?: string;
  displayOrder?: number;
}
