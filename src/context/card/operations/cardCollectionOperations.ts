
import { Card } from '@/lib/types/cardTypes';
import { Collection } from '@/lib/types/collection';

// Temporarily add a mock collectionOperations until the real one is implemented
const collectionOperations = {
  addCardToCollection: async (collectionId: string, cardId: string) => {
    // Implementation would be added when connecting to actual backend
    console.log(`Adding card ${cardId} to collection ${collectionId}`);
    return { error: null };
  },
  removeCardFromCollection: async (collectionId: string, cardId: string) => {
    // Implementation would be added when connecting to actual backend
    console.log(`Removing card ${cardId} from collection ${collectionId}`);
    return { error: null };
  }
};

export const addCardToCollection = async (
  collectionId: string,
  cardId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await collectionOperations.addCardToCollection(collectionId, cardId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to add card to collection';
    console.error('Error adding card to collection:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const removeCardFromCollection = async (
  collectionId: string,
  cardId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await collectionOperations.removeCardFromCollection(collectionId, cardId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to remove card from collection';
    console.error('Error removing card from collection:', errorMessage);
    return { success: false, error: errorMessage };
  }
};
