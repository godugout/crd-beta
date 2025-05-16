
import { BaseEntity } from './index';
import { Card } from './cardTypes';

/**
 * Enhanced card interface with additional features
 */
export interface EnhancedCard extends Card {
  variants?: Card[];
  seriesInfo?: SeriesInfo;
  relatedCards?: Card[];
  augmentedRealityModel?: string;
  interactive?: boolean;
  
  // Fields for ArtistDashboard compatibility
  artistId?: string;
  artist?: string;
  marketData?: any;
  editionSize?: number;
  metadata?: any;
}

/**
 * Series information for card series
 */
export interface SeriesInfo {
  id: string;
  name: string;
  description?: string;
  totalCards: number;
  releaseDate?: string;
  publisher?: string;
}

/**
 * Card deck interface for card collections
 */
export interface Deck extends BaseEntity {
  name: string;
  description?: string;
  cards: Card[];
  cardIds?: string[];         // For backward compatibility
  owner: string;
  ownerId?: string;           // For backward compatibility
  isPublic: boolean;
  category?: string;
  coverImageUrl?: string;     // For DeckBuilder component
}
