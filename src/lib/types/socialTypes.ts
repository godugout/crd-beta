
export interface InstagramPost {
  id: string;
  permalink: string;
  caption?: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnailUrl?: string;
  timestamp: string;
  username: string;
  children?: InstagramPost[];
}
