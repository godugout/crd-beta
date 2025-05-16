
import { Card } from './cardTypes';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
  cardIds?: string[]; // Added for backward compatibility
  isPublic?: boolean; // Added for backward compatibility
  tags?: string[];
  instagramSource?: { // Add instagramSource property
    username: string;
    lastFetched: string;
    autoUpdate: boolean;
  };
}
