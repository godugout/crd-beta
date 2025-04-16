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
  addCard: (card: Card) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  addCollection: (collection: Collection) => Promise<Collection>;
  updateCollection: (id: string, collectionData: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<Collection>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<Collection>;
  refreshCards: () => Promise<void>;
}

const CardContext = createContext<CardContextType>({
  cards: [],
  collections: [],
  isLoading: false,
  getCard: () => undefined,
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

  const addCard = useCallback(async (card: Card) => {
    setIsLoading(true);
    return new Promise<Card>((resolve) => {
      setTimeout(() => {
        const newCard = { ...card, id: uuidv4() };
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
        setCards(prevCards =>
          prevCards.map(card => {
            if (card.id === id) {
              const updatedCard = { ...card, ...cardData };
              return updatedCard;
            }
            return card;
          })
        );
        const updatedCard = cards.find(card => card.id === id);
        setIsLoading(false);
        resolve(updatedCard as Card);
      }, 300);
    });
  }, [cards]);

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

  const addCollection = useCallback(async (collection: Collection) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        const newCollection = { ...collection, id: uuidv4() };
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
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === id) {
              return { ...collection, ...collectionData };
            }
            return collection;
          })
        );
        const updatedCollection = collections.find(collection => collection.id === id);
        setIsLoading(false);
        resolve(updatedCollection as Collection);
      }, 300);
    });
  }, [collections]);

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
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === collectionId) {
              const updatedCollection: Collection = {
                ...collection,
                cardIds: collection.cardIds ? [...collection.cardIds, cardId] : [cardId],
              };
              return updatedCollection;
            }
            return collection;
          })
        );
        const updatedCollection = collections.find(collection => collection.id === collectionId);
        setIsLoading(false);
        resolve(updatedCollection as Collection);
      }, 300);
    });
  }, [collections]);

  const removeCardFromCollection = useCallback(async (cardId: string, collectionId: string) => {
    setIsLoading(true);
    return new Promise<Collection>((resolve) => {
      setTimeout(() => {
        setCollections(prevCollections =>
          prevCollections.map(collection => {
            if (collection.id === collectionId) {
              const updatedCollection: Collection = {
                ...collection,
                cardIds: collection.cardIds ? collection.cardIds.filter(id => id !== cardId) : [],
              };
              return updatedCollection;
            }
            return collection;
          })
        );
        const updatedCollection = collections.find(collection => collection.id === collectionId);
        setIsLoading(false);
        resolve(updatedCollection as Collection);
      }, 300);
    });
  }, [collections]);

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

export { Card, Collection };
