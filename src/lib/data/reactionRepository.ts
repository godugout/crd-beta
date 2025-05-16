// Add a stub for missing storageService and userRoles modules
// This is a temporary fix to resolve build errors

// Create stub for missing imports
export const storageService = {
  uploadFile: async () => 'file-url',
  getFile: async () => 'file-url',
  deleteFile: async () => true
};

enum UserRole {
  Admin = 'admin',
  Member = 'member',
  Guest = 'guest'
}

export { UserRole };

import { Card, Collection, Comment, Reaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Function to add a reaction to a card
export const addCardReaction = async (cardId: string, userId: string, type: string): Promise<Reaction | null> => {
  try {
    const { data, error } = await supabase
      .from('reactions')
      .insert([
        { card_id: cardId, user_id: userId, type: type, target_type: 'card', target_id: cardId }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding card reaction:', error);
      return null;
    }

    return data as Reaction;
  } catch (error) {
    console.error('Unexpected error adding card reaction:', error);
    return null;
  }
};

// Function to remove a reaction from a card
export const removeCardReaction = async (reactionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', reactionId);

    if (error) {
      console.error('Error removing card reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error removing card reaction:', error);
    return false;
  }
};

// Function to add a reaction to a comment
export const addCommentReaction = async (commentId: string, userId: string, type: string): Promise<Reaction | null> => {
  try {
    const { data, error } = await supabase
      .from('reactions')
      .insert([
        { comment_id: commentId, user_id: userId, type: type, target_type: 'comment', target_id: commentId }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment reaction:', error);
      return null;
    }

    return data as Reaction;
  } catch (error) {
    console.error('Unexpected error adding comment reaction:', error);
    return null;
  }
};

// Function to remove a reaction from a comment
export const removeCommentReaction = async (reactionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', reactionId);

    if (error) {
      console.error('Error removing comment reaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error removing comment reaction:', error);
    return false;
  }
};

// Function to get reactions for a card
export const getCardReactions = async (cardId: string): Promise<Reaction[]> => {
    try {
        const { data, error } = await supabase
            .from('reactions')
            .select('*')
            .eq('card_id', cardId);

        if (error) {
            console.error('Error fetching card reactions:', error);
            return [];
        }

        return data as Reaction[];
    } catch (error) {
        console.error('Unexpected error fetching card reactions:', error);
        return [];
    }
};

// Function to get reactions for a comment
export const getCommentReactions = async (commentId: string): Promise<Reaction[]> => {
    try {
        const { data, error } = await supabase
            .from('reactions')
            .select('*')
            .eq('comment_id', commentId);

        if (error) {
            console.error('Error fetching comment reactions:', error);
            return [];
        }

        return data as Reaction[];
    } catch (error) {
        console.error('Unexpected error fetching comment reactions:', error);
        return [];
    }
};
