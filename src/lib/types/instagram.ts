
import { BaseEntity } from './index';

/**
 * Instagram post interface for collections created from Instagram
 */
export interface InstagramPost extends BaseEntity {
  username: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnailUrl?: string;
  children?: InstagramMedia[];
}

export interface InstagramMedia {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
}

export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
}
