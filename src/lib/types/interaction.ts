
export interface Reaction {
  id: string;
  userId: string;
  cardId?: string;
  collectionId?: string;
  commentId?: string;
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  createdAt: string;
  targetType: 'card' | 'comment' | string;
  targetId: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  cardId?: string;
  parentId?: string;
  createdAt: string;
}
