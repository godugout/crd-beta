
import { v4 as uuidv4 } from 'uuid';
import { Reaction, User } from '@/lib/types';
import { UserRole } from '@/lib/types/user';

export const getReactionsByCardId = async (cardId: string): Promise<Reaction[]> => {
  // Mock data - in a real app, this would fetch from a database
  const reactions: Reaction[] = [
    {
      id: uuidv4(),
      userId: 'user1',
      cardId: cardId,
      type: 'like',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Added updatedAt field
      targetType: 'card',
      targetId: cardId,
      user: {
        id: 'user1',
        email: 'user1@example.com',
        displayName: 'User One',
        name: 'User One',
        username: 'user1',
        avatarUrl: 'https://i.pravatar.cc/150?u=user1',
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ];
  
  return reactions;
};

export const getReactionsByCollectionId = async (collectionId: string): Promise<Reaction[]> => {
  // Mock data - in a real app, this would fetch from a database
  const reactions: Reaction[] = [
    {
      id: uuidv4(),
      userId: 'user1',
      collectionId: collectionId,
      type: 'like',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Added updatedAt field
      targetType: 'collection',
      targetId: collectionId,
      user: {
        id: 'user1',
        email: 'user1@example.com',
        displayName: 'User One',
        name: 'User One',
        username: 'user1',
        avatarUrl: 'https://i.pravatar.cc/150?u=user1',
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  ];
  
  return reactions;
};

export const addReaction = async (reactionData: Omit<Reaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reaction> => {
  // In a real app, this would save to a database
  const newReaction: Reaction = {
    ...reactionData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString() // Added updatedAt field
  };
  
  return newReaction;
};

export const removeReaction = async (id: string): Promise<boolean> => {
  // In a real app, this would delete from a database
  return true;
};
