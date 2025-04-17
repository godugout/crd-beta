
import { Card } from './cardTypes';
import { JsonValue } from './index';

export interface Collection {
  id: string;
  name: string;
  title?: string; // Some APIs use title instead of name
  description?: string;
  coverImageUrl?: string;
  cards?: Card[];
  cardIds?: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  ownerId?: string;
  visibility?: 'private' | 'public' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: Record<string, any>;
  tags?: string[];
  [key: string]: JsonValue | undefined;
}
