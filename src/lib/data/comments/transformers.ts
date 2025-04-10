
import { Comment } from '../../schema/types';

/**
 * Helper to transform database record to Comment type
 */
export function transformCommentFromDb(record: any): Comment {
  if (!record) return {} as Comment;
  
  const comment: Comment = {
    id: record.id,
    userId: record.user_id,
    cardId: record.card_id,
    collectionId: record.collection_id,
    teamId: record.team_id,
    parentId: record.parent_id,
    content: record.content,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };

  // Add user info if available
  if (record.profiles) {
    comment.user = {
      id: record.profiles.id,
      email: record.profiles.email || '', // Add default empty email
      name: record.profiles.full_name,
      avatarUrl: record.profiles.avatar_url,
      username: record.profiles.username
    };
  }
  
  return comment;
}
