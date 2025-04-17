
import { commentRepository } from './commentRepository';
import { reactionRepository } from './reactionRepository';
import { userRepository } from './userRepository';
import { memoriesRepository } from './memoriesRepository';

// Export all repositories
export {
  commentRepository,
  reactionRepository,
  userRepository,
  memoriesRepository
};

// Mock implementations for missing repositories
export const cardRepository = {
  getCards: async () => ({ data: [], error: null }),
  getCard: async (id: string) => ({ data: null, error: null }),
  createCard: async (data: any) => ({ data, error: null }),
  updateCard: async (id: string, data: any) => ({ data, error: null }),
  deleteCard: async (id: string) => ({ success: true, error: null })
};

export const collectionRepository = {
  getCollections: async () => ({ data: [], error: null }),
  getCollection: async (id: string) => ({ data: null, error: null }),
  createCollection: async (data: any) => ({ data, error: null }),
  updateCollection: async (id: string, data: any) => ({ data, error: null }),
  deleteCollection: async (id: string) => ({ success: true, error: null })
};
