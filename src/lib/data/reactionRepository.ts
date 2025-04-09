import { supabase } from '@/lib/supabase';
import { Reaction, DbReaction } from '@/lib/types';

const mapDbReactionToReaction = (dbReaction: DbReaction): Reaction => {
  return {
    id: dbReaction.id,
    type: dbReaction.type,
    userId: dbReaction.user_id,
    cardId: dbReaction.card_id,
    commentId: dbReaction.comment_id,
    collectionId: dbReaction.collection_id,
    createdAt: dbReaction.created_at
  };
};

export const reactionRepository = {
  /**
   * Get reactions for a card
   */
  async getCardReactions(cardId: string) {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select(`
          *,
          profiles:user_id (
            id,
            email:username,
            displayName:full_name,
            avatarUrl:avatar_url
          )
        `)
        .eq('card_id', cardId);
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const reactions: Reaction[] = data.map(item => {
        const reaction = mapDbReactionToReaction(item);
        if (item.profiles) {
          reaction.user = {
            id: item.profiles.id,
            email: item.profiles.email || '',
            displayName: item.profiles.displayName || '',
            avatarUrl: item.profiles.avatarUrl,
            createdAt: '', // These are required but not available from profiles
            updatedAt: ''  // These are required but not available from profiles
          };
        }
        return reaction;
      });
      
      return { data: reactions, error: null };
    } catch (err) {
      console.error('Error getting card reactions:', err);
      return { data: null, error: 'Failed to get reactions' };
    }
  },
  
  /**
   * Add a new reaction
   */
  async addReaction(
    userId: string,
    type: string,
    target: {
      cardId?: string;
      collectionId?: string;
      commentId?: string;
    }
  ) {
    try {
      // First check if user already has a reaction
      let existingQuery = supabase
        .from('reactions')
        .select('*')
        .eq('user_id', userId);
      
      if (target.cardId) {
        existingQuery = existingQuery.eq('card_id', target.cardId);
      } else if (target.collectionId) {
        existingQuery = existingQuery.eq('collection_id', target.collectionId);
      } else if (target.commentId) {
        existingQuery = existingQuery.eq('comment_id', target.commentId);
      } else {
        return { data: null, error: 'No valid target for reaction' };
      }
      
      const { data: existingData, error: existingError } = await existingQuery;
      
      if (existingError) {
        return { data: null, error: existingError.message };
      }
      
      // If user already has a reaction, update it
      if (existingData && existingData.length > 0) {
        const { data, error } = await supabase
          .from('reactions')
          .update({ type })
          .eq('id', existingData[0].id)
          .select()
          .single();
        
        if (error) {
          return { data: null, error: error.message };
        }
        
        return { data: mapDbReactionToReaction(data), error: null };
      }
      
      // Otherwise, insert a new reaction
      const reactionData: any = {
        user_id: userId,
        type
      };
      
      if (target.cardId) reactionData.card_id = target.cardId;
      if (target.collectionId) reactionData.collection_id = target.collectionId;
      if (target.commentId) reactionData.comment_id = target.commentId;
      
      const { data, error } = await supabase
        .from('reactions')
        .insert(reactionData)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      return { data: mapDbReactionToReaction(data), error: null };
    } catch (err) {
      console.error('Error adding reaction:', err);
      return { data: null, error: 'Failed to add reaction' };
    }
  },
  
  /**
   * Remove a reaction
   */
  async removeReaction(
    userId: string,
    target: {
      cardId?: string;
      collectionId?: string;
      commentId?: string;
    }
  ) {
    try {
      let query = supabase
        .from('reactions')
        .delete()
        .eq('user_id', userId);
      
      if (target.cardId) {
        query = query.eq('card_id', target.cardId);
      } else if (target.collectionId) {
        query = query.eq('collection_id', target.collectionId);
      } else if (target.commentId) {
        query = query.eq('comment_id', target.commentId);
      } else {
        return { success: false, error: 'No valid target for reaction' };
      }
      
      const { error } = await query;
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error removing reaction:', err);
      return { success: false, error: 'Failed to remove reaction' };
    }
  }
};
