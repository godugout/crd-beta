
export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  thumbnailUrl?: string;
  postUrl: string;
  timestamp: string;
  likes: number;
  comments: number;
  username: string;
  userProfileUrl: string;
  mediaType: string; // Added missing property
  tags?: string[]; // Added missing property
}
