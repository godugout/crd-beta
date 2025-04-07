
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '../lib/types';
import { useAuth } from './AuthContext';
import { useCardOperations, useCollectionOperations } from './card/hooks';

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
  getCard: (id: string) => Card | undefined; // Add the missing getCard method
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

  // Implement the getCard method
  const getCard = (id: string) => {
    return cards.find(card => card.id === id);
  };

  useEffect(() => {
    if (user) {
      refreshCards();
      refreshCollections();
    } else {
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
    refreshCollections,
    getCard // Add getCard to context value
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
