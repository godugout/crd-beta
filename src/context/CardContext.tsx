
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { sampleCards } from '@/data/sampleCards';
import { Card as LibCard, Collection as LibCollection } from '@/lib/types';

export type Card = LibCard;
export type Collection = LibCollection;

type CardContextType = {
  cards: Card[];
  collections: Collection[];
  isLoading?: boolean;
  error?: Error | null;
  addCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Card | null;
  getCard: (id: string) => Card | undefined;
  getCardById: (id: string) => Card | undefined;
  deleteCard: (id: string) => boolean;
  addCollection: (collectionData: Partial<Collection>) => Collection;
  updateCollection: (id: string, collectionData: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  addCardToCollection: (cardId: string, collectionId: string) => boolean;
  removeCardFromCollection: (cardId: string, collectionId: string) => boolean;
  refreshCards?: () => Promise<void>;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

// Add effects property to all sample cards
const enhancedSampleCards: Card[] = sampleCards.map(card => ({
  ...card,
  effects: card.effects || []
}));

const sampleCollections: Collection[] = [
  {
    id: 'collection-001',
    name: 'Pop Art Cards',
    description: 'A collection of pop art style cards',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    cardIds: ['card-001', 'card-005'],
    visibility: 'public',
    allowComments: true
  },
  {
    id: 'collection-002',
    name: 'Sports Legends',
    description: 'Collection of legendary sports figures',
    coverImageUrl: '/lovable-uploads/fa55173e-d864-41b2-865d-144d94507dc1.png',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    cardIds: ['card-002', 'card-003', 'card-004', 'card-006'],
    visibility: 'private',
    allowComments: true
  }
];

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(enhancedSampleCards);
  const [collections, setCollections] = useState<Collection[]>(sampleCollections);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCard = useCallback(async (cardData: Partial<Card>) => {
    try {
      const cardId = cardData.id || uuidv4();
      const newCard: Card = {
        id: cardId,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || cardData.image || '',
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || cardData.image || '',
        tags: cardData.tags || [],
        userId: cardData.userId || 'anonymous',
        creatorId: cardData.userId || 'anonymous',
        designMetadata: cardData.designMetadata || {
          cardStyle: {},
          textStyle: {},
          marketMetadata: {},
          cardMetadata: {}
        },
        fabricSwatches: cardData.fabricSwatches || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: cardData.collectionId,
        effects: cardData.effects || [] // Add default empty effects array
      };

      setCards(prevCards => [newCard, ...prevCards]);
      
      if (newCard.collectionId) {
        addCardToCollection(newCard.id, newCard.collectionId);
      }
      
      return newCard;
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
      throw error;
    }
  }, []);

  const updateCard = (id: string, updates: Partial<Card>): Card | null => {
    let updatedCard: Card | null = null;

    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === id) {
          updatedCard = { 
            ...card, 
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedCard;
        }
        return card;
      });
    });

    return updatedCard;
  };

  const getCard = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const deleteCard = (id: string): boolean => {
    const cardExists = cards.some(card => card.id === id);
    
    if (cardExists) {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      
      setCollections(prevCollections => {
        return prevCollections.map(collection => ({
          ...collection,
          cardIds: collection.cardIds.filter(cardId => cardId !== id)
        }));
      });
      
      return true;
    }
    
    return false;
  };

  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      name: collectionData.name || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: collectionData.userId || 'anonymous',
      cardIds: collectionData.cardIds || [],
      visibility: collectionData.visibility || 'private',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      teamId: collectionData.teamId,
      designMetadata: collectionData.designMetadata
    };

    setCollections(prev => [newCollection, ...prev]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    let updatedCollection: Collection | null = null;

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
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
    });

    return updatedCollection;
  };

  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => 
        prevCollections.filter(collection => collection.id !== id)
      );
      return true;
    }
    
    return false;
  };

  const addCardToCollection = (cardId: string, collectionId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    if (collection.cardIds.includes(cardId)) return true; // Card already in collection
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            cardIds: [...c.cardIds, cardId],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });
    });
    
    return true;
  };

  const removeCardFromCollection = (cardId: string, collectionId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    if (!collection.cardIds.includes(cardId)) return true; // Card not in collection
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            cardIds: c.cardIds.filter(id => id !== cardId),
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });
    });
    
    return true;
  };

  const refreshCards = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      // Ensure sample cards have effects property
      const cardsWithEffects = sampleCards.map(card => ({
        ...card, 
        effects: card.effects || []
      }));
      setCards(cardsWithEffects);
      setCollections(sampleCollections);
    } catch (error) {
      console.error("Error refreshing cards:", error);
      toast.error("Failed to refresh cards");
      setError(error instanceof Error ? error : new Error("Failed to refresh cards"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContext.Provider value={{ 
      cards, 
      addCard, 
      updateCard, 
      getCard, 
      getCardById,
      deleteCard,
      collections,
      addCollection,
      updateCollection,
      deleteCollection,
      addCardToCollection,
      removeCardFromCollection,
      isLoading,
      error,
      refreshCards
    }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};

export const useCardContext = () => useContext(CardContext);
