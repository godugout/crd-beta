
import { BaseEntity } from './index';
import { User } from './user';

export interface Comment extends BaseEntity {
  content: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  parentId?: string;
  user?: User;
  replies?: Comment[];
  reactions?: Reaction[];
}

export interface Reaction extends BaseEntity {
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  user?: User;
}
