
/**
 * Core data models for the application
 * Extended with team functionality and enhanced metadata
 */
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  username?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

// Card and collection types with enhanced metadata
export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  teamId?: string; 
  collectionId?: string;
  isPublic?: boolean;
  designMetadata?: {
    cardStyle: any;
    textStyle: any;
    oaklandMemory?: OaklandMemoryData;
  };
  tags?: string[];
  fabricSwatches?: FabricSwatch[];
  stats?: CardStats;
  reactions?: Reaction[];
  location?: GeoLocation;
}

export interface CardStats {
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
  viewCount?: number;
  favoriteCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  title?: string; // For backward compatibility with DB
  description?: string;
  coverImageUrl?: string;
  userId?: string; 
  ownerId?: string; // For backward compatibility with DB
  teamId?: string;
  cards?: Card[];
  visibility: 'public' | 'private' | 'team';
  allowComments: boolean;
  createdAt?: string;
  updatedAt?: string;
  designMetadata?: {
    wrapperColor?: string;
    wrapperPattern?: string; 
    packType?: 'memory-pack' | 'standard';
  };
}

// Memory specific data types
export interface OaklandMemoryData {
  title: string;
  description: string;
  date: string;
  memoryType: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees: string[];
  tags: string[];
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  venueId?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  geoLocation?: GeoLocation;
  capacity?: number;
  openingDate?: string;
  closingDate?: string;
  imageUrl?: string;
  teamId?: string;
}

// Social interaction types
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
}

export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
}

export interface SharedItem {
  id: string;
  cardId?: string;
  collectionId?: string;
  userId: string;
  sharedWith: 'public' | 'team' | 'specific';
  teamId?: string;
  sharedUserIds?: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Zod schemas for validation
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  username: z.string().min(3).max(20).optional(),
  teamId: z.string().uuid().optional()
});

export const teamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional(),
  ownerId: z.string().uuid()
});

export const cardSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  userId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  collectionId: z.string().uuid().optional(),
  isPublic: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([])
});

export const collectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().optional(),
  userId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  visibility: z.enum(['public', 'private', 'team']).default('private'),
  allowComments: z.boolean().default(true),
});

// Type helpers for database operations
export type DbCard = {
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
};

export type DbCollection = {
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
};

export type DbTeam = {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type DbTeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
};

export type DbReaction = {
  id: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  comment_id?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  created_at: string;
};

export type DbComment = {
  id: string;
  content: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  team_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
};

// For compatibility with existing database types
export type Tables = Database['public']['Tables'];
export type CardInsert = Tables['cards']['Insert'];
export type CardUpdate = Tables['cards']['Update'];
export type CollectionInsert = Tables['collections']['Insert'];
export type CollectionUpdate = Tables['collections']['Update'];

// For team operations
export type TeamInsert = Omit<DbTeam, 'id' | 'created_at' | 'updated_at'>;
export type TeamUpdate = Partial<Omit<DbTeam, 'id' | 'created_at' | 'updated_at'>>;
