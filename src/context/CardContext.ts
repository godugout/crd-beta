
import React, { createContext, useContext } from 'react';
import { Card, Collection } from '@/lib/types';

interface CardContextProps {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: Error | null;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (card: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  addCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (collection: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  getCollectionById: (id: string) => Collection | undefined;
  addCardToCollection: (params: { collectionId: string, cardId: string }) => Promise<void>;
  removeCardFromCollection: (params: { collectionId: string, cardId: string }) => Promise<void>;
  getCard: (id: string) => Card | undefined;
  refreshCards: () => Promise<void>;
}

// Create the context with default values
const CardContext = createContext<CardContextProps>({
  cards: [],
  collections: [], 
  isLoading: false,
  error: null,
  addCard: async () => ({ 
    id: '', 
    title: '', 
    description: '',
    imageUrl: '', 
    thumbnailUrl: '',
    tags: [],
    userId: '',
    effects: [],
    createdAt: '', 
    updatedAt: '',
    designMetadata: {
      cardStyle: {
        template: 'basic',
        effect: 'none',
        borderRadius: '16px',
        borderColor: '#000000',
        frameColor: '#FFFFFF',
        frameWidth: 10,
        shadowColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      },
      cardMetadata: {
        category: 'standard',
        cardType: 'custom',
        series: 'none'
      }
    }
  }),
  updateCard: async () => ({ 
    id: '', 
    title: '', 
    description: '',
    imageUrl: '', 
    thumbnailUrl: '',
    tags: [],
    userId: '',
    effects: [],
    createdAt: '', 
    updatedAt: '',
    designMetadata: {
      cardStyle: {
        template: 'basic',
        effect: 'none',
        borderRadius: '16px',
        borderColor: '#000000',
        frameColor: '#FFFFFF',
        frameWidth: 10,
        shadowColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      },
      cardMetadata: {
        category: 'standard',
        cardType: 'custom',
        series: 'none'
      }
    }
  }),
  deleteCard: async () => false,
  addCollection: async () => ({ id: '', title: '', createdAt: '', updatedAt: '', userId: '' }),
  updateCollection: async () => ({ id: '', title: '', createdAt: '', updatedAt: '', userId: '' }),
  deleteCollection: async () => false,
  getCardById: () => undefined,
  getCollectionById: () => undefined,
  addCardToCollection: async () => {},
  removeCardFromCollection: async () => {},
  getCard: () => undefined,
  refreshCards: async () => {},
});

export { CardContext };
export type { CardContextProps };

export const useCards = () => useContext(CardContext);

// Explicitly export Card and Collection types
export type { Card, Collection };
