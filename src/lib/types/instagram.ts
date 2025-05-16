
/**
 * Instagram-related types
 */

import { BaseEntity } from './index';

/**
 * Instagram Post definition
 */
export interface InstagramPost extends BaseEntity {
  postId?: string;
  username: string;
  caption?: string;
  imageUrl?: string;
  permalink?: string;
  timestamp: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
}

/**
 * Instagram source information
 */
export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
}
