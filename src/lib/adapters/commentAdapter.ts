
import { Comment } from '@/lib/types';

export interface DbComment {
  id: string;
  content: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  team_id?: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Convert from database schema format to app format
export function adaptSchemaCommentToInteractionComment(dbComment: DbComment): Comment {
  return {
    id: dbComment.id,
    content: dbComment.content,
    userId: dbComment.user_id,
    cardId: dbComment.card_id,
    collectionId: dbComment.collection_id,
    teamId: dbComment.team_id,
    parentId: dbComment.parent_id || undefined,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at
  };
}

// Convert from app format to database schema format
export function adaptInteractionCommentToSchemaComment(comment: Partial<Comment>): Partial<DbComment> {
  return {
    id: comment.id,
    content: comment.content || '',
    user_id: comment.userId || '',
    card_id: comment.cardId,
    collection_id: comment.collectionId,
    team_id: comment.teamId,
    parent_id: comment.parentId,
    created_at: comment.createdAt,
    updated_at: comment.updatedAt
  };
}

// Convert from app Comment type to DbComment
export function adaptCommentToDbComment(comment: Comment): DbComment {
  return {
    id: comment.id,
    content: comment.content,
    user_id: comment.userId,
    card_id: comment.cardId,
    collection_id: comment.collectionId,
    team_id: comment.teamId,
    parent_id: comment.parentId || null,
    created_at: comment.createdAt || new Date().toISOString(),
    updated_at: comment.updatedAt || new Date().toISOString(),
  };
}
