
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Card } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/cardAdapter';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import { sampleCardData } from '@/lib/data/sampleCardData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the context shape
interface CardContextType {
  cards: Card[];
  loadingCards: boolean;
  addCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  removeCard: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  getCard: (id: string) => Card | undefined; // Alias for getCardById for compatibility
}

// Create context with default undefined value
const CardContext = createContext<CardContextType | undefined>(undefined);

// Provider component
interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState<boolean>(true);

  // Load cards from storage or use samples on initial render
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // In a real app, this would load from API/database
        // For now, we'll use the sample data
        const storedCards = localStorage.getItem('cards');
        if (storedCards) {
          const parsedCards = JSON.parse(storedCards);
          // Ensure all cards have the required properties using adaptToCard
          setCards(parsedCards.map((card: Partial<Card>) => adaptToCard(card)));
        } else {
          // Use sample data if no stored cards
          setCards(sampleCardData);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        // Fallback to sample data on error
        setCards(sampleCardData);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, []);

  // Save cards to storage whenever they change
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  }, [cards]);

  // Add a new card
  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    try {
      const timestamp = new Date().toISOString();
      
      const newCard = adaptToCard({
        id: uuidv4(),
        ...cardData,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: 'user1', // In a real app, this would be the current user's ID
        effects: cardData.effects || [],
        designMetadata: cardData.designMetadata || DEFAULT_DESIGN_METADATA
      });
      
      setCards(prevCards => [...prevCards, newCard]);
      return newCard;
    } catch (error) {
      console.error('Error adding card:', error);
      throw new Error('Failed to add card');
    }
  };

  // Update an existing card
  const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
    try {
      const existingCard = cards.find(card => card.id === id);
      
      if (!existingCard) {
        throw new Error(`Card with id ${id} not found`);
      }
      
      const updatedCard = adaptToCard({
        ...existingCard,
        ...cardData,
        updatedAt: new Date().toISOString(),
        designMetadata: {
          ...existingCard.designMetadata,
          ...cardData.designMetadata
        }
      });
      
      setCards(prevCards =>
        prevCards.map(card => (card.id === id ? updatedCard : card))
      );
      
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      throw new Error('Failed to update card');
    }
  };

  // Remove a card
  const removeCard = async (id: string): Promise<boolean> => {
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing card:', error);
      return false;
    }
  };

  // Get a card by ID
  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        loadingCards,
        addCard,
        updateCard,
        removeCard,
        getCardById,
        getCard: getCardById // Alias for compatibility
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Custom hook for using the context
export const useCards = (): CardContextType => {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  
  return context;
};
