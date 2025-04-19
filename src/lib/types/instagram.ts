
/**
 * Instagram related types
 */

export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  postUrl: string;
  timestamp: string;
  likes: number;
  comments: number;
  
  // Additional properties needed by components
  mediaType?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  postId?: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  profilePicture?: string;
  followerCount?: number;
  verified?: boolean;
}

export interface InstagramCollection {
  id: string;
  name: string;
  posts: InstagramPost[];
  createdAt: string;
  updatedAt: string;
}
