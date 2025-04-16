
import { useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Collection } from '@/lib/types';

export const useCollectionOperations = () => {
  const { 
    createCollection, 
    updateCollection, 
    deleteCollection, 
    addCardToCollection, 
    removeCardFromCollection, 
    collections 
  } = useCards();
  
  const createNewCollection = useCallback(async (collectionData: Partial<Collection>) => {
    try {
      const newCollection = await createCollection(collectionData);
      toast.success('Collection created successfully');
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
      throw error;
    }
  }, [createCollection]);
  
  const editCollection = useCallback(async (id: string, collectionData: Partial<Collection>) => {
    try {
      const updatedCollection = await updateCollection(id, collectionData);
      
      if (updatedCollection) {
        toast.success('Collection updated successfully');
      } else {
        toast.error('Failed to update collection');
      }
      
      return updatedCollection;
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
      throw error;
    }
  }, [updateCollection]);
  
  const removeCollection = useCallback(async (id: string, onSuccess?: () => void) => {
    try {
      const success = await deleteCollection(id);
      
      if (success) {
        toast.success('Collection deleted successfully');
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to delete collection');
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
      throw error;
    }
  }, [deleteCollection]);
  
  const duplicateCollection = useCallback(async (id: string) => {
    try {
      const originalCollection = collections.find(collection => collection.id === id);
      
      if (!originalCollection) {
        toast.error('Collection not found');
        return null;
      }
      
      const { id: _, createdAt, updatedAt, cards, ...collectionData } = originalCollection;
      
      const duplicatedCollection = {
        ...collectionData,
        name: `Copy of ${collectionData.name}`
      };
      
      const newCollection = await createCollection(duplicatedCollection);
      toast.success('Collection duplicated successfully');
      
      return newCollection;
    } catch (error) {
      console.error('Error duplicating collection:', error);
      toast.error('Failed to duplicate collection');
      throw error;
    }
  }, [createCollection, collections]);
  
  const addCardToExistingCollection = useCallback(async (cardId: string, collectionId: string) => {
    try {
      const success = await addCardToCollection(cardId, collectionId);
      
      if (success) {
        toast.success('Card added to collection');
      } else {
        toast.error('Failed to add card to collection');
      }
      
      return success;
    } catch (error) {
      console.error('Error adding card to collection:', error);
      toast.error('Failed to add card to collection');
      throw error;
    }
  }, [addCardToCollection]);
  
  const removeCardFromExistingCollection = useCallback(async (cardId: string, collectionId: string) => {
    try {
      const success = await removeCardFromCollection(cardId, collectionId);
      
      if (success) {
        toast.success('Card removed from collection');
      } else {
        toast.error('Failed to remove card from collection');
      }
      
      return success;
    } catch (error) {
      console.error('Error removing card from collection:', error);
      toast.error('Failed to remove card from collection');
      throw error;
    }
  }, [removeCardFromCollection]);
  
  const shareCollection = useCallback((collection: Collection) => {
    const shareUrl = `${window.location.origin}/collections/${collection.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: collection.name,
        text: collection.description || 'Check out this collection!',
        url: shareUrl
      })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      });
  };
  
  return {
    createCollection: createNewCollection,
    editCollection,
    removeCollection,
    duplicateCollection,
    addCardToCollection: addCardToExistingCollection,
    removeCardFromCollection: removeCardFromExistingCollection,
    shareCollection
  };
};

export default useCollectionOperations;
