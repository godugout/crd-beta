
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Card, Collection } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/typeAdapters';
import { cardToEnhancedCard } from '@/lib/adapters/EnhancedCardAdapter';
import { Deck, Series, EnhancedCard } from '@/lib/types/enhancedCardTypes';
import { CardContext, CardContextProps } from './CardContext';

/**
 * Enhanced card context extends the basic card context with additional functionality
 * for decks, series, and enhanced card types
 */
export interface EnhancedCardContextProps extends CardContextProps {
  enhancedCards: EnhancedCard[];
  decks: Deck[];
  series: Series[];
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
  addCardToDeck: (deckId: string, cardId: string) => Promise<boolean>;
  removeCardFromDeck: (deckId: string, cardId: string) => Promise<boolean>;
  addSeries: (series: Partial<Series>) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<Series>;
}

/**
 * Context for enhanced card operations
 */
export const EnhancedCardContext = createContext<EnhancedCardContextProps | undefined>(undefined);

/**
 * Provider component for EnhancedCardContext
 * Extends the base CardContext with enhanced functionality
 */
export const EnhancedCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get base card context
  const cardContext = useContext(CardContext);
  if (!cardContext) {
    throw new Error('EnhancedCardProvider must be used within a CardProvider');
  }

  const [decks, setDecks] = useState<Deck[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  // Convert standard cards to enhanced cards
  const enhancedCards = cardContext.cards.map(cardToEnhancedCard);

  /**
   * Create a new deck
   */
  const addDeck = async (deckData: Partial<Deck>): Promise<Deck> => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: deckData.name || 'New Deck',
      description: deckData.description || '',
      cards: deckData.cards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: deckData.ownerId || 'user-1',
      coverImageUrl: deckData.coverImageUrl,
      cardIds: deckData.cardIds || [],
      isPublic: deckData.isPublic || false
    };
    setDecks(prev => [...prev, newDeck]);
    return newDeck;
  };

  /**
   * Update an existing deck
   */
  const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    const updatedDeck = decks.find(deck => deck.id === id);
    if (!updatedDeck) {
      throw new Error(`Deck with ID ${id} not found`);
    }
    
    const updated = { ...updatedDeck, ...updates, updatedAt: new Date().toISOString() };
    setDecks(prev => prev.map(deck => deck.id === id ? updated : deck));
    return updated;
  };

  /**
   * Delete a deck
   */
  const deleteDeck = async (id: string): Promise<boolean> => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
    return true;
  };

  /**
   * Add a card to a deck
   */
  const addCardToDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return false;
    
    const cardToAdd = cardContext.cards.find(c => c.id === cardId) || adaptToCard({
      id: cardId,
      title: 'Card',
      imageUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effects: []
    });
    
    setDecks(prev => {
      const updatedDecks = [...prev];
      const currentDeck = { ...updatedDecks[deckIndex] };
      
      // Add to cardIds if not already present
      if (!currentDeck.cardIds?.includes(cardId)) {
        currentDeck.cardIds = [...(currentDeck.cardIds || []), cardId];
      }
      
      // Add to cards array if it exists and card is not already present
      if (currentDeck.cards) {
        if (!currentDeck.cards.some(c => c.id === cardId)) {
          currentDeck.cards = [...currentDeck.cards, cardToAdd];
        }
      }
      
      currentDeck.updatedAt = new Date().toISOString();
      updatedDecks[deckIndex] = currentDeck;
      return updatedDecks;
    });
    
    return true;
  };

  /**
   * Remove a card from a deck
   */
  const removeCardFromDeck = async (deckId: string, cardId: string): Promise<boolean> => {
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return false;
    
    setDecks(prev => {
      const updatedDecks = [...prev];
      const currentDeck = { ...updatedDecks[deckIndex] };
      
      // Remove from cardIds
      currentDeck.cardIds = currentDeck.cardIds?.filter(id => id !== cardId) || [];
      
      // Remove from cards array if it exists
      if (currentDeck.cards) {
        currentDeck.cards = currentDeck.cards.filter(c => c.id !== cardId);
      }
      
      currentDeck.updatedAt = new Date().toISOString();
      updatedDecks[deckIndex] = currentDeck;
      return updatedDecks;
    });
    
    return true;
  };

  /**
   * Create a new series
   */
  const addSeries = async (seriesData: Partial<Series>): Promise<Series> => {
    const newSeries: Series = {
      id: `series-${Date.now()}`,
      name: seriesData.name || 'New Series',
      title: seriesData.title || seriesData.name || 'New Series',
      description: seriesData.description || '',
      coverImageUrl: seriesData.coverImageUrl || '',
      artistId: seriesData.artistId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releaseDate: seriesData.releaseDate || new Date().toISOString(),
      totalCards: seriesData.totalCards || 0,
      isPublished: seriesData.isPublished || false,
      cardIds: seriesData.cardIds || [],
      releaseType: seriesData.releaseType || 'standard',
      cards: seriesData.cards || []
    };
    setSeries(prev => [...prev, newSeries]);
    return newSeries;
  };

  /**
   * Update an existing series
   */
  const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series> => {
    const updatedSeries = series.find(s => s.id === id);
    if (!updatedSeries) {
      throw new Error(`Series with ID ${id} not found`);
    }
    
    const updated = { ...updatedSeries, ...updates, updatedAt: new Date().toISOString() };
    setSeries(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  };

  const value: EnhancedCardContextProps = {
    // Include all base card context values
    ...cardContext,
    // Add enhanced functionality
    enhancedCards,
    decks,
    series,
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    addSeries,
    updateSeries
  };

  return (
    <EnhancedCardContext.Provider value={value}>
      {children}
    </EnhancedCardContext.Provider>
  );
};

/**
 * Hook to access the enhanced card context
 * Throws an error if used outside of an EnhancedCardProvider
 */
export const useEnhancedCards = () => {
  const context = useContext(EnhancedCardContext);
  if (!context) {
    throw new Error('useEnhancedCards must be used within an EnhancedCardProvider');
  }
  return context;
};

export type { Deck, Series, EnhancedCard };
