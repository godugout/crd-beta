
import { Card } from './cardTypes';

export interface Deck {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  cards: Card[];
  cardIds: string[];
  userId?: string;  // Make userId optional
  ownerId?: string;
  teamId?: string;  // Add teamId as an optional field
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  visibility?: 'public' | 'private' | 'team' | 'unlisted'; // Add visibility options including unlisted
}
