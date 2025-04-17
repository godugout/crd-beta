
import { Reaction } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for reactions
let reactions: Reaction[] = [];

export const reactionRepository = {
  getReactions: async ({ 
    cardId,
    collectionId,
    commentId,
    userId
  }: {
    cardId?: string;
    collectionId?: string;
    commentId?: string;
    userId?: string;
  }) => {
    try {
      let filtered = [...reactions];
      
      if (cardId) {
        filtered = filtered.filter(r => r.cardId === cardId);
      }
      
      if (collectionId) {
        filtered = filtered.filter(r => r.collectionId === collectionId);
      }
      
      if (commentId) {
        filtered = filtered.filter(r => r.commentId === commentId);
      }
      
      if (userId) {
        filtered = filtered.filter(r => r.userId === userId);
      }
      
      return { data: filtered, error: null };
    } catch (error) {
      console.error('Error getting reactions:', error);
      return { data: null, error: 'Failed to get reactions' };
    }
  },
  
  createReaction: async (reaction: Partial<Reaction>) => {
    try {
      const timestamp = new Date().toISOString();
      const newReaction: Reaction = {
        id: uuidv4(),
        userId: reaction.userId!,
        type: reaction.type!,
        targetType: reaction.targetType!,
        targetId: reaction.targetId!,
        cardId: reaction.cardId,
        collectionId: reaction.collectionId,
        commentId: reaction.commentId,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      reactions.push(newReaction);
      
      return { data: newReaction, error: null };
    } catch (error) {
      console.error('Error creating reaction:', error);
      return { data: null, error: 'Failed to create reaction' };
    }
  },
  
  deleteReaction: async (id: string) => {
    try {
      const initialLength = reactions.length;
      reactions = reactions.filter(r => r.id !== id);
      
      const success = reactions.length < initialLength;
      
      return { success, error: null };
    } catch (error) {
      console.error('Error deleting reaction:', error);
      return { success: false, error: 'Failed to delete reaction' };
    }
  },
  
  getUserReaction: async ({
    userId,
    targetType,
    targetId
  }: {
    userId: string;
    targetType: string;
    targetId: string;
  }) => {
    try {
      const userReaction = reactions.find(
        r => r.userId === userId && r.targetType === targetType && r.targetId === targetId
      );
      
      return { data: userReaction || null, error: null };
    } catch (error) {
      console.error('Error getting user reaction:', error);
      return { data: null, error: 'Failed to get user reaction' };
    }
  }
};
