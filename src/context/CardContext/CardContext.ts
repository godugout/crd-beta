
import { createContext } from 'react';
import { Card, Collection } from '@/lib/types';

/**
 * Props interface for the Card Context
 * Defines all methods and properties available throughout the application
 */
export interface CardContextProps {
  cards: Card[];
  favorites: Card[];
  collections: Collection[];
  loading: boolean;
  error: Error | null;
  isLoading: boolean;
  fetchCards: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, card: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => void;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined;
  addCollection: (collection: Partial<Collection>) => Promise<Collection>;
  updateCollection: (id: string, collection: Partial<Collection>) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<boolean>;
  addSeries: (series: any) => Promise<any>;
  updateSeries: (id: string, series: any) => Promise<any>;
  refreshCards: () => Promise<void>;
  createCollection: (collection: Partial<Collection>) => Promise<Collection>;
}

/**
 * React Context for card-related operations
 * Provides access to cards, collections, and related functionality
 */
export const CardContext = createContext<CardContextProps | undefined>(undefined);
