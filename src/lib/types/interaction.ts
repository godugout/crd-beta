
import { BaseEntity } from './index';
import { User } from './user';

export interface Reaction extends BaseEntity {
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: string;
  targetType: string;
  targetId: string;
  user?: User;
}

export interface Comment extends BaseEntity {
  userId: string;
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string;
  content: string;
  user?: User;
  reactions?: Reaction[];
  replies?: Comment[];
}
