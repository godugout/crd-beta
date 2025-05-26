import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, Collection, Deck } from '@/lib/types';

interface CardEnhancedContextType {
  cards: Card[];
  collections: Collection[];
  decks: Deck[];
  loading: boolean;
  error: string | null;
  selectedCard: Card | null;
  selectedCollection: Collection | null;
  selectedDeck: Deck | null;
  fetchCards: () => Promise<Card[]>;
  fetchCollections: () => Promise<Collection[]>;
  fetchDecks: () => Promise<Deck[]>;
  getCard: (id: string) => Promise<Card | null>;
  getCollection: (id: string) => Promise<Collection | null>;
  getDeck: (id: string) => Promise<Deck | null>;
  createCard: (title: string, description?: string) => Promise<Card>;
  updateCard: (id: string, data: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  createCollection: (name: string, description?: string) => Promise<Collection>;
  updateCollection: (id: string, data: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  createDeck: (name: string, description: string) => Promise<Deck>;
  updateDeck: (id: string, data: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<boolean>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<boolean>;
  addCardToDeck: (cardId: string, deckId: string) => Promise<boolean>;
  removeCardFromDeck: (cardId: string, deckId: string) => Promise<boolean>;
  selectCard: (card: Card | null) => void;
  selectCollection: (collection: Collection | null) => void;
  selectDeck: (deck: Deck | null) => void;
}

const CardEnhancedContext = createContext<CardEnhancedContextType | undefined>(undefined);

export const CardEnhancedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  
  // Mock user ID for demo purposes
  const userId = 'user-123';
  
  // Fetch cards from API or local storage
  const fetchCards = async (): Promise<Card[]> => {
    setLoading(true);
    try {
      // Mock API call
      const response = await new Promise<Card[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'card-1',
              title: 'Sample Card 1',
              description: 'This is a sample card',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Card,
            {
              id: 'card-2',
              title: 'Sample Card 2',
              description: 'Another sample card',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Card,
          ]);
        }, 500);
      });
      
