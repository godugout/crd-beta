
import { Card, BaseEntity } from './index';

/**
 * Collection interface used throughout the application
 * Consolidates properties from multiple definitions
 */
export interface Collection extends BaseEntity {
  title: string;        // Required field across all definitions
  name: string;         // Required for backward compatibility
  description: string;
  coverImageUrl: string;
  userId: string;       // For ownership
  
  // Card relationships
  cards?: Card[];       // Optional reference to actual card objects
  cardIds: string[];    // List of card IDs that belong to the collection
  
  // Visibility and interaction settings
  visibility: 'public' | 'private' | 'team';
  allowComments: boolean;
  
  // Optional additional metadata
  designMetadata?: any;
  tags: string[];
  
  // Legacy fields maintained for compatibility
  isPublic?: boolean;   // Deprecated, use visibility instead
  teamId?: string;      // Optional team ownership
  ownerId?: string;     // Alternative to userId for backward compatibility
}
