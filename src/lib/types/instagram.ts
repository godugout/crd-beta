
export interface InstagramPost {
  id: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  username: string;
  postId: string;
  tags?: string[];
}

export interface InstagramCollection {
  username: string;
  posts: InstagramPost[];
  lastFetched: string;
  autoUpdate: boolean;
}
