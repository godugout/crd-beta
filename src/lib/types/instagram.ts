
import { BaseEntity } from './index';

export interface InstagramPost extends BaseEntity {
  postId: string;
  username: string;
  caption?: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  children?: InstagramPostChild[];
}

export interface InstagramPostChild {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  profilePictureUrl?: string;
  followersCount?: number;
  mediaCount?: number;
}

export interface InstagramCollection {
  id: string;
  name: string;
  description?: string;
  posts: InstagramPost[];
  instagramSource?: string;
}
