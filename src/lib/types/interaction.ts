
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Reaction interface for user interactions with content
 */
export interface Reaction extends BaseEntity {
  userId: string;
  targetType: 'card' | 'collection' | 'comment' | string;
  targetId: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  user?: User;
  
  // Legacy support for API compatibility
  cardId?: string;
  collectionId?: string;
  commentId?: string;
}

/**
 * Comment interface for user comments on content
 */
export interface Comment extends BaseEntity {
  userId: string;
  content: string;
  targetType?: 'card' | 'collection' | 'team' | string;
  targetId?: string;
  
  // Legacy support
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  
  user?: User;
  replies?: Comment[];
  reactionCount?: number;
  reactions?: Reaction[];
}

/**
 * View event for tracking content views
 */
export interface ViewEvent extends BaseEntity {
  userId?: string;
  targetType: 'card' | 'collection' | 'profile';
  targetId: string;
  viewDate: string;
  sessionId?: string;
  duration?: number;
}
