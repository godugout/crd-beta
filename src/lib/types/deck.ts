
import { Card } from './card';

/**
 * Deck interface for card deck management
 */
export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Card[];         // Cards in the deck
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  cardIds?: string[];    // Added for compatibility
  isPublic?: boolean;    // Added for compatibility
  ownerId: string;       // Required in EnhancedCardContext
}
