
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '../../schema/types';
import { transformCommentFromDb } from './transformers';

/**
 * Get comments with optional filtering
 */
export async function getComments(options: {
  cardId?: string;
  collectionId?: string;
  teamId?: string;
  parentId?: string | null; // null means top-level comments only
}): Promise<{ data: Comment[] | null; error: any }> {
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
}

/**
 * Get reply count for multiple comments - batch operation
 */
export async function getReplyCount(commentIds: string[]): Promise<{ data: Record<string, number> | null; error: any }> {
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
