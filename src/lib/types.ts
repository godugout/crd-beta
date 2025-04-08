
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

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  user?: User;
}

// Re-export types from schema/types, excluding those we've defined locally
export type {
  Collection,
  User,
  Team,
  TeamMember,
  Comment,
  DbCard,
  DbCollection,
  DbReaction
} from '@/lib/schema/types';
