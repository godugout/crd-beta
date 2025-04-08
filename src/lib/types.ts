
// Define base types used throughout the application

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  collectionId?: string;
  userId?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  tags?: string[];
  designMetadata?: any;
  reactions?: Reaction[];
  fabricSwatches?: FabricSwatch[];
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  memoryType?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility: 'public' | 'private' | 'team';  // Now required with these specific values
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
}

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

// Import User interface before using it in the Reaction interface
import { User as SchemaUser } from '@/lib/schema/types';

export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  user?: SchemaUser;
}

// Define group memory types
export interface GroupMemory {
  id: string;
  title: string;
  description: string;
  event?: string;
  date?: string;
  location?: string;
  attendees?: string[];
  createdBy: string;
  collaborators?: string[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// Re-export types from schema/types, excluding those we've defined locally
export type {
  User,
  Team,
  TeamMember,
  Comment,
  DbCard,
  DbCollection,
  DbReaction
} from '@/lib/schema/types';
