
import React, { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardRarity } from '@/lib/types';
import { EnhancedCard, Series } from '@/lib/types/enhancedCardTypes';
import { sampleCards } from '@/data/sampleCards';
import { toast } from 'sonner';

// Define the context interface
export interface EnhancedCardContextProps {
  cards: EnhancedCard[];
  series: Series[];
  selectedCardId: string | null;
  selectedSeriesId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Card operations
  fetchCards: () => Promise<void>;
  getCardById: (id: string) => EnhancedCard | undefined;
  addCard: (card: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  updateCard: (id: string, updates: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  deleteCard: (id: string) => Promise<boolean>;
  setSelectedCardId: (id: string | null) => void;
  
  // Series operations
  fetchSeries: () => Promise<void>;
  getSeriesById: (id: string) => Series | undefined;
  addSeries: (series: Series) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<Series>;
  deleteSeries: (id: string) => Promise<boolean>;
  setSelectedSeriesId: (id: string | null) => void;
  addCardToSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  removeCardFromSeries: (cardId: string, seriesId: string) => Promise<boolean>;
  getCardsInSeries: (seriesId: string) => EnhancedCard[];
}

// Create the context with a default value
const EnhancedCardContext = createContext<EnhancedCardContextProps | null>(null);

// Sample series data for initial state
const sampleSeries: Series[] = [
  {
    id: '1',
    title: 'Oakland Collection',
    description: 'A collection of Oakland-themed cards',
    coverImageUrl: 'https://placehold.co/600x400/png',
    artistId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date().toISOString(),
    totalCards: 5,
    isPublished: true,
    cardIds: ['card1', 'card2', 'card3'],
    releaseType: 'standard'
  },
  {
    id: '2',
    title: 'Limited Edition',
    description: 'Rare and exclusive cards',
    coverImageUrl: 'https://placehold.co/600x400/png',
    artistId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    releaseDate: new Date().toISOString(),
    totalCards: 3,
    isPublished: true,
    cardIds: ['card4', 'card5'],
    releaseType: 'limited'
  }
];

// Convert a regular Card to an EnhancedCard
const enhanceCard = (card: Card): EnhancedCard => {
  return {
    ...card,
    cardNumber: card.cardNumber || `${Math.floor(Math.random() * 1000)}`,
    seriesId: card.collectionId,
    artistId: card.userId,
    artistName: 'Unknown Artist',
    edition: 1,
    editionSize: 100,
    releaseDate: card.createdAt,
    qrCodeData: `card-${card.id}`,
    marketData: {
      price: 0,
      currency: 'USD',
      availableForSale: false
    }
  };
};

// Provider component
export const EnhancedCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for cards and series
  const [cards, setCards] = useState<EnhancedCard[]>(() => sampleCards.map(enhanceCard));
  const [series, setSeries] = useState<Series[]>(sampleSeries);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Card operations
  const fetchCards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      // No need to update state in this mock implementation
    } catch (err) {
      setError('Failed to fetch cards');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCardById = (id: string) => {
    return cards.find(card => card.id === id);
  };
  
  const addCard = async (cardData: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const timestamp = new Date().toISOString();
    
    const newCard: EnhancedCard = {
      id: uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      tags: cardData.tags || [],
      userId: cardData.userId || 'anonymous',
      createdAt: timestamp,
      updatedAt: timestamp,
      rarity: cardData.rarity || CardRarity.COMMON,
      effects: cardData.effects || [],
      designMetadata: cardData.designMetadata || {},
      
      // Enhanced fields
      cardNumber: cardData.cardNumber || `${Math.floor(Math.random() * 1000)}`,
      seriesId: cardData.seriesId,
      artistId: cardData.artistId || cardData.userId || 'anonymous',
      artistName: cardData.artistName || 'Unknown Artist',
      edition: cardData.edition || 1,
      editionSize: cardData.editionSize || 100,
      releaseDate: cardData.releaseDate || timestamp,
      qrCodeData: cardData.qrCodeData || `card-${uuidv4()}`,
      marketData: cardData.marketData || {
        price: 0,
        currency: 'USD',
        availableForSale: false
      }
    };
    
    setCards(prev => [...prev, newCard]);
    toast.success('Card added successfully!');
    return newCard;
  };
  
  const updateCard = async (id: string, updates: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      throw new Error('Card not found');
    }
    
    const updatedCard: EnhancedCard = {
      ...cards[cardIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const updatedCards = [...cards];
    updatedCards[cardIndex] = updatedCard;
    setCards(updatedCards);
    
    toast.success('Card updated successfully!');
    return updatedCard;
  };
  
  const deleteCard = async (id: string): Promise<boolean> => {
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      return false;
    }
    
    setCards(prev => prev.filter(card => card.id !== id));
    
    // Also remove from any series
    setSeries(prev => 
      prev.map(s => ({
        ...s,
        cardIds: s.cardIds.filter(cid => cid !== id),
        totalCards: s.cardIds.filter(cid => cid !== id).length
      }))
    );
    
    toast.success('Card deleted successfully!');
    return true;
  };
  
  // Series operations
  const fetchSeries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      // No need to update state in this mock implementation
    } catch (err) {
      setError('Failed to fetch series');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSeriesById = (id: string) => {
    return series.find(s => s.id === id);
  };
  
  const addSeries = async (seriesData: Series): Promise<Series> => {
    const newSeries: Series = {
      ...seriesData,
      id: seriesData.id || uuidv4(),
      createdAt: seriesData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCards: seriesData.cardIds?.length || 0
    };
    
    setSeries(prev => [...prev, newSeries]);
    toast.success('Series added successfully!');
    return newSeries;
  };
  
  const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series> => {
    const seriesIndex = series.findIndex(s => s.id === id);
    
    if (seriesIndex === -1) {
      throw new Error('Series not found');
    }
    
    const updatedSeries: Series = {
      ...series[seriesIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      totalCards: updates.cardIds?.length || series[seriesIndex].totalCards
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    toast.success('Series updated successfully!');
    return updatedSeries;
  };
  
  const deleteSeries = async (id: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === id);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    setSeries(prev => prev.filter(s => s.id !== id));
    toast.success('Series deleted successfully!');
    return true;
  };
  
  const addCardToSeries = async (cardId: string, seriesId: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === seriesId);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    const targetSeries = series[seriesIndex];
    
    if (targetSeries.cardIds.includes(cardId)) {
      return true; // Card already in series
    }
    
    const updatedSeries = {
      ...targetSeries,
      cardIds: [...targetSeries.cardIds, cardId],
      totalCards: targetSeries.cardIds.length + 1,
      updatedAt: new Date().toISOString()
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    // Also update the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = {
        ...cards[cardIndex],
        seriesId,
        updatedAt: new Date().toISOString()
      };
      
      const updatedCards = [...cards];
      updatedCards[cardIndex] = updatedCard;
      setCards(updatedCards);
    }
    
    toast.success('Card added to series successfully!');
    return true;
  };
  
