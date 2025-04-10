
import { getComments, getReplyCount } from './queries';
import { createComment, updateComment, deleteComment } from './mutations';
import { transformCommentFromDb } from './transformers';

/**
 * Repository for comment-related data operations
 */
export const commentRepository = {
  getComments,
  getReplyCount,
  createComment,
  updateComment,
  deleteComment
};

export {
  transformCommentFromDb,
  getComments,
  getReplyCount,
  createComment,
  updateComment,
  deleteComment
};
