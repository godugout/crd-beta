
import { v4 as uuidv4 } from 'uuid';
import { Reaction } from '@/lib/types';
import { UserRole } from '@/lib/types/user';

export const sampleReactions: Reaction[] = [
  {
    id: '1',
    userId: 'user1',
    cardId: 'card1',
    type: 'like',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
      isVerified: true,
      isActive: true,
      permissions: ['read:own', 'write:own', 'delete:own']
    }
  },
  {
    id: '2',
    userId: 'user2',
    cardId: 'card1',
    type: 'love',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetType: 'card',
    targetId: 'card1',
    user: {
      id: 'user2',
      email: 'user2@example.com',
      displayName: 'User Two',
      name: 'User Two',
      username: 'user2',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true,
      isActive: true,
      permissions: ['read:own', 'write:own', 'delete:own']
    }
  }
];

// Create a reaction
export const createReaction = async (data: Partial<Reaction>): Promise<Reaction> => {
  const timestamp = new Date().toISOString();
  
  const reaction: Reaction = {
    id: uuidv4(),
    userId: data.userId || 'anonymous',
    cardId: data.cardId,
    type: data.type || 'like',
    createdAt: timestamp,
    updatedAt: timestamp,
    targetType: data.targetType || 'card',
    targetId: data.targetId || data.cardId || '',
    user: data.user || {
      id: 'anonymous',
      email: 'anonymous@example.com',
      name: 'Anonymous',
      displayName: 'Anonymous',
      username: 'anonymous',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
      role: UserRole.USER,
      createdAt: timestamp,
      updatedAt: timestamp,
      isVerified: true,
      isActive: true,
      permissions: ['read:own']
    }
  };
  
  sampleReactions.push(reaction);
  return reaction;
};

// Get reactions for an entity
export const getReactions = async (targetType: string, targetId: string): Promise<Reaction[]> => {
  return sampleReactions.filter(r => r.targetType === targetType && r.targetId === targetId);
};

// Delete a reaction
export const deleteReaction = async (id: string): Promise<boolean> => {
  const index = sampleReactions.findIndex(r => r.id === id);
  if (index === -1) {
    return false;
  }
  
  sampleReactions.splice(index, 1);
  return true;
};

// Check if a user has reacted
export const hasUserReacted = async (userId: string, targetType: string, targetId: string): Promise<boolean> => {
  return sampleReactions.some(r => r.userId === userId && r.targetType === targetType && r.targetId === targetId);
};
