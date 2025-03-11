
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '../lib/types';
import { toast } from 'sonner';

type CardContextType = {
  cards: Card[];
  collections: Collection[];
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCard: (id: string) => void;
  addCollection: (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCollection: (id: string) => void;
  addCardToCollection: (cardId: string, collectionId: string) => void;
  removeCardFromCollection: (cardId: string, collectionId: string) => void;
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

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    const savedCollections = localStorage.getItem('collections');

    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards);
        // Convert string dates to Date objects
        const processedCards = parsedCards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt)
        }));
        setCards(processedCards);
      } catch (error) {
        console.error('Error parsing saved cards:', error);
      }
    }

    if (savedCollections) {
      try {
        const parsedCollections = JSON.parse(savedCollections);
        // Convert string dates to Date objects
        const processedCollections = parsedCollections.map((collection: any) => ({
          ...collection,
          createdAt: new Date(collection.createdAt),
          updatedAt: new Date(collection.updatedAt),
          cards: collection.cards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            updatedAt: new Date(card.updatedAt)
          }))
        }));
        setCollections(processedCollections);
      } catch (error) {
        console.error('Error parsing saved collections:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  // Card operations
  const addCard = (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newCard: Card = {
      ...card,
      id: `card_${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setCards(prevCards => [...prevCards, newCard]);
    toast.success('Card created successfully');
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id 
          ? { ...card, ...updates, updatedAt: new Date() } 
          : card
      )
    );
    
    // Also update card in collections
    setCollections(prevCollections => 
      prevCollections.map(collection => ({
        ...collection,
        cards: collection.cards.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date() } 
            : card
        )
      }))
    );
    
    toast.success('Card updated successfully');
  };

  const deleteCard = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
    
    // Also remove card from all collections
    setCollections(prevCollections => 
      prevCollections.map(collection => ({
        ...collection,
        cards: collection.cards.filter(card => card.id !== id)
      }))
    );
    
    toast.success('Card deleted successfully');
  };

  // Collection operations
  const addCollection = (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newCollection: Collection = {
      ...collection,
      id: `collection_${Date.now()}`,
      cards: [],
      createdAt: now,
      updatedAt: now
    };
    setCollections(prevCollections => [...prevCollections, newCollection]);
    toast.success('Collection created successfully');
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === id 
          ? { ...collection, ...updates, updatedAt: new Date() } 
          : collection
      )
    );
    toast.success('Collection updated successfully');
  };

  const deleteCollection = (id: string) => {
    // Update card's collectionId if it belongs to the deleted collection
    setCards(prevCards => 
      prevCards.map(card => 
        card.collectionId === id 
          ? { ...card, collectionId: undefined, updatedAt: new Date() } 
          : card
      )
    );
    
    setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
    toast.success('Collection deleted successfully');
  };

  // Card-Collection operations
  const addCardToCollection = (cardId: string, collectionId: string) => {
    const card = cards.find(c => c.id === cardId);
    
    if (!card) {
      toast.error('Card not found');
      return;
    }
    
    // Update card's collectionId
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId 
          ? { ...c, collectionId, updatedAt: new Date() } 
          : c
      )
    );
    
    // Add card to collection
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === collectionId 
          ? { 
              ...collection, 
              cards: [...collection.cards.filter(c => c.id !== cardId), {...card, collectionId}],
              updatedAt: new Date()
            } 
          : collection
      )
    );
    
    toast.success('Card added to collection');
  };

  const removeCardFromCollection = (cardId: string, collectionId: string) => {
    // Update card's collectionId
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, collectionId: undefined, updatedAt: new Date() } 
          : card
      )
    );
    
    // Remove card from collection
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === collectionId 
          ? { 
              ...collection, 
              cards: collection.cards.filter(card => card.id !== cardId),
              updatedAt: new Date()
            } 
          : collection
      )
    );
    
    toast.success('Card removed from collection');
  };

  const value = {
    cards,
    collections,
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
