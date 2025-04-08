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

// Export all types directly from schema/types to maintain consistent interfaces
export type {
  Card,
  OaklandMemoryData,
  Collection,
  User,
  Team,
  TeamMember,
  Comment,
  Reaction,
  FabricSwatch,
  DbCard,
  DbCollection,
  DbReaction
} from '@/lib/schema/types';

// If additional type extensions are needed, they can be added below
