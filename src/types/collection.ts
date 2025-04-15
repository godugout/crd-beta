
import { Card } from './card';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  cardIds: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: any;
  isPublic?: boolean;
  cards?: Card[];
}
