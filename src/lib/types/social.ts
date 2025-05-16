
/**
 * Instagram post data structure
 */
export interface InstagramPost {
  id: string;
  postId: string;
  caption: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  timestamp: string;
  username: string;
  likes: number;
  comments: number;
  tags: string[];
  metadata?: Record<string, any>;
}

/**
 * Twitter (X) post data structure
 */
export interface TwitterPost {
  id: string;
  tweetId: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
  username: string;
  likes: number;
  retweets: number;
  replies: number;
  tags: string[];
}

/**
 * Facebook post data structure
 */
export interface FacebookPost {
  id: string;
  postId: string;
  message: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
  username: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}
