
import { useState } from 'react';
import { Card, Collection } from '@/lib/types';
import { 
  fetchCollections,
  createCollection,
  updateCollection,
  deleteCollection
} from './operations/collectionOperations';
import {
  addCardToCollection,
  removeCardFromCollection
} from './operations/cardCollectionOperations';

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
    await fetchCollections(setIsLoading, setError, setCollections);
  };

  // Collection operations
  const handleAddCollection = async (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => {
    return await createCollection(collection, setIsLoading, setError, setCollections);
  };

  const handleUpdateCollection = async (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => {
    await updateCollection(id, updates, collections, setIsLoading, setError, setCollections);
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection(id, setIsLoading, setError, setCards, setCollections);
  };

  // Card-Collection operations
  const handleAddCardToCollection = async (cardId: string, collectionId: string) => {
    const cards = collections.flatMap(c => c.cards);
    await addCardToCollection(
      cardId, 
      collectionId, 
      collections, 
      cards,
      setIsLoading, 
      setError, 
      setCards, 
      setCollections
    );
  };

  const handleRemoveCardFromCollection = async (cardId: string, collectionId: string) => {
    await removeCardFromCollection(
      cardId, 
      collectionId, 
      setIsLoading, 
      setError, 
      setCards, 
      setCollections
    );
  };

  return {
    refreshCollections,
    addCollection: handleAddCollection,
    updateCollection: handleUpdateCollection,
    deleteCollection: handleDeleteCollection,
    addCardToCollection: handleAddCardToCollection,
    removeCardFromCollection: handleRemoveCardFromCollection
  };
};
