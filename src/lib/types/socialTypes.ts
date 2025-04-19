
export interface InstagramPost {
  id: string;
  postId: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
  username: string;
  mediaType: string;
}

export interface TwitterPost {
  id: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  username: string;
}

export interface SocialShare {
  platform: 'instagram' | 'twitter' | 'facebook';
  link: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}
