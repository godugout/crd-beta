
import React, { useState, useEffect, ReactNode } from 'react';
import { Card, CardRarity, Collection } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { cardIdToCard } from '@/lib/utils/cardHelpers';
import { CardContext, CardContextProps } from './CardContext';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { toStandardCard } from '@/lib/utils/cardConverters';
import { stringToCardRarity } from '@/lib/utils/CardRarityUtils';

/**
 * Provider component for CardContext
 * Manages state and provides card-related functionality to child components
 */
export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Process sample cards to ensure they all have the required properties
  // and use the correct CardRarity enum
  const processedSampleCards = sampleCards.map(card => {
    // Convert string rarity to CardRarity enum
    const rarityValue = typeof card.rarity === 'string' 
      ? stringToCardRarity(card.rarity as string)
      : card.rarity || CardRarity.COMMON;
      
    return toStandardCard({
      ...card,
      isFavorite: card.isFavorite ?? false,
      description: card.description || '',
      rarity: rarityValue
    });
  });
  
  const [cards, setCards] = useState<Card[]>(processedSampleCards);
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      setCards(processedSampleCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cards'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      setCollections([]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const newCard: Card = adaptToCard({
        id: `card-${Date.now()}`,
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || '',
        tags: cardData.tags || [],
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rarity: cardData.rarity || CardRarity.COMMON,
        effects: [],
        isFavorite: cardData.isFavorite ?? false,
        ...cardData
      });
      
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
    setLoading(true);
    try {
      const cardIndex = cards.findIndex(card => card.id === id);
      if (cardIndex === -1) {
        throw new Error(`Card with ID ${id} not found`);
      }
      
      const updatedCard = {
        ...cards[cardIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const newCards = [...cards];
      newCards[cardIndex] = updatedCard;
      
      setCards(newCards);
      return updatedCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      setFavorites(prevFavorites => prevFavorites.filter(card => card.id !== id));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete card');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    
    const isFavorite = favorites.some(f => f.id === id);
    if (isFavorite) {
      setFavorites(prevFavorites => prevFavorites.filter(f => f.id !== id));
    } else {
      setFavorites(prevFavorites => [...prevFavorites, card]);
    }
  };

  const getCardById = (id: string) => {
    return cards.find(card => card.id === id) || cardIdToCard(id);
  };

  const addCollection = async (collectionData: Partial<Collection>): Promise<Collection> => {
    setLoading(true);
    try {
      const newCollection = {
        id: `collection-${Date.now()}`,
        title: collectionData.title || 'Untitled Collection',
        description: collectionData.description || '',
        name: collectionData.name || collectionData.title || 'Untitled Collection',
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...collectionData
      } as Collection;
      
      setCollections(prev => [...prev, newCollection]);
      return newCollection;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add collection');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>): Promise<Collection> => {
    setLoading(true);
    try {
      const collectionIndex = collections.findIndex(c => c.id === id);
      if (collectionIndex === -1) {
        throw new Error(`Collection with ID ${id} not found`);
      }
      
      const updatedCollection = {
        ...collections[collectionIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      } as Collection;
      
      const newCollections = [...collections];
      newCollections[collectionIndex] = updatedCollection;
      
      setCollections(newCollections);
      return updatedCollection;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update collection');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCollection = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      setCollections(prevCollections => prevCollections.filter(c => c.id !== id));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete collection');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSeries = async (series: any) => {
    return {};
  };

  const updateSeries = async (id: string, series: any) => {
    return {};
  };

  const refreshCards = async () => {
    return fetchCards();
  };

  const createCollection = addCollection;

  const value: CardContextProps = {
    cards,
    favorites,
    collections,
    loading,
    isLoading,
    error,
    fetchCards,
    fetchCollections,
    addCard,
    updateCard,
    deleteCard,
    toggleFavorite,
    getCardById,
    getCard: getCardById,
    addCollection,
    updateCollection,
    deleteCollection,
    addSeries,
    updateSeries,
    refreshCards,
    createCollection
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};
