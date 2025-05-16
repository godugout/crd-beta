
/**
 * Instagram-related types
 */

import { InstagramPost as BaseInstagramPost } from './index';

// Re-export the type from the index file
export type InstagramPost = BaseInstagramPost;

// Additional Instagram-specific types
export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
}
