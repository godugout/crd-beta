
import { Comment } from '@/lib/types';

export interface DbComment {
  id: string;
  content: string;
  user_id: string;
  card_id?: string;
  collection_id?: string;
  team_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    avatar_url?: string;
    username?: string;
  };
}

// Convert from app Comment to DbComment
export const adaptCommentToDbComment = (comment: Comment): DbComment => {
  return {
    id: comment.id,
    content: comment.content,
    user_id: comment.userId,
    card_id: comment.cardId,
    collection_id: comment.collectionId,
    team_id: comment.teamId,
    parent_id: comment.parentId,
    created_at: comment.createdAt,
    updated_at: comment.updatedAt,
    user: comment.user ? {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
      avatar_url: comment.user.avatarUrl,
      username: comment.user.username,
    } : undefined
  };
};

// Convert from schema Comment to interaction Comment
export const adaptSchemaCommentToInteractionComment = (dbComment: DbComment): Comment => {
  return {
    id: dbComment.id,
    content: dbComment.content,
    userId: dbComment.user_id,
    cardId: dbComment.card_id,
    collectionId: dbComment.collection_id,
    teamId: dbComment.team_id,
    parentId: dbComment.parent_id,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at,
    user: dbComment.user ? {
      id: dbComment.user.id,
      name: dbComment.user.name,
      email: dbComment.user.email,
      avatarUrl: dbComment.user.avatar_url,
      username: dbComment.user.username,
    } : undefined
  };
};

// Convert from interaction Comment to schema Comment
export const adaptInteractionCommentToSchemaComment = (comment: Partial<Comment>): Partial<DbComment> => {
  const result: Partial<DbComment> = {};
  
  if (comment.id) result.id = comment.id;
  if (comment.content) result.content = comment.content;
  if (comment.userId) result.user_id = comment.userId;
  if (comment.cardId) result.card_id = comment.cardId;
  if (comment.collectionId) result.collection_id = comment.collectionId;
  if (comment.teamId) result.team_id = comment.teamId;
  if (comment.parentId) result.parent_id = comment.parentId;
  if (comment.createdAt) result.created_at = comment.createdAt;
  if (comment.updatedAt) result.updated_at = comment.updatedAt;
  
  // Handle user object conversion
  if (comment.user) {
    result.user = {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
      avatar_url: comment.user.avatarUrl,
      username: comment.user.username
    };
  }
  
  return result;
};
