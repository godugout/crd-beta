
export interface InstagramPost {
  id: string;
  caption?: string;
  permalink?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  timestamp?: string;
  username?: string;
  children?: InstagramPost[];
  postId?: string;
}

export interface InstagramAccount {
  id: string;
  username: string;
  profilePicture?: string;
  followerCount?: number;
  accessToken?: string;
  tokenExpiry?: string;
  lastSync?: string;
}

export interface InstagramCollection {
  id: string;
  name: string;
  description?: string;
  posts: InstagramPost[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}