      setCards(response);
      setError(null);
      return response;
    } catch (err) {
      setError('Failed to fetch cards');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch collections from API or local storage
  const fetchCollections = async (): Promise<Collection[]> => {
    setLoading(true);
    try {
      // Mock API call
      const response = await new Promise<Collection[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'collection-1',
              name: 'Sample Collection',
              description: 'This is a sample collection',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              cards: [],
              cardIds: [],
            } as Collection,
          ]);
        }, 500);
      });
      
      setCollections(response);
      setError(null);
      return response;
    } catch (err) {
      setError('Failed to fetch collections');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch decks from API or local storage
  const fetchDecks = async (): Promise<Deck[]> => {
    setLoading(true);
    try {
      // Mock API call
      const response = await new Promise<Deck[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'deck-1',
              name: 'Sample Deck',
              description: 'This is a sample deck',
              coverImageUrl: '/placeholder-card.png',
              userId: 'user-123',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              cards: [],
              cardIds: [],
              isPublic: true,
            } as Deck,
          ]);
        }, 500);
      });
      
      setDecks(response);
      setError(null);
      return response;
    } catch (err) {
      setError('Failed to fetch decks');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single card by ID
  const getCard = async (id: string): Promise<Card | null> => {
    setLoading(true);
    try {
      const card = cards.find(c => c.id === id);
      if (card) {
        return card;
      }
      
      // Mock API call for fetching a single card
      const response = await new Promise<Card | null>((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            title: `Card ${id}`,
            description: 'Fetched card',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Card);
        }, 300);
      });
      
      if (response) {
        setCards(prev => [...prev, response]);
      }
      
      setError(null);
      return response;
    } catch (err) {
      setError(`Failed to fetch card ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single collection by ID
  const getCollection = async (id: string): Promise<Collection | null> => {
    setLoading(true);
    try {
      const collection = collections.find(c => c.id === id);
      if (collection) {
        return collection;
      }
      
      // Mock API call
      const response = await new Promise<Collection | null>((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            name: `Collection ${id}`,
            description: 'Fetched collection',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cards: [],
            cardIds: [],
          } as Collection);
        }, 300);
      });
      
      if (response) {
        setCollections(prev => [...prev, response]);
      }
      
      setError(null);
      return response;
    } catch (err) {
      setError(`Failed to fetch collection ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single deck by ID
  const getDeck = async (id: string): Promise<Deck | null> => {
    setLoading(true);
    try {
      const deck = decks.find(d => d.id === id);
      if (deck) {
        return deck;
      }
      
      // Mock API call
      const response = await new Promise<Deck | null>((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            name: `Deck ${id}`,
            description: 'Fetched deck',
            coverImageUrl: '/placeholder-card.png',
            userId: 'user-123',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cards: [],
            cardIds: [],
            isPublic: true,
          } as Deck);
        }, 300);
      });
      
      if (response) {
        setDecks(prev => [...prev, response]);
      }
      
      setError(null);
      return response;
    } catch (err) {
      setError(`Failed to fetch deck ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new card
  const createCard = async (title: string, description?: string): Promise<Card> => {
    setLoading(true);
    try {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Card;
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCards(prev => [...prev, newCard]);
      setError(null);
      return newCard;
    } catch (err) {
      setError('Failed to create card');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing card
  const updateCard = async (id: string, data: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const cardIndex = cards.findIndex(c => c.id === id);
      if (cardIndex === -1) {
        throw new Error(`Card ${id} not found`);
      }
      
      const updatedCard = {
        ...cards[cardIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCards = [...cards];
      updatedCards[cardIndex] = updatedCard;
      setCards(updatedCards);
      
      setError(null);
      return updatedCard;
    } catch (err) {
      setError(`Failed to update card ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a card
  const deleteCard = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCards(prev => prev.filter(card => card.id !== id));
      
      // Also remove from collections
      setCollections(prev => 
        prev.map(collection => ({
          ...collection,
          cards: collection.cards?.filter(card => card.id !== id) || [],
          cardIds: collection.cardIds?.filter(cardId => cardId !== id) || [],
        }))
      );
      
      // And from decks
      setDecks(prev => 
        prev.map(deck => ({
          ...deck,
          cards: deck.cards?.filter(card => card.id !== id) || [],
          cardIds: deck.cardIds?.filter(cardId => cardId !== id) || [],
        }))
      );
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to delete card ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new deck
  const createDeck = async (name: string, description: string): Promise<Deck> => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name,
      description,
      coverImageUrl: '/placeholder-card.png',
      userId: 'current-user', // Add userId
      ownerId: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [],
      cardIds: [],
      isPublic: true,
    };
    
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDecks(prev => [...prev, newDeck]);
      setError(null);
      return newDeck;
    } catch (err) {
      setError('Failed to create deck');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing deck
  const updateDeck = async (id: string, data: Partial<Deck>): Promise<Deck> => {
    setLoading(true);
    try {
      const deckIndex = decks.findIndex(d => d.id === id);
      if (deckIndex === -1) {
        throw new Error(`Deck ${id} not found`);
      }
      
      const updatedDeck = {
        ...decks[deckIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedDecks = [...decks];
      updatedDecks[deckIndex] = updatedDeck;
      setDecks(updatedDecks);
      
      setError(null);
      return updatedDeck;
    } catch (err) {
      setError(`Failed to update deck ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a deck
  const deleteDeck = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDecks(prev => prev.filter(deck => deck.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to delete deck ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new collection
  const createCollection = async (name: string, description?: string): Promise<Collection> => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      description: description || '',
      coverImageUrl: '/placeholder-card.png',
      ownerId: userId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [],
      cardIds: [],
      isPublic: true,
    };
    
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCollections(prev => [...prev, newCollection]);
      setError(null);
      return newCollection;
    } catch (err) {
      setError('Failed to create collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing collection
  const updateCollection = async (id: string, data: Partial<Collection>): Promise<Collection> => {
    setLoading(true);
    try {
      const collectionIndex = collections.findIndex(c => c.id === id);
      if (collectionIndex === -1) {
        throw new Error(`Collection ${id} not found`);
      }
      
      const updatedCollection = {
        ...collections[collectionIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCollections = [...collections];
      updatedCollections[collectionIndex] = updatedCollection;
      setCollections(updatedCollections);
      
      setError(null);
      return updatedCollection;
    } catch (err) {
      setError(`Failed to update collection ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a collection
  const deleteCollection = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCollections(prev => prev.filter(collection => collection.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to delete collection ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a card to a collection
  const addCardToCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        throw new Error(`Card ${cardId} not found`);
      }
      
      const collectionIndex = collections.findIndex(c => c.id === collectionId);
      if (collectionIndex === -1) {
        throw new Error(`Collection ${collectionId} not found`);
      }
      
      const collection = collections[collectionIndex];
      
      // Check if card is already in collection
      if (collection.cardIds?.includes(cardId)) {
        return true;
      }
      
      const updatedCollection = {
        ...collection,
        cards: [...(collection.cards || []), card],
        cardIds: [...(collection.cardIds || []), cardId],
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCollections = [...collections];
      updatedCollections[collectionIndex] = updatedCollection;
      setCollections(updatedCollections);
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to add card ${cardId} to collection ${collectionId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a card from a collection
  const removeCardFromCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const collectionIndex = collections.findIndex(c => c.id === collectionId);
      if (collectionIndex === -1) {
        throw new Error(`Collection ${collectionId} not found`);
      }
      
      const collection = collections[collectionIndex];
      
      const updatedCollection = {
        ...collection,
        cards: collection.cards?.filter(card => card.id !== cardId) || [],
        cardIds: collection.cardIds?.filter(id => id !== cardId) || [],
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCollections = [...collections];
      updatedCollections[collectionIndex] = updatedCollection;
      setCollections(updatedCollections);
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to remove card ${cardId} from collection ${collectionId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a card to a deck
  const addCardToDeck = async (cardId: string, deckId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        throw new Error(`Card ${cardId} not found`);
      }
      
      const deckIndex = decks.findIndex(d => d.id === deckId);
      if (deckIndex === -1) {
        throw new Error(`Deck ${deckId} not found`);
      }
      
      const deck = decks[deckIndex];
      
      // Check if card is already in deck
      if (deck.cardIds?.includes(cardId)) {
        return true;
      }
      
      const updatedDeck = {
        ...deck,
        cards: [...(deck.cards || []), card],
        cardIds: [...(deck.cardIds || []), cardId],
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedDecks = [...decks];
      updatedDecks[deckIndex] = updatedDeck;
      setDecks(updatedDecks);
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to add card ${cardId} to deck ${deckId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a card from a deck
  const removeCardFromDeck = async (cardId: string, deckId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const deckIndex = decks.findIndex(d => d.id === deckId);
      if (deckIndex === -1) {
        throw new Error(`Deck ${deckId} not found`);
      }
      
      const deck = decks[deckIndex];
      
      const updatedDeck = {
        ...deck,
        cards: deck.cards?.filter(card => card.id !== cardId) || [],
        cardIds: deck.cardIds?.filter(id => id !== cardId) || [],
        updatedAt: new Date().toISOString(),
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedDecks = [...decks];
      updatedDecks[deckIndex] = updatedDeck;
      setDecks(updatedDecks);
      
      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to remove card ${cardId} from deck ${deckId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Select a card
  const selectCard = (card: Card | null) => {
    setSelectedCard(card);
  };
  
  // Select a collection
  const selectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
  };
  
  // Select a deck
  const selectDeck = (deck: Deck | null) => {
    setSelectedDeck(deck);
  };
  
  // Initialize data
  useEffect(() => {
    fetchCards();
    fetchCollections();
    fetchDecks();
  }, []);
  
  const value: CardEnhancedContextType = {
    cards,
    collections,
    decks,
    loading,
    error,
    selectedCard,
    selectedCollection,
    selectedDeck,
    fetchCards,
    fetchCollections,
    fetchDecks,
    getCard,
    getCollection,
    getDeck,
    createCard,
    updateCard,
    deleteCard,
    createCollection,
    updateCollection,
    deleteCollection,
    createDeck,
    updateDeck,
    deleteDeck,
    addCardToCollection,
    removeCardFromCollection,
    addCardToDeck,
    removeCardFromDeck,
    selectCard,
    selectCollection,
    selectDeck,
  };
  
  return (
    <CardEnhancedContext.Provider value={value}>
      {children}
    </CardEnhancedContext.Provider>
  );
};

export const useCardEnhanced = () => {
  const context = useContext(CardEnhancedContext);
  if (context === undefined) {
    throw new Error('useCardEnhanced must be used within a CardEnhancedProvider');
  }
  return context;
};
