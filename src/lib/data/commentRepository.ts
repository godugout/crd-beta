
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for comment-related data operations
 */
export const commentRepository = {
  /**
   * Get comments with optional filtering
   */
  getComments: async (options: {
    cardId?: string;
    collectionId?: string;
    teamId?: string;
    parentId?: string | null; // null means top-level comments only
  }): Promise<{ data: Comment[] | null; error: any }> => {
    try {
      let query = supabase
        .from('comments')
        .select('*, profiles:user_id(id, full_name, avatar_url, username)');
      
      if (options.cardId) {
        query = query.eq('card_id', options.cardId);
      }
      
      if (options.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }
      
      if (options.teamId) {
        query = query.eq('team_id', options.teamId);
      }
      
      if (options.parentId === null) {
        // Get top-level comments (no parent)
        query = query.is('parent_id', null);
      } else if (options.parentId) {
        // Get replies to a specific comment
        query = query.eq('parent_id', options.parentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: [], error: null };
      }
      
      const comments = data.map((record: any) => transformCommentFromDb(record));
      
      return { data: comments, error: null };
    } catch (err) {
      console.error('Unexpected error in getComments:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Add a new comment
   */
  createComment: async (comment: Partial<Comment>): Promise<{ data: Comment | null; error: any }> => {
    try {
      if (!comment.content || !comment.userId) {
        return { data: null, error: new Error('Content and user ID are required') };
      }
      
      if (!comment.cardId && !comment.collectionId && !comment.teamId) {
        return { data: null, error: new Error('Target ID (card, collection, or team) is required') };
      }
      
      const commentData = {
        content: comment.content,
        user_id: comment.userId,
        card_id: comment.cardId,
        collection_id: comment.collectionId,
        team_id: comment.teamId,
        parent_id: comment.parentId
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select('*, profiles:user_id(id, full_name, avatar_url, username)')
        .single();
      
      if (error) {
        console.error('Error creating comment:', error);
        toast.error('Failed to add comment');
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: new Error('No data returned from comment creation') };
      }
      
      const newComment = transformCommentFromDb(data);
      
      return { data: newComment, error: null };
    } catch (err) {
      console.error('Unexpected error in createComment:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Update a comment
   */
  updateComment: async (id: string, content: string): Promise<{ data: Comment | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, profiles:user_id(id, full_name, avatar_url, username)')
        .single();
      
      if (error) {
        console.error('Error updating comment:', error);
        toast.error('Failed to update comment');
        return { data: null, error };
      }
      
      if (!data) {
        return { data: null, error: new Error('No data returned from comment update') };
      }
      
      const updatedComment = transformCommentFromDb(data);
      
      return { data: updatedComment, error: null };
    } catch (err) {
      console.error('Unexpected error in updateComment:', err);
      toast.error('An unexpected error occurred');
      return { data: null, error: err };
    }
  },
  
  /**
   * Delete a comment
   */
  deleteComment: async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      // Note: this will also delete any replies due to the CASCADE on parent_id
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in deleteComment:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err };
    }
  },
  
  /**
   * Get reply count for multiple comments - batch operation
   */
  getReplyCount: async (commentIds: string[]): Promise<{ data: Record<string, number> | null; error: any }> => {
    try {
      // Count replies for each parent comment
      const { data, error } = await supabase
        .from('comments')
        .select('parent_id, id')
        .in('parent_id', commentIds);
      
      if (error) {
        console.error('Error getting reply counts:', error);
        return { data: null, error };
      }
      
      // Convert to record of counts
      const counts: Record<string, number> = {};
      
      if (data) {
        data.forEach((item: any) => {
          if (item.parent_id) {
            counts[item.parent_id] = (counts[item.parent_id] || 0) + 1;
          }
        });
      }
      
      return { data: counts, error: null };
    } catch (err) {
      console.error('Unexpected error in getReplyCount:', err);
      return { data: null, error: err };
    }
  }
};

/**
 * Helper to transform database record to Comment type
 */
function transformCommentFromDb(record: any): Comment {
  if (!record) return {} as Comment;
  
  const comment: Comment = {
    id: record.id,
    content: record.content,
    userId: record.user_id,
    cardId: record.card_id,
    collectionId: record.collection_id,
    teamId: record.team_id,
    parentId: record.parent_id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
  
  // Add user data if available
  if (record.profiles) {
    comment.user = {
      id: record.profiles.id,
      name: record.profiles.full_name, 
      avatarUrl: record.profiles.avatar_url,
      username: record.profiles.username
    };
  }
  
  return comment;
}
