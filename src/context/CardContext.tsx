import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '@/lib/types';
import { toast } from 'sonner';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { v4 as uuidv4 } from 'uuid';

export type { Card, Collection };

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  getCardById: (id: string) => Card | undefined;
  addCard: (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  createCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<boolean>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<boolean>;
  refreshCards?: () => Promise<void>;
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = () => {
      try {
        setIsLoading(true);
        
        const savedCards = localStorage.getItem('cards');
        let initialCards: Card[] = [];
        
        if (savedCards) {
          try {
            const parsedCards = JSON.parse(savedCards);
            initialCards = parsedCards.map((card: any) => adaptToCard(card));
          } catch (e) {
            console.error('Error parsing saved cards:', e);
            initialCards = sampleCards.map(card => adaptToCard(card));
          }
        } else {
          initialCards = sampleCards.map(card => adaptToCard(card));
        }
        
        setCards(initialCards);
        
        const savedCollections = localStorage.getItem('collections');
        if (savedCollections) {
          setCollections(JSON.parse(savedCollections));
        } else {
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

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const handleAddCard = async (cardData: Omit<Card, "id" | "createdAt" | "updatedAt">): Promise<Card> => {
    try {
      const newCard: Card = {
        ...cardData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCards(prevCards => [...prevCards, newCard]);
      return Promise.resolve(newCard);
    } catch (error: any) {
      setError(error.message || 'Failed to add card');
      return Promise.reject(error);
    }
  };

  const handleUpdateCard = async (id: string, updates: Partial<Card>): Promise<boolean> => {
    try {
      const updatedCards = cards.map(card => 
        card.id === id ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
      );
      
      setCards(updatedCards);
      return Promise.resolve(true);
    } catch (error: any) {
      setError(error.message || 'Failed to update card');
      return Promise.resolve(false);
    }
  };

  const handleDeleteCard = async (id: string): Promise<boolean> => {
    try {
      const filteredCards = cards.filter(card => card.id !== id);
      setCards(filteredCards);
      return Promise.resolve(true);
    } catch (error: any) {
      setError(error.message || 'Failed to delete card');
      return Promise.resolve(false);
    }
  };

  const handleCreateCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    try {
      const newCollection: Collection = {
        id: uuidv4(),
        name: collectionData.name || 'Untitled Collection',
        description: collectionData.description || '',
        coverImageUrl: collectionData.coverImageUrl || '',
        userId: collectionData.userId || 'anonymous',
        cards: [],
        cardIds: collectionData.cardIds || [],
        visibility: collectionData.visibility || 'public',
        allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
        isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        designMetadata: collectionData.designMetadata || {},
        tags: collectionData.tags || [],
        instagramSource: collectionData.instagramSource
      };
      
      setCollections(prevCollections => [...prevCollections, newCollection]);
      return Promise.resolve(newCollection);
    } catch (error: any) {
      setError(error.message || 'Failed to create collection');
      return Promise.reject(error);
    }
  };

  const handleUpdateCollection = async (id: string, updates: Partial<Collection>): Promise<Collection> => {
    try {
      let updatedCollection: Collection | null = null;
      
      const updatedCollections = collections.map(collection => {
        if (collection.id === id) {
          updatedCollection = {
            ...collection,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedCollection;
        }
        return collection;
      });
      
      if (updatedCollection) {
        setCollections(updatedCollections);
        return Promise.resolve(updatedCollection);
      }
      
      return Promise.reject(new Error('Collection not found'));
    } catch (error: any) {
      setError(error.message || 'Failed to update collection');
      return Promise.reject(error);
    }
  };

  const handleDeleteCollection = async (id: string): Promise<boolean> => {
    try {
      const filteredCollections = collections.filter(collection => collection.id !== id);
      
      if (filteredCollections.length < collections.length) {
        setCollections(filteredCollections);
        return Promise.resolve(true);
      }
      
      return Promise.resolve(false);
    } catch (error: any) {
      setError(error.message || 'Failed to delete collection');
      return Promise.resolve(false);
    }
  };

  const handleAddCardToCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    try {
      const card = cards.find(c => c.id === cardId);
      const collection = collections.find(c => c.id === collectionId);
      
      if (!card || !collection) {
        return Promise.resolve(false);
      }
      
      const updatedCollection = {
        ...collection,
        cardIds: [...(collection.cardIds || []), cardId]
      };
      
      const updatedCollections = collections.map(c => 
        c.id === collectionId ? updatedCollection : c
      );
      
      setCollections(updatedCollections);
      
      return Promise.resolve(true);
    } catch (error: any) {
      setError(error.message || 'Failed to add card to collection');
      return Promise.resolve(false);
    }
  };

  const handleRemoveCardFromCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
    try {
      const collection = collections.find(c => c.id === collectionId);
      
      if (!collection || !collection.cardIds) {
        return Promise.resolve(false);
      }
      
      const updatedCollection = {
        ...collection,
        cardIds: collection.cardIds.filter(id => id !== cardId)
      };
      
      const updatedCollections = collections.map(c => 
        c.id === collectionId ? updatedCollection : c
      );
      
      setCollections(updatedCollections);
      
      return Promise.resolve(true);
    } catch (error: any) {
      setError(error.message || 'Failed to remove card from collection');
      return Promise.resolve(false);
    }
  };

  const refreshCards = async (): Promise<void> => {
    try {
      console.log('Refreshing cards...');
      return Promise.resolve();
    } catch (error: any) {
      setError(error.message || 'Failed to refresh cards');
      return Promise.reject(error);
    }
  };

  const value: CardContextProps = {
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
    removeCardFromCollection: handleRemoveCardFromCollection,
    refreshCards
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
