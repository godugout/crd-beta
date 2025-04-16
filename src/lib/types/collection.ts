
import { BaseEntity } from './index';
import { Card } from './cardTypes';
import { User } from './user';
import { Reaction, Comment } from './interaction';
import { InstagramSource } from './instagram';

/**
 * Collection definition for groups of cards
 */
export interface Collection extends BaseEntity {
  name: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  userId?: string;
  teamId?: string;
  visibility?: 'public' | 'private' | 'team' | 'unlisted';
  allowComments?: boolean;
  designMetadata?: any;
  cards?: Card[];
  cardIds?: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  owner?: User;
  instagramSource?: InstagramSource; // Add support for Instagram collections
}

/**
 * Database representation of Collection for Supabase mapping
 */
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

