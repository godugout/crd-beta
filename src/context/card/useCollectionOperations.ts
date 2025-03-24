
import { useState } from 'react';
import { Card, Collection } from '@/lib/types';
import { toast } from 'sonner';
import { collectionOperations } from '@/lib/supabase';

interface UseCollectionOperationsProps {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useCollectionOperations = ({
  collections,
  setCollections,
  setCards,
  setIsLoading, 
  setError
}: UseCollectionOperationsProps) => {
  
  // Fetch collections from Supabase
  const refreshCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.getCollections();
      
      if (error) {
        setError(error.message);
        toast.error('Failed to load collections: ' + error.message);
        return;
      }
      
      if (data) {
        setCollections(data);
      }
    } catch (err: any) {
      console.error('Fetch collections error:', err);
      setError(err.message || 'Failed to load collections');
      toast.error('An unexpected error occurred loading collections');
    } finally {
      setIsLoading(false);
    }
  };

  // Collection operations
  const addCollection = async (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.createCollection(collection);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to create collection: ' + error.message);
        return;
      }
      
      if (data) {
        setCollections(prev => [...prev, data]);
        toast.success('Collection created successfully');
        return data;
      }
    } catch (err: any) {
      console.error('Create collection error:', err);
      setError(err.message || 'Failed to create collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.updateCollection(id, updates);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to update collection: ' + error.message);
        return;
      }
      
      if (data) {
        // Preserve the cards array from the existing collection
        const existingCollection = collections.find(c => c.id === id);
        const updatedCollection = {
          ...data,
          cards: existingCollection ? existingCollection.cards : []
        };
        
        setCollections(prev => 
          prev.map(collection => 
            collection.id === id ? updatedCollection : collection
          )
        );
        
        toast.success('Collection updated successfully');
      }
    } catch (err: any) {
      console.error('Update collection error:', err);
      setError(err.message || 'Failed to update collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.deleteCollection(id);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to delete collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId if it belongs to the deleted collection
      setCards(prev => 
        prev.map(card => 
          card.collectionId === id 
            ? { ...card, collectionId: undefined }
            : card
        )
      );
      
      setCollections(prev => prev.filter(collection => collection.id !== id));
      toast.success('Collection deleted successfully');
    } catch (err: any) {
      console.error('Delete collection error:', err);
      setError(err.message || 'Failed to delete collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Card-Collection operations
  const addCardToCollection = async (cardId: string, collectionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.addCardToCollection(cardId, collectionId);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to add card to collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, collectionId }
            : card
        )
      );
      
      // Find the card to add to the collection
      const cardToAdd = collections
        .flatMap(c => c.cards)
        .find(c => c.id === cardId);
        
      const cardFromState = cardToAdd || setCards(state => {
        const foundCard = state.find(c => c.id === cardId);
        return state; // Return the state unchanged
      }).find(c => c.id === cardId);
      
      // Add card to collection if found
      if (cardFromState) {
        setCollections(prev => 
          prev.map(collection => 
            collection.id === collectionId 
              ? { 
                  ...collection, 
                  cards: [...collection.cards.filter(c => c.id !== cardId), {...cardFromState, collectionId}]
                } 
              : collection
          )
        );
      }
      
      toast.success('Card added to collection');
    } catch (err: any) {
      console.error('Add card to collection error:', err);
      setError(err.message || 'Failed to add card to collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCardFromCollection = async (cardId: string, collectionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.removeCardFromCollection(cardId);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to remove card from collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, collectionId: undefined }
            : card
        )
      );
      
      // Remove card from collection
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { 
                ...collection, 
                cards: collection.cards.filter(card => card.id !== cardId)
              } 
            : collection
        )
      );
      
      toast.success('Card removed from collection');
    } catch (err: any) {
      console.error('Remove card from collection error:', err);
      setError(err.message || 'Failed to remove card from collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    refreshCollections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };
};
