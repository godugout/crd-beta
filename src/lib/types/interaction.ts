
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Reaction definition for user interactions with cards and comments
 */
export interface Reaction extends BaseEntity {
  id: string; // Explicitly add id to ensure it's recognized
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  targetType: 'card' | 'comment' | 'collection' | string;
  targetId: string;
  user?: User;
}

/**
 * Comment definition for user comments on cards
 */
export interface Comment extends BaseEntity {
  id: string; // Explicitly add id to ensure it's recognized
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  user?: User;
  reactions?: Reaction[];
  createdAt: string; // Explicitly add createdAt to ensure it's recognized
  updatedAt: string; // Explicitly add updatedAt to ensure it's recognized
}
