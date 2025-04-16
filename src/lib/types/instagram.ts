
import { BaseEntity } from './index';

export interface InstagramPost extends BaseEntity {
  id: string;
  caption: string;
  imageUrl: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  tags?: string[];
  
  // Add missing properties used in components
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  postId?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink?: string;
}

export interface InstagramCollection {
  id: string;
  name: string;
  description: string;
  posts: InstagramPost[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  
  // Add any additional properties needed
  instagramSource?: {
    username: string;
    lastFetched: string;
    autoUpdate: boolean;
  };
}
