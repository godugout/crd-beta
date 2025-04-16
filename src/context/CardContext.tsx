import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { sampleCards } from '@/lib/sampleCards';

interface CardContextType {
  cards: Card[];
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  getCardById: (id: string) => Card | undefined;
  getCardsByUserId: (userId: string) => Card[];
  isLoading: boolean;
  error: string | null;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Simulate loading cards from an API
    const loadCards = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setCards(sampleCards);
          setIsLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.message || 'Failed to load cards');
        setIsLoading(false);
      }
    };
    
    loadCards();
  }, []);
  
  // Update the addCard function to use imageUrl instead of image
  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    // Create a new card with default values and user provided data
    const newCard: Card = {
      ...cardData as Card,
      id: cardData.id || uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '', // Use imageUrl instead of image
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '', // Use imageUrl as fallback
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      effects: cardData.effects || [],
      creatorId: user?.id // Add creatorId for proper typing
    };
    
    setCards(prevCards => [newCard, ...prevCards]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
    setCards(prevCards =>
      prevCards.map(card => (card.id === id ? { ...card, ...updates } : card))
    );
  };

  const deleteCard = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const getCardsByUserId = (userId: string): Card[] => {
    return cards.filter(card => card.userId === userId);
  };

  const value: CardContextType = {
    cards,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
    getCardsByUserId,
    isLoading,
    error,
  };

  return (
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
