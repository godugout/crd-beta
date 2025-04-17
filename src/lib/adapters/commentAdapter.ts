
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

/**
 * Convert from database schema format to app format
 * @param dbComment Comment data from the database
 * @returns Comment object in the application format
 */
export function adaptSchemaCommentToInteractionComment(dbComment: DbComment): Comment {
  if (!dbComment || typeof dbComment !== 'object') {
    throw new Error('Invalid comment data provided');
  }
  
  return {
    id: dbComment.id || `comment-${Date.now()}`,
    content: dbComment.content || '',
    userId: dbComment.user_id || '',
    cardId: dbComment.card_id,
    collectionId: dbComment.collection_id,
    teamId: dbComment.team_id,
    parentId: dbComment.parent_id || undefined,
    createdAt: dbComment.created_at || new Date().toISOString(),
    updatedAt: dbComment.updated_at || new Date().toISOString()
  };
}

/**
 * Convert from app format to database schema format
 * @param comment Comment data in application format
 * @returns DbComment object ready for database storage
 */
export function adaptInteractionCommentToSchemaComment(comment: Partial<Comment>): Partial<DbComment> {
  if (!comment || typeof comment !== 'object') {
    throw new Error('Invalid comment data provided');
  }
  
  return {
    id: comment.id,
    content: comment.content || '',
    user_id: comment.userId || '',
    card_id: comment.cardId,
    collection_id: comment.collectionId,
    team_id: comment.teamId,
    parent_id: comment.parentId || null,
    created_at: comment.createdAt || new Date().toISOString(),
    updated_at: comment.updatedAt || new Date().toISOString()
  };
}

/**
 * Convert from app Comment type to DbComment
 * @param comment Comment in application format
 * @returns DbComment object with all required fields
 * @throws Error if required fields are missing
 */
export function adaptCommentToDbComment(comment: Comment): DbComment {
  if (!comment.id) {
    throw new Error('Comment ID is required');
  }
  
  if (!comment.content) {
    throw new Error('Comment content is required');
  }
  
  if (!comment.userId) {
    throw new Error('User ID is required for comment');
  }
  
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

/**
 * Create a new comment with default values
 * @param partial Partial comment data
 * @returns Complete Comment object
 */
export function createComment(partial: Partial<Comment> = {}): Comment {
  return {
    id: partial.id || `comment-${Date.now()}`,
    content: partial.content || '',
    userId: partial.userId || 'anonymous',
    cardId: partial.cardId,
    collectionId: partial.collectionId,
    teamId: partial.teamId,
    parentId: partial.parentId,
    createdAt: partial.createdAt || new Date().toISOString(),
    updatedAt: partial.updatedAt || new Date().toISOString(),
  };
}

/**
 * Data flow for comments:
 * 
 * 1. User submits a comment through the UI
 * 2. UI creates a partial comment object
 * 3. Backend adapter converts it to DbComment format using adaptInteractionCommentToSchemaComment
 * 4. Comment is stored in the database
 * 5. When retrieving comments, they are converted back using adaptSchemaCommentToInteractionComment
 * 6. UI displays the comments to the user
 * 
 * Edge cases handled:
 * - Missing fields are populated with default values
 * - Invalid data types trigger errors
 * - Hierarchical comments with parent/child relationships
 * - Comments associated with different entities (cards, collections, teams)
 */
