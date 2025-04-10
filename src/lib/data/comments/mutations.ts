
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '../../schema/types';
import { toast } from 'sonner';
import { transformCommentFromDb } from './transformers';

/**
 * Add a new comment
 */
export async function createComment(comment: Partial<Comment>): Promise<{ data: Comment | null; error: any }> {
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
}

/**
 * Update a comment
 */
export async function updateComment(id: string, content: string): Promise<{ data: Comment | null; error: any }> {
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
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<{ success: boolean; error: any }> {
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
}
