
// Types for user interactions with cards and collections
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Comment interface
 */
export interface Comment extends BaseEntity {
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  user?: User;
}

/**
 * Reaction interface
 */
export interface Reaction extends BaseEntity {
  userId: string;
  targetType: 'card' | 'collection' | 'comment' | string;
  targetId: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  user?: User;
}
