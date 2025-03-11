
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card, Collection } from '../lib/types';
import { toast } from 'sonner';
import { cardOperations, collectionOperations } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type CardContextType = {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card | undefined>;
  updateCard: (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  addCollection: (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => Promise<Collection | undefined>;
  updateCollection: (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addCardToCollection: (cardId: string, collectionId: string) => Promise<void>;
  removeCardFromCollection: (cardId: string, collectionId: string) => Promise<void>;
  refreshCards: () => Promise<void>;
  refreshCollections: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load data from Supabase on initial render and when user changes
  useEffect(() => {
    if (user) {
      refreshCards();
      refreshCollections();
    } else {
      // Clear data when user logs out
      setCards([]);
      setCollections([]);
    }
  }, [user]);

  // Fetch cards from Supabase
  const refreshCards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.getCards();
      
      if (error) {
        setError(error.message);
        toast.error('Failed to load cards: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(data);
      }
    } catch (err: any) {
      console.error('Fetch cards error:', err);
      setError(err.message || 'Failed to load cards');
      toast.error('An unexpected error occurred loading cards');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch collections from Supabase
  const refreshCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.getCollections();
      
      if (error) {
        setError(error.message);
        toast.error('Failed to load collections: ' + error.message);
        return;
      }
      
      if (data) {
        setCollections(data);
      }
    } catch (err: any) {
      console.error('Fetch collections error:', err);
      setError(err.message || 'Failed to load collections');
      toast.error('An unexpected error occurred loading collections');
    } finally {
      setIsLoading(false);
    }
  };

  // Card operations
  const addCard = async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.createCard(card);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to create card: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(prev => [...prev, data]);
        toast.success('Card created successfully');
        return data;
      }
    } catch (err: any) {
      console.error('Create card error:', err);
      setError(err.message || 'Failed to create card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.updateCard(id, updates);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to update card: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(prev => 
          prev.map(card => 
            card.id === id ? data : card
          )
        );
        
        // Also update card in collections
        setCollections(prev => 
          prev.map(collection => ({
            ...collection,
            cards: collection.cards.map(card => 
              card.id === id ? data : card
            )
          }))
        );
        
        toast.success('Card updated successfully');
      }
    } catch (err: any) {
      console.error('Update card error:', err);
      setError(err.message || 'Failed to update card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await cardOperations.deleteCard(id);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to delete card: ' + error.message);
        return;
      }
      
      setCards(prev => prev.filter(card => card.id !== id));
      
      // Also remove card from all collections
      setCollections(prev => 
        prev.map(collection => ({
          ...collection,
          cards: collection.cards.filter(card => card.id !== id)
        }))
      );
      
      toast.success('Card deleted successfully');
    } catch (err: any) {
      console.error('Delete card error:', err);
      setError(err.message || 'Failed to delete card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Collection operations
  const addCollection = async (collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.createCollection(collection);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to create collection: ' + error.message);
        return;
      }
      
      if (data) {
        setCollections(prev => [...prev, data]);
        toast.success('Collection created successfully');
        return data;
      }
    } catch (err: any) {
      console.error('Create collection error:', err);
      setError(err.message || 'Failed to create collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async (id: string, updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await collectionOperations.updateCollection(id, updates);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to update collection: ' + error.message);
        return;
      }
      
      if (data) {
        // Preserve the cards array from the existing collection
        const existingCollection = collections.find(c => c.id === id);
        const updatedCollection = {
          ...data,
          cards: existingCollection ? existingCollection.cards : []
        };
        
        setCollections(prev => 
          prev.map(collection => 
            collection.id === id ? updatedCollection : collection
          )
        );
        
        toast.success('Collection updated successfully');
      }
    } catch (err: any) {
      console.error('Update collection error:', err);
      setError(err.message || 'Failed to update collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.deleteCollection(id);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to delete collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId if it belongs to the deleted collection
      setCards(prev => 
        prev.map(card => 
          card.collectionId === id 
            ? { ...card, collectionId: undefined }
            : card
        )
      );
      
      setCollections(prev => prev.filter(collection => collection.id !== id));
      toast.success('Collection deleted successfully');
    } catch (err: any) {
      console.error('Delete collection error:', err);
      setError(err.message || 'Failed to delete collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Card-Collection operations
  const addCardToCollection = async (cardId: string, collectionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.addCardToCollection(cardId, collectionId);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to add card to collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, collectionId }
            : card
        )
      );
      
      // Add card to collection
      const card = cards.find(c => c.id === cardId);
      if (card) {
        setCollections(prev => 
          prev.map(collection => 
            collection.id === collectionId 
              ? { 
                  ...collection, 
                  cards: [...collection.cards.filter(c => c.id !== cardId), {...card, collectionId}]
                } 
              : collection
          )
        );
      }
      
      toast.success('Card added to collection');
    } catch (err: any) {
      console.error('Add card to collection error:', err);
      setError(err.message || 'Failed to add card to collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const removeCardFromCollection = async (cardId: string, collectionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await collectionOperations.removeCardFromCollection(cardId);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to remove card from collection: ' + error.message);
        return;
      }
      
      // Update card's collectionId
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, collectionId: undefined }
            : card
        )
      );
      
      // Remove card from collection
      setCollections(prev => 
        prev.map(collection => 
          collection.id === collectionId 
            ? { 
                ...collection, 
                cards: collection.cards.filter(card => card.id !== cardId)
              } 
            : collection
        )
      );
      
      toast.success('Card removed from collection');
    } catch (err: any) {
      console.error('Remove card from collection error:', err);
      setError(err.message || 'Failed to remove card from collection');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cards,
    collections,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    refreshCards,
    refreshCollections
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};
