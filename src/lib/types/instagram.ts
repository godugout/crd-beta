
import { BaseEntity } from './index';

export interface InstagramPost extends BaseEntity {
  caption: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  username: string;
  children?: InstagramMedia[];
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  likeCount?: number;
  commentCount?: number;
}

export interface InstagramMedia {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
}
