
import { useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { Collection } from '@/lib/types';
import { toast } from 'sonner';

export const useCollectionOperations = () => {
  const { 
    createCollection: createCollectionInContext,
    updateCollection: updateCollectionInContext,
    deleteCollection: deleteCollectionFromContext,
    addCardToCollection: addCardToCollectionInContext,
    removeCardFromCollection: removeCardFromCollectionInContext
  } = useCards();

  const createCollection = useCallback(
    async (collectionData: Partial<Collection>) => {
      try {
        const newCollection = await createCollectionInContext(collectionData);
        toast.success('Collection created successfully');
        return newCollection;
      } catch (error) {
        console.error('Error creating collection:', error);
        toast.error('Failed to create collection');
        throw error;
      }
    },
    [createCollectionInContext]
  );

  const updateCollection = useCallback(
    async (id: string, updates: Partial<Collection>) => {
      try {
        const updatedCollection = await updateCollectionInContext(id, updates);
        if (updatedCollection) {
          toast.success('Collection updated successfully');
        } else {
          toast.error('Failed to update collection');
        }
        return updatedCollection;
      } catch (error) {
        console.error('Error updating collection:', error);
        toast.error('Failed to update collection');
        return null;
      }
    },
    [updateCollectionInContext]
  );

  const deleteCollection = useCallback(
    async (id: string) => {
      try {
        const success = await deleteCollectionFromContext(id);
        if (success) {
          toast.success('Collection deleted successfully');
        } else {
          toast.error('Failed to delete collection');
        }
        return success;
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
        return false;
      }
    },
    [deleteCollectionFromContext]
  );

  const addCardToCollection = useCallback(
    async (cardId: string, collectionId: string) => {
      try {
        const success = await addCardToCollectionInContext(cardId, collectionId);
        if (success) {
          toast.success('Card added to collection');
        } else {
          toast.error('Failed to add card to collection');
        }
        return success;
      } catch (error) {
        console.error('Error adding card to collection:', error);
        toast.error('Failed to add card to collection');
        return false;
      }
    },
    [addCardToCollectionInContext]
  );

  const removeCardFromCollection = useCallback(
    async (cardId: string, collectionId: string) => {
      try {
        const success = await removeCardFromCollectionInContext(cardId, collectionId);
        if (success) {
          toast.success('Card removed from collection');
        } else {
          toast.error('Failed to remove card from collection');
        }
        return success;
      } catch (error) {
        console.error('Error removing card from collection:', error);
        toast.error('Failed to remove card from collection');
        return false;
      }
    },
    [removeCardFromCollectionInContext]
  );

  return {
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };
};

export default useCollectionOperations;
