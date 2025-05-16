
// Basic implementation of the reaction repository
import { Reaction } from '../types';
import { storageService } from '../services/storageService';
import UserRole from '../enums/userRoles';

// In-memory store for reactions
let reactions: Reaction[] = [];

/**
 * Get all reactions for a card
 */
export const getAllByCardId = async (cardId: string): Promise<Reaction[]> => {
  return reactions.filter(reaction => reaction.cardId === cardId);
};

/**
 * Add a reaction
 */
export const add = async (
  userId: string,
  cardId?: string,
  collectionId?: string,
  commentId?: string,
  type: string = 'like'
): Promise<Reaction> => {
  const newReaction = {
    id: `reaction-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    cardId,
    collectionId,
    commentId,
    type,
    createdAt: new Date().toISOString()
  } as Reaction;
  
  reactions.push(newReaction);
  return newReaction;
};

/**
 * Remove a reaction
 */
export const remove = async (reactionId: string): Promise<boolean> => {
  const initialLength = reactions.length;
  reactions = reactions.filter(r => r.id !== reactionId);
  return reactions.length < initialLength;
};

/**
 * Remove a reaction by user, card and type
 */
export const removeByUserAndType = async (userId: string, cardId: string, type: string): Promise<boolean> => {
  const initialLength = reactions.length;
  reactions = reactions.filter(r => 
    !(r.userId === userId && r.cardId === cardId && r.type === type)
  );
  return reactions.length < initialLength;
};

/**
 * Get reaction count for a card
 */
export const getCountByCardId = async (cardId: string): Promise<Record<string, number>> => {
  const cardReactions = await getAllByCardId(cardId);
  return cardReactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Check if a user has a specific reaction on a card
 */
export const hasReaction = async (userId: string, cardId: string, type: string): Promise<boolean> => {
  return reactions.some(r => 
    r.userId === userId && r.cardId === cardId && r.type === type
  );
};

// Create a named object to export as reactionRepository
export const reactionRepository = {
  getAllByCardId,
  add,
  remove,
  removeByUserAndType,
  getCountByCardId,
  hasReaction
};
