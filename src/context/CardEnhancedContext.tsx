
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnhancedCard, Series, Deck } from '@/lib/types/enhancedCardTypes';

interface CardEnhancedContextType {
  enhancedCards: EnhancedCard[];
  series: Series[];
  decks: Deck[];
  isLoading: boolean;
  addEnhancedCard: (card: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  updateEnhancedCard: (id: string, updates: Partial<EnhancedCard>) => Promise<EnhancedCard>;
  deleteEnhancedCard: (id: string) => Promise<boolean>;
  addSeries: (series: Partial<Series>) => Promise<Series>;
  updateSeries: (id: string, updates: Partial<Series>) => Promise<Series>;
  deleteSeries: (id: string) => Promise<boolean>;
  addDeck: (deck: Partial<Deck>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>;
  deleteDeck: (id: string) => Promise<boolean>;
}

const CardEnhancedContext = createContext<CardEnhancedContextType | undefined>(undefined);

export const useEnhancedCards = () => {
  const context = useContext(CardEnhancedContext);
  if (!context) {
    throw new Error('useEnhancedCards must be used within a CardEnhancedProvider');
  }
  return context;
};

export const CardEnhancedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enhancedCards, setEnhancedCards] = useState<EnhancedCard[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addEnhancedCard = async (cardData: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    const newCard: EnhancedCard = {
      id: `card-${Date.now()}`,
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || '',
      userId: cardData.userId || 'default-user',
      tags: cardData.tags || [],
      effects: cardData.effects || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: cardData.designMetadata || {
        cardStyle: {
          template: 'standard',
          effect: 'none',
          borderRadius: '8px',
          borderColor: '#000000',
          frameWidth: 2,
          frameColor: '#000000',
          shadowColor: 'rgba(0,0,0,0.2)'
        },
        textStyle: {
          titleColor: '#000000',
          titleAlignment: 'center',
          titleWeight: 'bold',
          descriptionColor: '#333333'
        },
        cardMetadata: {
          category: 'Standard',
          series: 'Base',
          cardType: 'Standard'
        },
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false
        }
      },
      ...cardData
    };
    
    setEnhancedCards(prev => [...prev, newCard]);
    return newCard;
  };

  const updateEnhancedCard = async (id: string, updates: Partial<EnhancedCard>): Promise<EnhancedCard> => {
    let updatedCard: EnhancedCard = {} as EnhancedCard;
    
    setEnhancedCards(prev =>
      prev.map(card => {
        if (card.id === id) {
          updatedCard = { ...card, ...updates, updatedAt: new Date().toISOString() };
          return updatedCard;
        }
        return card;
      })
    );
    
    return updatedCard;
  };

  const deleteEnhancedCard = async (id: string): Promise<boolean> => {
    setEnhancedCards(prev => prev.filter(card => card.id !== id));
    return true;
  };

  const addSeries = async (seriesData: Partial<Series>): Promise<Series> => {
    const newSeries: Series = {
      id: `series-${Date.now()}`,
      title: seriesData.title || 'Untitled Series',
      name: seriesData.name || seriesData.title || 'Untitled Series',
      description: seriesData.description || '',
      releaseDate: seriesData.releaseDate || new Date().toISOString(),
      cards: seriesData.cards || [],
      totalCards: seriesData.totalCards || 0,
      cardIds: seriesData.cardIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...seriesData
    };
    
    setSeries(prev => [...prev, newSeries]);
    return newSeries;
  };

  const updateSeries = async (id: string, updates: Partial<Series>): Promise<Series> => {
    let updatedSeries: Series = {} as Series;
    
    setSeries(prev =>
      prev.map(s => {
        if (s.id === id) {
          updatedSeries = { ...s, ...updates, updatedAt: new Date().toISOString() };
          return updatedSeries;
        }
        return s;
      })
    );
    
    return updatedSeries;
  };

  const deleteSeries = async (id: string): Promise<boolean> => {
    setSeries(prev => prev.filter(s => s.id !== id));
    return true;
  };

  const addDeck = async (deckData: Partial<Deck>): Promise<Deck> => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: deckData.name || 'Untitled Deck',
      description: deckData.description || '',
      cards: deckData.cards || [],
      cardIds: deckData.cardIds || [],
      userId: deckData.userId || deckData.ownerId || 'default-user',
      ownerId: deckData.ownerId || deckData.userId || 'default-user',
      isPublic: deckData.isPublic !== undefined ? deckData.isPublic : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...deckData
    };
    
    setDecks(prev => [...prev, newDeck]);
    return newDeck;
  };

  const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    let updatedDeck: Deck = {} as Deck;
    
    setDecks(prev =>
      prev.map(deck => {
        if (deck.id === id) {
          updatedDeck = { ...deck, ...updates, updatedAt: new Date().toISOString() };
          return updatedDeck;
        }
        return deck;
      })
    );
    
    return updatedDeck;
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
    return true;
  };

  const value = {
    enhancedCards,
    series,
    decks,
    isLoading,
    addEnhancedCard,
    updateEnhancedCard,
    deleteEnhancedCard,
    addSeries,
    updateSeries,
    deleteSeries,
    addDeck,
    updateDeck,
    deleteDeck,
  };

  return (
    <CardEnhancedContext.Provider value={value}>
      {children}
    </CardEnhancedContext.Provider>
  );
};
