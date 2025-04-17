
import { Reaction, User, UserRole } from '@/lib/types';

export const reactionRepository = {
  // Get reactions for a specific card
  getReactionsByCardId: async (cardId: string): Promise<Reaction[]> => {
    // This would normally fetch from an API or database
    // For now, returning mock data
    return Promise.resolve([
      {
        id: '1',
        userId: 'user1',
        cardId,
        type: 'like',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Added missing property
        targetType: 'card',
        targetId: cardId,
        user: {
          id: 'user1',
          email: 'user1@example.com',
          displayName: 'User One',
          name: 'User One',
          username: 'user1',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ]);
  },

  // Add a reaction
  addReaction: async (reaction: Omit<Reaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reaction> => {
    // This would normally send to an API or database
    const newReaction = {
      ...reaction,
      id: `reaction-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Added missing property
    };
    
    // Return the created reaction
    return Promise.resolve({
      ...newReaction,
      user: {
        id: newReaction.userId,
        email: `${newReaction.userId}@example.com`,
        displayName: `User ${newReaction.userId}`,
        name: `User ${newReaction.userId}`,
        username: newReaction.userId,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReaction.userId}`,
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } as Reaction);
  },

  // Get all reactions for the main feed
  getReactions: async (): Promise<Reaction[]> => {
    // Mock data for reactions
    return Promise.resolve([
      {
        id: '1',
        userId: 'user1',
        cardId: 'card1',
        type: 'like',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Added missing property
        targetType: 'card',
        targetId: 'card1',
        user: {
          id: 'user1',
          email: 'user1@example.com',
          displayName: 'User One',
          name: 'User One',
          username: 'user1', 
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        id: '2',
        userId: 'user2',
        cardId: 'card2',
        type: 'love',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Added missing property
        targetType: 'card',
        targetId: 'card2',
        user: {
          id: 'user2',
          email: 'user2@example.com',
          displayName: 'User Two',
          name: 'User Two',
          username: 'user2',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ]);
  },

  // Delete a reaction
  deleteReaction: async (id: string): Promise<boolean> => {
    // This would normally delete from an API or database
    // For now, just return success
    return Promise.resolve(true);
  }
};
