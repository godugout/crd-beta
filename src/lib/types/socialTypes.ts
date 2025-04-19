
export interface InstagramPost {
  id: string;
  postId: string; // Add the missing postId property
  caption: string;
  mediaUrl: string;
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
