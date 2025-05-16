
import { Card } from '@/lib/types/cardTypes';
import { Collection } from '@/lib/types/collection';
import { collectionOperations } from '@/lib/supabase';

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
