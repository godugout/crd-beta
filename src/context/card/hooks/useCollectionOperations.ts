
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@/lib/types';
import { toast } from 'sonner';

export default function useCollectionOperations() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    setIsLoading(true);
    try {
      const newCollection: Collection = {
        ...collectionData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cards: [],
        cardIds: [],
        userId: collectionData.userId || 'anonymous',
        isPublic: collectionData.isPublic ?? true,
        name: collectionData.name || 'Untitled Collection',
        description: collectionData.description || '',
        coverImageUrl: collectionData.coverImageUrl || '',
        visibility: collectionData.visibility || 'public',
        allowComments: collectionData.allowComments ?? true,
        designMetadata: collectionData.designMetadata || {},
      } as Collection;
      
      setCollections(prevCollections => [...prevCollections, newCollection]);
      toast.success("Collection created successfully");
      return newCollection;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create collection');
      setError(error);
      toast.error(`Error creating collection: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>): Promise<Collection> => {
    setIsLoading(true);
    try {
      let updatedCollection: Collection | null = null;
      
      setCollections(prevCollections => {
        const updated = prevCollections.map(collection => {
          if (collection.id === id) {
            const updated = {
              ...collection,
              ...updates,
              updatedAt: new Date().toISOString()
            };
            updatedCollection = updated;
            return updated;
          }
          return collection;
        });
        return updated;
      });
      
      if (!updatedCollection) {
        throw new Error(`Collection with id ${id} not found`);
      }
      
      toast.success("Collection updated successfully");
      return updatedCollection;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update collection');
      setError(error);
      toast.error(`Error updating collection: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      toast.success("Collection deleted successfully");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete collection');
      setError(error);
      toast.error(`Error deleting collection: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addCardToCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setCollections(prevCollections => {
        return prevCollections.map(collection => {
          if (collection.id === collectionId) {
            // Don't add if card is already in the collection
            if (collection.cardIds.includes(cardId)) {
              return collection;
            }
            
            return {
              ...collection,
              cardIds: [...collection.cardIds, cardId],
              updatedAt: new Date().toISOString()
            };
          }
          return collection;
        });
      });
      
      toast.success("Card added to collection");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add card to collection');
      setError(error);
      toast.error(`Error adding card to collection: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCardFromCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setCollections(prevCollections => {
        return prevCollections.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              cardIds: collection.cardIds.filter(id => id !== cardId),
              updatedAt: new Date().toISOString()
            };
          }
          return collection;
        });
      });
      
      toast.success("Card removed from collection");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove card from collection');
      setError(error);
      toast.error(`Error removing card from collection: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    collections,
    isLoading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };
}
