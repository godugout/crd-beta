
/**
 * Instagram-related types
 */

export interface InstagramPost {
  id: string;
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

export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
}
