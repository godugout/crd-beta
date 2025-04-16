import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, Collection } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { sampleCards } from '@/lib/sampleCards';

export type { Card, Collection }; // Export these types for use in other components

interface CardContextType {
  cards: Card[];
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  getCardById: (id: string) => Card | undefined;
  getCardsByUserId: (userId: string) => Card[];
  isLoading: boolean;
  error: string | null;
  refreshCards?: () => Promise<void>;
  
  // Collection related properties
  collections?: Collection[];
  addCollection?: (collection: Partial<Collection>) => Collection;
  updateCollection?: (id: string, updates: Partial<Collection>) => Collection | null;
  deleteCollection?: (id: string) => boolean;
  addCardToCollection?: (collectionId: string, card: Card) => boolean;
  removeCardFromCollection?: (collectionId: string, cardId: string) => boolean;
  getCard?: (id: string) => Card | undefined; // Alias for getCardById for backward compatibility
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to get auth info, but provide default if auth provider is not available
  let auth;
  try {
    auth = useAuth();
  } catch (e) {
    console.warn("Auth provider not available, using default user");
    auth = { user: { id: 'anonymous' } };
  }
  
  const { user } = auth;
  
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setCards(sampleCards);
          setIsLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.message || 'Failed to load cards');
        setIsLoading(false);
      }
    };
    
    loadCards();
  }, []);

  const refreshCards = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      setTimeout(() => {
        setCards(sampleCards);
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh cards');
      setIsLoading(false);
    }
  };
  
  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    const newCard: Card = {
      ...cardData as Card,
      id: cardData.id || uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      effects: cardData.effects || [],
      creatorId: user?.id
    };
    
    setCards(prevCards => [newCard, ...prevCards]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
    setCards(prevCards =>
      prevCards.map(card => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const deleteCard = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const getCardsByUserId = (userId: string): Card[] => {
    return cards.filter(card => card.userId === userId);
  };

  // Collection operations
  const addCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      name: collectionData.name || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      userId: user?.id || 'anonymous',
      cards: collectionData.cards || [],
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
      cardIds: collectionData.cardIds || [],
      visibility: collectionData.visibility || 'public',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      teamId: collectionData.teamId,
      designMetadata: collectionData.designMetadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    let updatedCollection: Collection | null = null;
    
    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === id) {
          updatedCollection = { ...collection, ...updates };
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
        prevCollections.filter(collection => collection.id !== id));
      return true;
    }
    
    return false;
  };

  const addCardToCollection = (collectionId: string, card: Card): boolean => {
    const collectionExists = collections.some(collection => collection.id === collectionId);
    
    if (!collectionExists) {
      return false;
    }
    
    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId) {
          const cards = collection.cards || [];
          // Check if card already exists to avoid duplicates
          if (!cards.some(c => c.id === card.id)) {
            return {
              ...collection,
              cards: [...cards, card],
              cardIds: [...(collection.cardIds || []), card.id]
            };
          }
        }
        return collection;
      });
    });
    
    return true;
  };

  const removeCardFromCollection = (collectionId: string, cardId: string): boolean => {
    const collection = collections.find(collection => collection.id === collectionId);
    
    if (!collection || !collection.cards) {
      return false;
    }
    
    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId && collection.cards) {
          return {
            ...collection,
            cards: collection.cards.filter(card => card.id !== cardId),
            cardIds: (collection.cardIds || []).filter(id => id !== cardId)
          };
        }
        return collection;
      });
    });
    
    return true;
  };

  const value: CardContextType = {
    cards,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
    getCardsByUserId,
    isLoading,
    error,
    refreshCards,
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    getCard: getCardById // Alias for backward compatibility
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
