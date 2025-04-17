
import { Reaction } from '@/lib/types';

// Define the interface for the reaction repository
export interface ReactionRepositoryInterface {
  getReactions: ({ cardId, collectionId, commentId, userId }: { 
    cardId?: string; 
    collectionId?: string; 
    commentId?: string; 
    userId?: string; 
  }) => Promise<{ data: Reaction[]; error: any; } | { data: any; error: string; }>;
  
  createReaction: (reaction: Partial<Reaction>) => Promise<Reaction | null>;
  
  deleteReaction: (id: string) => Promise<boolean>;
  
  getReactionsByCardId: (cardId: string) => Promise<Reaction[]>;
  
  addReaction: (reactionData: Partial<Reaction>) => Promise<Reaction | null>;
}

// Mock implementation for now
const mockReactionRepository: ReactionRepositoryInterface = {
  getReactions: async ({ cardId, collectionId, commentId, userId }) => {
    console.log("Mock getReactions called", { cardId, collectionId, commentId, userId });
    return { data: [], error: null };
  },
  
  createReaction: async (reaction) => {
    console.log("Mock createReaction called", reaction);
    return {
      id: 'mock-id',
      userId: reaction.userId || '',
      type: reaction.type || 'like',
      targetType: reaction.targetType || 'card',
      targetId: reaction.targetId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...reaction
    };
  },
  
  deleteReaction: async (id) => {
    console.log("Mock deleteReaction called", id);
    return true;
  },
  
  getReactionsByCardId: async (cardId) => {
    console.log("Mock getReactionsByCardId called", cardId);
    return [];
  },
  
  addReaction: async (reactionData) => {
    console.log("Mock addReaction called", reactionData);
    return {
      id: 'mock-id',
      userId: reactionData.userId || '',
      type: reactionData.type || 'like',
      targetType: reactionData.targetType || 'card',
      targetId: reactionData.targetId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...reactionData
    };
  }
};

export const reactionRepository: ReactionRepositoryInterface = mockReactionRepository;