  const removeCardFromSeries = async (cardId: string, seriesId: string): Promise<boolean> => {
    const seriesIndex = series.findIndex(s => s.id === seriesId);
    
    if (seriesIndex === -1) {
      return false;
    }
    
    const targetSeries = series[seriesIndex];
    
    if (!targetSeries.cardIds.includes(cardId)) {
      return true; // Card not in series
    }
    
    const updatedSeries = {
      ...targetSeries,
      cardIds: targetSeries.cardIds.filter(cid => cid !== cardId),
      totalCards: targetSeries.cardIds.length - 1,
      updatedAt: new Date().toISOString()
    };
    
    const updatedSeriesList = [...series];
    updatedSeriesList[seriesIndex] = updatedSeries;
    setSeries(updatedSeriesList);
    
    // Also update the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      const updatedCard = {
        ...cards[cardIndex],
        seriesId: undefined,
        updatedAt: new Date().toISOString()
      };
      
      const updatedCards = [...cards];
      updatedCards[cardIndex] = updatedCard;
      setCards(updatedCards);
    }
    
    toast.success('Card removed from series successfully!');
    return true;
  };
  
  const getCardsInSeries = (seriesId: string): EnhancedCard[] => {
    const targetSeries = series.find(s => s.id === seriesId);
    if (!targetSeries) {
      return [];
    }
    
    return cards.filter(card => targetSeries.cardIds.includes(card.id));
  };
  
  const contextValue: EnhancedCardContextProps = {
    cards,
    series,
    selectedCardId,
    selectedSeriesId,
    isLoading,
    error,
    
    fetchCards,
    getCardById,
    addCard,
    updateCard,
    deleteCard,
    setSelectedCardId,
    
    fetchSeries,
    getSeriesById,
    addSeries,
    updateSeries,
    deleteSeries,
    setSelectedSeriesId,
    addCardToSeries,
    removeCardFromSeries,
    getCardsInSeries
  };

  return (
    <EnhancedCardContext.Provider value={contextValue}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

// Hook for using the context
export const useEnhancedCards = () => {
  const context = useContext(EnhancedCardContext);
  
  if (!context) {
    throw new Error('useEnhancedCards must be used within a EnhancedCardProvider');
  }
  
  return context;
};
