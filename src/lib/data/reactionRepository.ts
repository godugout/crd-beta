
import { supabase } from '@/lib/supabase';
import { Reaction, DbReaction, User } from '@/lib/types';

// Support the user property in mapDbReactionToReaction:
const mapDbReactionToReaction = (dbReaction: DbReaction, userData?: any): Reaction => {
  const reaction: Reaction = {
    id: dbReaction.id,
    type: dbReaction.type,
    userId: dbReaction.user_id,
    cardId: dbReaction.card_id,
    commentId: dbReaction.comment_id,
    collectionId: dbReaction.collection_id,
    createdAt: dbReaction.created_at
  };

  // Add user data if provided
  if (userData) {
    reaction.user = {
      id: userData.id,
      email: userData.email || '',
      displayName: userData.displayName || '',
      name: userData.name || '',
      avatarUrl: userData.avatarUrl,
      createdAt: '',  // Required by type but may not be available
      updatedAt: ''   // Required by type but may not be available
    };
  }

  return reaction;
};

export const reactionRepository = {
  // Methods for handling reactions
  getCardReactions: async (cardId: string) => {
    try {
      const { data: dbReactions, error } = await supabase
        .from('reactions')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('card_id', cardId);
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const reactions: Reaction[] = dbReactions.map((item: any) => {
        const reaction = mapDbReactionToReaction(item);
        if (item.profiles) {
          reaction.user = {
            id: item.profiles.id,
            email: item.profiles.email || '',
            displayName: item.profiles.displayName || '',
            name: item.profiles.full_name || '',
            username: item.profiles.username,
            avatarUrl: item.profiles.avatarUrl,
            createdAt: '',  // Required fields but not available from profiles
            updatedAt: ''   // Required fields but not available from profiles
          };
        }
        return reaction;
      });
      
      return { data: reactions, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
  
  // More methods as needed...
  addReaction: async (userId: string, type: string, target: {
    cardId?: string;
    collectionId?: string;
    commentId?: string;
  }) => {
    try {
      // Logic to add reaction
      const reactionData = {
        user_id: userId,
        type,
        card_id: target.cardId,
        collection_id: target.collectionId,
        comment_id: target.commentId
      };
      
      const { data: dbReaction, error } = await supabase
        .from('reactions')
        .insert(reactionData)
        .select()
        .single();
      
      if (error) {
        return { data: null, error: error.message };
      }
      
      const reaction = mapDbReactionToReaction(dbReaction);
      return { data: reaction, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
  
  removeReaction: async (userId: string, target: {
    cardId?: string;
    collectionId?: string;
    commentId?: string;
  }) => {
    try {
      let query = supabase
        .from('reactions')
        .delete()
        .eq('user_id', userId);
      
      if (target.cardId) {
        query = query.eq('card_id', target.cardId);
      }
      
      if (target.collectionId) {
        query = query.eq('collection_id', target.collectionId);
      }
      
      if (target.commentId) {
        query = query.eq('comment_id', target.commentId);
      }
      
      const { error } = await query;
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err };
    }
  }
};
