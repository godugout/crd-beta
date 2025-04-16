
import { BaseEntity } from './index';
import { Card } from './cardTypes';

/**
 * Instagram post data structure
 */
export interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
  permalink?: string;
  username?: string;
  likes?: number;
  comments?: number;
}

/**
 * Instagram source for collections
 */
export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
  postIds?: string[];
}

/**
 * Instagram collection extension
 */
export interface InstagramCollectionData {
  instagramSource?: InstagramSource;
}

// Extended Card type with Instagram properties
export interface InstagramCard extends Card {
  instagramPostId?: string;
  instagramUsername?: string;
  instagramPost?: InstagramPost;
}

