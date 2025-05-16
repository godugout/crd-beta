
import { User } from './user';

/**
 * Interface for user comments
 */
export interface Comment {
  id: string;
  text: string;
  content?: string; // Add content field for adaptComment
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  userId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

/**
 * Interface for reactions to content
 */
export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  user?: User;
  targetType: 'card' | 'collection' | 'comment';
  targetId: string;
}

/**
 * Interface for user views tracking
 */
export interface View {
  id: string;
  userId?: string;
  cardId?: string;
  collectionId?: string;
  createdAt: string;
  duration?: number;
  sessionId: string;
  deviceInfo?: Record<string, any>;
}

/**
 * Interface for notifications
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'reaction' | 'mention' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actorId?: string;
  actor?: User;
  targetId?: string;
  targetType?: string;
}
