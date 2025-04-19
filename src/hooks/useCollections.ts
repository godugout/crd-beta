
import { useState, useCallback } from 'react';
import { Collection, Card } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      // Here you would typically fetch from an API
      // For now we'll just simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would be replaced with actual fetched data
      setCollections([]);
      
      setLoading(false);
      return collections;
    } catch (error) {
      console.error('Error fetching collections:', error);
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load collections',
        variant: 'destructive',
      });
      return [];
    }
  }, [collections, toast]);

  const createCollection = useCallback(async (collectionData: Partial<Collection>) => {
    try {
      const newCollection: Collection = {
        id: uuidv4(),
        title: collectionData.title || 'Untitled Collection',
        description: collectionData.description || '',
        userId: 'current-user-id', // This would come from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cards: collectionData.cards || [],
        visibility: collectionData.visibility || 'private',
        thumbnailUrl: collectionData.thumbnailUrl || '',
        coverImageUrl: collectionData.coverImageUrl || '',
        tags: collectionData.tags || [],
        isPublic: collectionData.isPublic || false,
        allowComments: collectionData.allowComments || true,
        designMetadata: collectionData.designMetadata || {},
      };
      
      setCollections(prev => [...prev, newCollection]);
      
      toast({
        title: 'Success',
        description: 'Collection created successfully',
      });
      
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to create collection',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const updateCollection = useCallback(async (id: string, updates: Partial<Collection>) => {
    try {
      setCollections(prev => 
        prev.map(collection => 
          collection.id === id ? { ...collection, ...updates, updatedAt: new Date().toISOString() } : collection
        )
      );
      
      toast({
        title: 'Success',
        description: 'Collection updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to update collection',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const deleteCollection = useCallback(async (id: string) => {
    try {
      setCollections(prev => prev.filter(collection => collection.id !== id));
      
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete collection',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const addCardToCollection = useCallback(async (collectionId: string, cardId: string) => {
    try {
      setCollections(prev => 
        prev.map(collection => {
          if (collection.id === collectionId) {
            // Check if cards array exists, if not create it
            const cards = collection.cards || [];
            
            // Check if card already exists in collection
            if (!cards.some(card => card.id === cardId)) {
              return {
                ...collection,
                cards: [...cards, { id: cardId } as Card]
              };
            }
          }
          return collection;
        })
      );
      
      return true;
    } catch (error) {
      console.error('Error adding card to collection:', error);
      return false;
    }
  }, []);

  const removeCardFromCollection = useCallback(async (collectionId: string, cardId: string) => {
    try {
      setCollections(prev => 
        prev.map(collection => {
          if (collection.id === collectionId && collection.cards) {
            return {
              ...collection,
              cards: collection.cards.filter(card => card.id !== cardId)
            };
          }
          return collection;
        })
      );
      
      return true;
    } catch (error) {
      console.error('Error removing card from collection:', error);
      return false;
    }
  }, []);

  return {
    collections,
    loading,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
  };
}
