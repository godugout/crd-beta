
import { BaseEntity } from './index';
import { Card } from './cardTypes';

export interface Collection extends BaseEntity {
  name: string;
  description?: string;
  userId: string;
  cards: Card[];
  coverImageUrl?: string;
  isPublic: boolean;
  tags?: string[];
  popularity?: number;
  instagramSource?: string; // Add support for Instagram source
}

export interface CollectionWithCards extends Collection {
  cards: Card[];
}
