
import { Card } from './cardTypes';

export interface Deck {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  cards: Card[];
  cardIds: string[];
  userId: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
}
