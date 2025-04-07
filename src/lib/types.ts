
import { Card as SchemaCard, OaklandMemoryData as SchemaOaklandMemoryData } from '@/lib/schema/types';

// Re-export compatible types to make sure they align with the schema
export type { Card as Card } from '@/lib/schema/types';
export type { OaklandMemoryData as OaklandMemoryData } from '@/lib/schema/types';
export type { Collection, User, Team, TeamMember, Comment, Reaction } from '@/lib/schema/types';

// Ensure fabric swatch is compatible
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  username?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  cards?: SchemaCard[];
  visibility?: 'public' | 'private'; 
  allowComments?: boolean;
  designMetadata?: {
    wrapperColor?: string;
    wrapperPattern?: string;
    packType?: 'memory-pack' | 'standard';
  };
}

// Make this type exactly match the schema Card type
export interface Card extends SchemaCard {
  // Add any additional fields here that might be needed for compatibility
}

// Fix the OaklandMemoryData to include title and description
export interface OaklandMemoryData extends SchemaOaklandMemoryData {
  // Ensure all required fields are present
  title: string;
  description: string;
}
