
import { JsonValue } from './index';

export interface InstagramPost {
  id: string;
  username: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnailUrl?: string;
  likes?: number;
  comments?: number;
  children?: InstagramMediaChild[];
  metadata?: Record<string, JsonValue>;
  [key: string]: JsonValue | undefined;
}

export interface InstagramMediaChild {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
}

export interface InstagramSource {
  username: string;
  lastFetched: string;
  autoUpdate: boolean;
  filters?: Record<string, any>;
}
