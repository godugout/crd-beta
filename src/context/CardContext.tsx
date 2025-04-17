
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Card, Collection, DesignMetadata } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { v4 as uuidv4 } from 'uuid';
import { adaptToCard } from '@/lib/adapters/cardAdapter';

export interface CardContextType {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  getCard: (id: string) => Card | undefined;
  getCardById: (id: string) => Card | undefined; 
  addCard: (card: Partial<Card>) => Promise<Card>; 
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  addCollection: (collection: Partial<Collection>) => Promise<Collection>; 
  updateCollection: (id: string, collectionData: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<Collection>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<Collection>;
  refreshCards: () => Promise<void>; // This should be included in the interface
}

const CardContext = createContext<CardContextType>({
  cards: [],
  collections: [],
  isLoading: false,
  getCard: () => undefined,
  getCardById: () => undefined, // Added this method
  addCard: async () => ({} as Card),
  updateCard: async () => ({} as Card),
  deleteCard: async () => false,
  addCollection: async () => ({} as Collection),
  updateCollection: async () => ({} as Collection),
  deleteCollection: async () => false,
  addCardToCollection: async () => ({} as Collection),
  removeCardFromCollection: async () => ({} as Collection),
  refreshCards: async () => {},
});

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cards and collections from local storage on mount
  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards).map((card: Card) => adaptToCard(card)));
    }

    const storedCollections = localStorage.getItem('collections');
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    }
  }, []);

  // Save cards and collections to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('collections', JSON.stringify(collections));
  }, [collections]);

  const getCard = useCallback((id: string) => {
    return cards.find(card => card.id === id);
  }, [cards]);
  
  // Add alias for getCardById to match getCard
  const getCardById = useCallback((id: string) => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const addCard = useCallback(async (cardData: Partial<Card>) => {
    setIsLoading(true);
    return new Promise<Card>((resolve) => {
      setTimeout(() => {
        // Create a complete card from partial data
        const now = new Date().toISOString();
        const newCard: Card = {
          id: uuidv4(),
          title: cardData.title || 'Untitled Card',
          description: cardData.description || '',
          imageUrl: cardData.imageUrl || '',
          thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
          userId: cardData.userId || 'default-user',
          tags: cardData.tags || [],
          effects: cardData.effects || [],
          createdAt: now,
          updatedAt: now,
          designMetadata: cardData.designMetadata || DEFAULT_DESIGN_METADATA,
          ...cardData
        };
        
        setCards(prevCards => [...prevCards, newCard]);
        setIsLoading(false);
        resolve(newCard);
      }, 300);
    });
  }, []);

  const updateCard = useCallback(async (id: string, cardData: Partial<Card>) => {
    setIsLoading(true);
    return new Promise<Card>((resolve) => {
      setTimeout(() => {
        let updatedCard: Card = {} as Card;
        
        setCards(prevCards =>
          prevCards.map(card => {
            if (card.id === id) {
              updatedCard = { 
                ...card, 
                ...cardData, 
                updatedAt: new Date().toISOString() 
              };
              return updatedCard;
            }
            return card;
          })
        );
        
        setIsLoading(false);
        resolve(updatedCard);
      }, 300);
    });
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    setIsLoading(true);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
        setIsLoading(false);
        resolve(true);
      }, 300);
    });
  }, []);

  const addCollection = useCallback(async (collection: Partial<Collection>) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const newCollection: Collection = {
          id: uuidv4(),
          name: collection.name || 'Untitled Collection',
          description: collection.description || '',
          userId: collection.userId || 'default-user',
          cards: collection.cards || [],
          coverImageUrl: collection.coverImageUrl || '',
          isPublic: collection.isPublic !== undefined ? collection.isPublic : true,
          cardIds: collection.cardIds || [],
          createdAt: now,
          updatedAt: now,
          visibility: collection.visibility || 'public',
          allowComments: collection.allowComments !== undefined ? collection.allowComments : true,
          designMetadata: collection.designMetadata || {},
          ...collection
        };
        
        setCollections(prevCollections => [...prevCollections, newCollection]);
        setIsLoading(false);
        resolve(newCollection);
      }, 300);
    });
  }, []);

  const updateCollection = useCallback(async (id: string, collectionData: Partial<Collection>) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        let updatedCollection: Collection = {} as Collection;
        
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === id) {
              updatedCollection = { 
                ...collection, 
                ...collectionData, 
                updatedAt: new Date().toISOString() 
              };
              return updatedCollection;
            }
            return collection;
          })
        );
        
        setIsLoading(false);
        resolve(updatedCollection);
      }, 300);
    });
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    setIsLoading(true);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
        setIsLoading(false);
        resolve(true);
      }, 300);
    });
  }, []);

  const addCardToCollection = useCallback(async (cardId: string, collectionId: string) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        let updatedCollection: Collection = {} as Collection;
        
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === collectionId) {
              const cardExists = collection.cardIds ? collection.cardIds.includes(cardId) : false;
              
              if (!cardExists) {
                updatedCollection = {
                  ...collection,
                  cardIds: collection.cardIds ? [...collection.cardIds, cardId] : [cardId],
                  updatedAt: new Date().toISOString()
                };
                return updatedCollection;
              }
              updatedCollection = collection;
            }
            return collection;
          })
        );
        
        setIsLoading(false);
        resolve(updatedCollection);
      }, 300);
    });
  }, []);

  const removeCardFromCollection = useCallback(async (cardId: string, collectionId: string) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        let updatedCollection: Collection = {} as Collection;
        
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === collectionId) {
              updatedCollection = {
                ...collection,
                cardIds: collection.cardIds ? collection.cardIds.filter(id => id !== cardId) : [],
                updatedAt: new Date().toISOString()
              };
              return updatedCollection;
            }
            return collection;
          })
        );
        
        setIsLoading(false);
        resolve(updatedCollection);
      }, 300);
    });
  }, []);

  const refreshCards = useCallback(async () => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 300);
    });
  }, []);

  const value: CardContextType = {
    cards,
    collections,
    isLoading,
    getCard,
    getCardById, // Added this method
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    refreshCards,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => useContext(CardContext);
export const useCardContext = () => useContext(CardContext);

// Use 'export type' for types to fix the isolatedModules issue
export type { Card, Collection };
