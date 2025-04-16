
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '@/lib/types';
import { toast } from 'sonner';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { sampleCards } from '@/lib/sampleCards';
import { 
  createCard, 
  updateCard, 
  deleteCard,
  addCardToCollection,
  removeCardFromCollection
} from '@/lib/card/cardOperations';
import { 
  createCollection,
  updateCollection,
  deleteCollection 
} from '@/lib/card/collectionOperations';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  getCardById: (id: string) => Card | undefined;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Card;
  updateCard: (id: string, updates: Partial<Card>) => boolean;
  deleteCard: (id: string) => boolean;
  createCollection: (collection: Partial<Collection>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  addCardToCollection: (cardId: string, collectionId: string) => boolean;
  removeCardFromCollection: (cardId: string, collectionId: string) => boolean;
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      try {
        setIsLoading(true);
        
        // Load cards from localStorage or use sample data
        const savedCards = localStorage.getItem('cards');
        let initialCards: Card[] = [];
        
        if (savedCards) {
          try {
            const parsedCards = JSON.parse(savedCards);
            initialCards = parsedCards.map((card: any) => adaptToCard(card));
          } catch (e) {
            console.error('Error parsing saved cards:', e);
            // Fallback to sample cards
            initialCards = sampleCards.map(card => adaptToCard(card));
          }
        } else {
          // Use sample cards
          initialCards = sampleCards.map(card => adaptToCard(card));
        }
        
        setCards(initialCards);
        
        // Load collections
        const savedCollections = localStorage.getItem('collections');
        if (savedCollections) {
          setCollections(JSON.parse(savedCollections));
        } else {
          // Demo collections
          const demoCollections = [
            {
              id: 'collection-1',
              name: 'Demo Collection 1',
              description: 'A sample collection',
              coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
              userId: 'user-1',
              teamId: 'team-1',
              visibility: 'public' as const,
              allowComments: true,
              isPublic: true,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              designMetadata: {},
              cardIds: ['card-001']
            },
            {
              id: 'collection-2',
              name: 'Demo Collection 2',
              description: 'Another sample collection',
              coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
              userId: 'user-1',
              teamId: 'team-1',
              visibility: 'public' as const,
              allowComments: true,
              isPublic: true,
              cards: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              designMetadata: {},
              cardIds: ['card-002']
            }
          ];
          
          setCollections(demoCollections);
        }
      } catch (err: any) {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (!isLoading && cards.length > 0) {
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  }, [cards, isLoading]);
  
  useEffect(() => {
    if (!isLoading && collections.length > 0) {
      localStorage.setItem('collections', JSON.stringify(collections));
    }
  }, [collections, isLoading]);

  // Get card by ID
  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Add a new card
  const handleAddCard = (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Card => {
    try {
      const newCard = createCard(card);
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (error: any) {
      setError(error.message || 'Failed to add card');
      throw error;
    }
  };

  // Update an existing card
  const handleUpdateCard = (id: string, updates: Partial<Card>): boolean => {
    try {
      const updatedCards = updateCard(id, updates, cards);
      setCards(updatedCards);
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to update card');
      return false;
    }
  };

  // Delete a card
  const handleDeleteCard = (id: string): boolean => {
    try {
      const filteredCards = deleteCard(id, cards);
      setCards(filteredCards);
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to delete card');
      return false;
    }
  };

  // Create a new collection
  const handleCreateCollection = (collectionData: Partial<Collection>): Collection => {
    try {
      const newCollection = createCollection(collectionData);
      setCollections(prevCollections => [...prevCollections, newCollection]);
      return newCollection;
    } catch (error: any) {
      setError(error.message || 'Failed to create collection');
      throw error;
    }
  };

  // Update an existing collection
  const handleUpdateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    try {
      const updatedCollection = updateCollection(id, updates, collections);
      
      if (updatedCollection) {
        setCollections(prevCollections => 
          prevCollections.map(collection => 
            collection.id === id ? updatedCollection : collection
          )
        );
      }
      
      return updatedCollection;
    } catch (error: any) {
      setError(error.message || 'Failed to update collection');
      return null;
    }
  };

  // Delete a collection
  const handleDeleteCollection = (id: string): boolean => {
    try {
      const success = deleteCollection(id, collections);
      
      if (success) {
        setCollections(prevCollections => 
          prevCollections.filter(collection => collection.id !== id)
        );
      }
      
      return success;
    } catch (error: any) {
      setError(error.message || 'Failed to delete collection');
      return false;
    }
  };

  // Add card to collection
  const handleAddCardToCollection = (cardId: string, collectionId: string): boolean => {
    try {
      const { updatedCards, updatedCollections } = addCardToCollection(
        cardId,
        collectionId,
        cards,
        collections
      );
      
      setCards(updatedCards);
      setCollections(updatedCollections);
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to add card to collection');
      return false;
    }
  };

  // Remove card from collection
  const handleRemoveCardFromCollection = (cardId: string, collectionId: string): boolean => {
    try {
      const { updatedCards, updatedCollections } = removeCardFromCollection(
        cardId,
        collectionId,
        cards,
        collections
      );
      
      setCards(updatedCards);
      setCollections(updatedCollections);
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to remove card from collection');
      return false;
    }
  };

  const value = {
    cards,
    collections,
    isLoading,
    error,
    getCardById,
    addCard: handleAddCard,
    updateCard: handleUpdateCard,
    deleteCard: handleDeleteCard,
    createCollection: handleCreateCollection,
    updateCollection: handleUpdateCollection,
    deleteCollection: handleDeleteCollection,
    addCardToCollection: handleAddCardToCollection,
    removeCardFromCollection: handleRemoveCardFromCollection
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCards = (): CardContextProps => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
