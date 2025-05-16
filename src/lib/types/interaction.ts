
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Reaction definition for user interactions with cards and comments
 */
export interface Reaction extends BaseEntity {
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
  content: string;
  userId: string; // Required for our interface
  authorId?: string; // Legacy support for old API
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  user?: User; // Support for user object
  reactions?: Reaction[];
}
