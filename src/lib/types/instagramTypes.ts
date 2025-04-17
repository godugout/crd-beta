
import { JsonValue } from './index';

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

export interface InstagramMediaChild {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
}

export interface InstagramCarouselPost extends InstagramPost {
  children: InstagramMediaChild[];
}

export interface InstagramFeedResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface InstagramConfig {
  userId: string;
  accessToken: string;
  cacheTime: number; // time in minutes
}
