
import { Card } from './card';

/**
 * Series interface for card series management
 */
export interface Series {
  id: string;
  name: string;
  title?: string;        // Optional but may be used in some components
  description?: string;
  cards?: Card[];        // Optional reference to actual card objects
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  cardIds?: string[];
  totalCards?: number;
  isPublished?: boolean;
  artistId?: string;
  releaseDate?: string;
  releaseType?: 'standard' | 'limited' | 'promotional' | 'exclusive';
}
