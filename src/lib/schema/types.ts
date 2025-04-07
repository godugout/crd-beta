
/**
 * Core data models for the application
 * Extended from existing types.ts with stronger relationships and validations
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
  uploadDate?: string;
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
  description?: string;
  coverImageUrl?: string;
  userId?: string; 
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

export const cardSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  uploadDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  collectionId: z.string().uuid().optional(),
  isPublic: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
});

export const collectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  coverImageUrl: z.string().url().optional(),
  userId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  visibility: z.enum(['public', 'private', 'team']).default('private'),
  allowComments: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Type helpers for Supabase
export type Tables = Database['public']['Tables'];
export type CardInsert = Tables['cards']['Insert'];
export type CardUpdate = Tables['cards']['Update'];
export type CollectionInsert = Tables['collections']['Insert'];
export type CollectionUpdate = Tables['collections']['Update'];

// For now, since teams table might not exist yet in the Database type
export type TeamInsert = Omit<Team, 'id' | 'createdAt' | 'updatedAt'>;
export type TeamUpdate = Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt'>>;

