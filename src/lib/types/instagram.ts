
import { BaseEntity } from './index';

export interface InstagramPost extends BaseEntity {
  id: string;
  caption: string;
  imageUrl: string;
  username: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  tags?: string[];
}

export interface InstagramCollection {
  id: string;
  name: string;
  description: string;
  posts: InstagramPost[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}
