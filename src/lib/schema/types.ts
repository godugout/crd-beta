// Define base types used throughout the application
import { FabricSwatch } from '@/lib/types/card';

export interface Card {
  id: string;
  title: string;
  description?: string; // Make this optional to be consistent
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
  effects: string[]; // Required for card viewer
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
  visibility?: 'public' | 'private' | 'team';
  allowComments?: boolean;
  createdAt: string;
  updatedAt: string;
  designMetadata?: any;
  cards?: Card[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  username?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Update the TeamMember interface to include user property
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  targetType: 'card' | 'comment' | string; // Added to match Reaction in interaction.ts
  targetId: string; // Added to match Reaction in interaction.ts
  user?: User;
}

// DB-specific interfaces for proper type mapping
export interface DbCard {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection_id?: string;
  user_id?: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  is_public?: boolean;
  tags?: string[];
  design_metadata?: any;
  creator_id: string;
  price?: number;
  edition_size: number;
  rarity: string;
}

export interface DbCollection {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  owner_id?: string;
  team_id?: string;
  visibility?: 'public' | 'private' | 'team';
  allow_comments?: boolean;
  created_at: string;
  updated_at: string;
  design_metadata?: any;
}

export interface DbReaction {
  id: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  comment_id?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  created_at: string;
}
