
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnhancedCard, CardRarity } from '@/lib/types/CardTypes';
import { Card } from '@/lib/types';
import { useCards } from './CardContext';

interface CardEnhancedContextType {
  enhancedCards: EnhancedCard[];
  setEnhancedCards: React.Dispatch<React.SetStateAction<EnhancedCard[]>>;
  getCardById: (id: string) => EnhancedCard | undefined;
  updateCardRarity: (id: string, rarity: CardRarity) => void;
}

const CardEnhancedContext = createContext<CardEnhancedContextType | undefined>(undefined);

export const useEnhancedCards = () => {
  const context = useContext(CardEnhancedContext);
  if (context === undefined) {
    throw new Error('useEnhancedCards must be used within a CardEnhancedProvider');
  }
  return context;
};

export const CardEnhancedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enhancedCards, setEnhancedCards] = useState<EnhancedCard[]>([]);
  const { cards } = useCards();

  useEffect(() => {
    if (cards && cards.length > 0) {
      // Convert regular cards to enhanced cards with additional metadata
      const enhanced = cards.map(card => ({
        ...card,
        rarity: (card.tags?.includes('rare') ? 'rare' : 
               card.tags?.includes('legendary') ? 'legendary' : 
               card.tags?.includes('ultra-rare') ? 'ultra-rare' : 
               'common') as CardRarity,
        cardNumber: card.id.slice(0, 8),
        editionSize: Math.floor(Math.random() * 100) + 1,
        releaseDate: new Date(card.createdAt).toISOString(),
        qrCodeData: `https://cardshow.app/card/${card.id}`,
        hotspots: []
      }));
      
      setEnhancedCards(enhanced as EnhancedCard[]);
    }
  }, [cards]);

  const getCardById = (id: string) => {
    return enhancedCards.find(card => card.id === id);
  };

  const updateCardRarity = (id: string, rarity: CardRarity) => {
    setEnhancedCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, rarity } : card
      )
    );
  };

  return (
    <CardEnhancedContext.Provider value={{ enhancedCards, setEnhancedCards, getCardById, updateCardRarity }}>
      {children}
    </CardEnhancedContext.Provider>
  );
};
