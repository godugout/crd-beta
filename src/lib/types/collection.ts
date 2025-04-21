
import { BaseEntity } from './index';
import { Card } from './cardTypes';

export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
}

export interface Collection extends BaseEntity {
  name: string;
  description?: string;
  userId: string;
  cards: Card[];
  coverImageUrl?: string;
  isPublic: boolean;
  tags?: string[];
  popularity?: number;
  instagramSource?: InstagramSource;
  featured?: boolean; // Added this property to fix the type error
  
  // Additional properties needed by other components
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  teamId?: string;
  cardIds?: string[];
  designMetadata?: any;
  owner_id?: string; // For backward compatibility
}

export interface CollectionWithCards extends Collection {
  cards: Card[];
}

// For backwards compatibility with DB models
export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string; 
  team_id?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}

// Function to serialize metadata for storage
export const serializeMetadata = (metadata: any) => {
  if (!metadata) return {};
  try {
    return JSON.parse(JSON.stringify(metadata));
  } catch (e) {
    return metadata;
  }
};
