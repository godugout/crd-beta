
// Export repositories from one central place
import { reactionRepository } from './reactions';
import { commentRepository } from './comments';

// Mock repositories until they are properly implemented
const cardRepository = {
  getCards: async () => ({ data: [], error: null }),
  getCardById: async (id: string) => ({ data: null, error: null }),
  createCard: async (card: any) => ({ data: card, error: null }),
  updateCard: async (id: string, card: any) => ({ data: { ...card, id }, error: null }),
  deleteCard: async (id: string) => ({ success: true, error: null })
};

const collectionRepository = {
  getCollections: async () => ({ data: [], error: null }),
  getCollectionById: async (id: string) => ({ data: null, error: null }),
  createCollection: async (collection: any) => ({ data: collection, error: null }),
  updateCollection: async (id: string, collection: any) => ({ data: { ...collection, id }, error: null }),
  deleteCollection: async (id: string) => ({ success: true, error: null })
};

const userRepository = {
  getUsers: async () => ({ data: [], error: null }),
  getUserById: async (id: string) => ({ data: null, error: null }),
  updateUser: async (id: string, user: any) => ({ data: { ...user, id }, error: null })
};

const memoriesRepository = {
  getMemories: async () => ({ data: [], error: null }),
  createMemory: async (memory: any) => ({ data: memory, error: null })
};

export {
  cardRepository,
  commentRepository,
  reactionRepository,
  collectionRepository,
  userRepository,
  memoriesRepository
};

export { transformCommentFromDb } from './comments';
