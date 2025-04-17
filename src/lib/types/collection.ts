
import { Card } from './cardTypes';
import { BaseEntity } from './index';

export interface Collection extends BaseEntity {
  name: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  cards?: Card[];
  cardIds?: string[];
  userId?: string;
  ownerId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  designMetadata?: Record<string, any>;
  tags?: string[];
}
