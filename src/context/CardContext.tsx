
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '../lib/types';
import { useAuth } from './AuthContext';
import { useCardOperations } from './card/useCardOperations';
import { useCollectionOperations } from './card/useCollectionOperations';

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

  // Initialize card operations hook
  const { 
    refreshCards,
    addCard,
    updateCard,
    deleteCard
  } = useCardOperations({
    cards,
    setCards,
    setIsLoading,
    setError
  });

  // Initialize collection operations hook
  const {
    refreshCollections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  } = useCollectionOperations({
    collections,
    setCollections,
    setCards,
    setIsLoading,
    setError
  });

  // Load data from Supabase on initial render and when user changes
  useEffect(() => {
    if (user) {
      refreshCards();
      refreshCollections();
    } else {
      // Clear data when user logs out
      setCards([]);
      setCollections([]);
    }
  }, [user]);

  const value = {
    cards,
    collections,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    refreshCards,
    refreshCollections
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
