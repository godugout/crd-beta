import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'baseball';

export interface Reaction {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'post' | 'card' | 'comment';
  type: ReactionType;
  createdAt: string;
}

interface ReactionCounts {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
  baseball: number;
}

export const reactionRepository = {
  addReaction: async (
    contentId: string,
    contentType: 'post' | 'card' | 'comment',
    type: ReactionType,
    userId: string
  ): Promise<Reaction | null> => {
    try {
      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('contentId', contentId)
        .eq('userId', userId)
        .eq('contentType', contentType)
        .single();

      // If exists, update type
      if (existingReaction) {
        const { data, error } = await supabase
          .from('reactions')
          .update({ type, updatedAt: new Date().toISOString() })
          .eq('id', existingReaction.id)
          .select('*')
          .single();

        if (error) throw error;
        return data;
      }

      // Otherwise create new
      const { data, error } = await supabase
        .from('reactions')
        .insert({
          contentId,
          contentType,
          type,
          userId,
          createdAt: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
      return null;
    }
  },

  removeReaction: async (contentId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('contentId', contentId)
        .eq('userId', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
      return false;
    }
  },

  getReactions: async (contentId: string, contentType: string): Promise<Reaction[]> => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('contentId', contentId)
        .eq('contentType', contentType);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return [];
    }
  },

  getReactionCounts: async (
    contentId: string,
    contentType: string
  ): Promise<ReactionCounts> => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('type')
        .eq('contentId', contentId)
        .eq('contentType', contentType);

      if (error) throw error;

      const initialCounts: ReactionCounts = {
        like: 0,
        love: 0,
        celebrate: 0,
        insightful: 0,
        baseball: 0
      };

      // Use reduce to count reaction types
      return (data || []).reduce((counts, reaction) => {
        const type = reaction.type as ReactionType;
        if (type in counts) {
          counts[type]++;
        }
        return counts;
      }, initialCounts);
    } catch (error) {
      console.error('Error fetching reaction counts:', error);
      return {
        like: 0,
        love: 0,
        celebrate: 0,
        insightful: 0,
        baseball: 0
      };
    }
  },

  getUserReaction: async (
    contentId: string, 
    userId: string
  ): Promise<ReactionType | null> => {
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('type')
        .eq('contentId', contentId)
        .eq('userId', userId)
        .single();

      if (error) throw error;
      return data?.type as ReactionType || null;
    } catch (error) {
      // No reaction is expected sometimes, so don't report this as an error
      return null;
    }
  }
};
