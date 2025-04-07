
// Import types from schema but don't re-export them directly to avoid conflicts
import { Card as SchemaCard, OaklandMemoryData as SchemaOaklandMemoryData } from '@/lib/schema/types';

// Define our own types that extend or are compatible with schema types
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

// User interface that's compatible with schema User
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  username?: string;
}

// Collection interface compatible with schema Collection
export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  cards?: SchemaCard[];
  visibility?: 'public' | 'private' | 'team'; 
  allowComments?: boolean;
  designMetadata?: {
    wrapperColor?: string;
    wrapperPattern?: string;
    packType?: 'memory-pack' | 'standard';
  };
}

// Card interface that extends SchemaCard to ensure compatibility
export interface Card extends SchemaCard {
  // Any additional fields needed for compatibility
}

// OaklandMemoryData that ensures title and description are present
export interface OaklandMemoryData extends SchemaOaklandMemoryData {
  title: string;
  description: string;
}

// Re-export other types from schema as needed
export type { Collection as Collection, User as User, Team, TeamMember, Comment, Reaction } from '@/lib/schema/types';
