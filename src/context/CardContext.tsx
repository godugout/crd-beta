
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Card, Collection } from '../lib/types';
import { useAuth } from './auth';
import { useCardOperations, useCollectionOperations } from './card/hooks';
import { fetchCards, createCard, updateCard as updateCardOperation, deleteCard as deleteCardOperation } from './card/operations/cardOperations';
import { 
  fetchCollections, 
  createCollection, 
  updateCollection as updateCollectionOperation,
  deleteCollection as deleteCollectionOperation
} from './card/operations/collectionOperations';
import { 
  addCardToCollection as addCardToCollectionOperation, 
  removeCardFromCollection as removeCardFromCollectionOperation
} from './card/operations/cardCollectionOperations';

type CardContextType = {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card | undefined>;
  updateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => Promise<Collection | undefined>;
  updateCollection: (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<void>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<void>;
  refreshCards: () => Promise<void>;
  refreshCollections: () => Promise<void>;
  getCard: (id: string) => Card | undefined;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isRefreshing = useRef(false);
  const lastRefreshTime = useRef(0);
  const refreshAttempts = useRef(0);
  
  const { getCard } = useCardOperations();

  // Function to refresh cards from the data source with debouncing and rate limiting
  const refreshCards = async () => {
    const now = Date.now();
    
    // Prevent multiple simultaneous refreshes
    if (isRefreshing.current) {
      console.log('A refresh operation is already in progress, skipping...');
      return;
    }
    
    // Prevent excessive refreshes (limit to once every 5 seconds)
    if (now - lastRefreshTime.current < 5000) {
      console.log('Refresh rate limited, skipping...');
      return;
    }
    
    try {
      isRefreshing.current = true;
      lastRefreshTime.current = now;
      refreshAttempts.current += 1;
      
      // After 3 attempts, increase the wait time to prevent hammering the server
      if (refreshAttempts.current > 3) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      await fetchCards(setIsLoading, setError, setCards);
      
      // Reset attempt counter on success
      refreshAttempts.current = 0;
    } catch (err) {
      console.error('Error in refreshCards:', err);
    } finally {
      isRefreshing.current = false;
    }
  };

  // Function to add a new card
  const addCard = async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await createCard(cardData as any, setIsLoading, setError, setCards);
  };

  // Function to update an existing card
  const updateCardWrapper = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => {
    await updateCardOperation(id, updates, setIsLoading, setError, setCards);
  };

  // Function to delete a card
  const deleteCardWrapper = async (id: string) => {
    await deleteCardOperation(id, setIsLoading, setError, setCards);
  };

  // Function to refresh collections from the data source
  const refreshCollections = async () => {
    await fetchCollections(setIsLoading, setError, setCollections);
  };

  // Function to add a new collection
  const addCollection = async (collectionData: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => {
    return await createCollection(collectionData as any, setIsLoading, setError, setCollections);
  };

  // Function to update an existing collection
  const updateCollectionWrapper = async (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => {
    await updateCollectionOperation(id, updates, collections, setIsLoading, setError, setCollections);
  };

  // Function to delete a collection
  const deleteCollectionWrapper = async (id: string) => {
    await deleteCollectionOperation(id, setIsLoading, setError, setCards, setCollections);
  };

  // Function to add a card to a collection
  const addCardToCollectionWrapper = async (cardId: string, collectionId: string) => {
    await addCardToCollectionOperation(cardId, collectionId, collections, cards, setIsLoading, setError, setCards, setCollections);
  };

  // Function to remove a card from a collection
  const removeCardFromCollectionWrapper = async (cardId: string, collectionId: string) => {
    await removeCardFromCollectionOperation(cardId, collectionId, setIsLoading, setError, setCards, setCollections);
  };

  useEffect(() => {
    let isFirstLoad = true;
    
    if (user) {
      // On initial load or user change, fetch data
      if (isFirstLoad) {
        refreshCards();
        refreshCollections();
        isFirstLoad = false;
      }
    } else {
      setCards([]);
      setCollections([]);
    }
  }, [user]);

  const value: CardContextType = {
    cards,
    collections,
    isLoading,
    error,
    addCard,
    updateCard: updateCardWrapper,
    deleteCard: deleteCardWrapper,
    addCollection,
    updateCollection: updateCollectionWrapper,
    deleteCollection: deleteCollectionWrapper,
    addCardToCollection: addCardToCollectionWrapper,
    removeCardFromCollection: removeCardFromCollectionWrapper,
    refreshCards,
    refreshCollections,
    getCard
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
