
import { supabase } from '@/integrations/supabase/client';
import { Reaction, DbReaction } from '../schema/types';
import { toast } from 'sonner';

/**
 * Repository for reaction-related data operations
 */
export const reactionRepository = {
  /**
   * Get reactions for a card
   */
  getCardReactions: async (cardId: string): Promise<{ data: Reaction[] | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*, profiles:user_id(id, full_name, avatar_url, username)')
        .eq('card_id', cardId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reactions:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: [], error: null };
      }
      
      const reactions = data.map((record: any) => transformReactionFromDb(record));
      
      return { data: reactions, error: null };
    } catch (err) {
      console.error('Unexpected error in getCardReactions:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Add a reaction to a card
   */
  addReaction: async (
    userId: string, 
    type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry',
    options: { cardId?: string; collectionId?: string; commentId?: string }
  ): Promise<{ data: Reaction | null; error: any }> => {
    try {
      if (!userId) {
        return { data: null, error: new Error('User ID is required') };
      }
      
      if (!options.cardId && !options.collectionId && !options.commentId) {
        return { data: null, error: new Error('Target ID (card, collection, or comment) is required') };
      }

      // Check for existing reaction
      let query = supabase.from('reactions').select('id');
      
      if (options.cardId) query = query.eq('card_id', options.cardId);
      if (options.collectionId) query = query.eq('collection_id', options.collectionId);
      if (options.commentId) query = query.eq('comment_id', options.commentId);
      
      const { data: existingReaction } = await query
        .eq('user_id', userId)
        .maybeSingle();

      let result;
      if (existingReaction) {
        // Update existing reaction
        result = await supabase
          .from('reactions')
          .update({ type })
          .eq('id', existingReaction.id)
          .select('*, profiles:user_id(id, full_name, avatar_url, username)')
          .single();
      } else {
        // Create new reaction
        const reactionData = {
          user_id: userId,
          type,
          card_id: options.cardId,
          collection_id: options.collectionId,
          comment_id: options.commentId
        };
        
        result = await supabase
          .from('reactions')
          .insert(reactionData)
          .select('*, profiles:user_id(id, full_name, avatar_url, username)')
          .single();
      }

      if (result.error) {
        console.error('Error adding reaction:', result.error);
        return { data: null, error: result.error };
      }
      
      const reaction = transformReactionFromDb(result.data);
      
      return { data: reaction, error: null };
    } catch (err) {
      console.error('Unexpected error in addReaction:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * Remove a reaction
   */
  removeReaction: async (
    userId: string, 
    options: { cardId?: string; collectionId?: string; commentId?: string }
  ): Promise<{ success: boolean; error: any }> => {
    try {
      let query = supabase.from('reactions').delete();
      
      if (options.cardId) query = query.eq('card_id', options.cardId);
      if (options.collectionId) query = query.eq('collection_id', options.collectionId);
      if (options.commentId) query = query.eq('comment_id', options.commentId);
      
      const { error } = await query.eq('user_id', userId);
      
      if (error) {
        console.error('Error removing reaction:', error);
        return { success: false, error };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Unexpected error in removeReaction:', err);
      return { success: false, error: err };
    }
  },
  
  /**
   * Get reaction counts for multiple cards
   * This is an optimized batch operation
   */
  getReactionCounts: async (cardIds: string[]): Promise<{ data: Record<string, Record<string, number>> | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('card_id, type')
        .in('card_id', cardIds);
      
      if (error) {
        console.error('Error fetching reaction counts:', error);
        return { data: null, error };
      }
      
      if (!data) {
        return { data: {}, error: null };
      }
      
      // Process the data to get counts by type for each card
      const counts: Record<string, Record<string, number>> = {};
      
      data.forEach((reaction: any) => {
        if (!reaction.card_id) return;
        
        if (!counts[reaction.card_id]) {
          counts[reaction.card_id] = {};
        }
        
        const cardCounts = counts[reaction.card_id];
        const type = reaction.type;
        
        cardCounts[type] = (cardCounts[type] || 0) + 1;
      });
      
      return { data: counts, error: null };
    } catch (err) {
      console.error('Unexpected error in getReactionCounts:', err);
      return { data: null, error: err };
    }
  }
};

/**
 * Helper to transform database record to Reaction type
 */
function transformReactionFromDb(record: any): Reaction {
  if (!record) return {} as Reaction;
  
  const reaction: Reaction = {
    id: record.id,
    userId: record.user_id,
    cardId: record.card_id,
    collectionId: record.collection_id,
    commentId: record.comment_id,
    type: record.type,
    createdAt: record.created_at,
  };

  // Add profile info if available
  if (record.profiles) {
    reaction.user = {
      id: record.profiles.id,
      name: record.profiles.full_name,
      avatarUrl: record.profiles.avatar_url,
      username: record.profiles.username
    };
  }
  
  return reaction;
}
