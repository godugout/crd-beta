
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';
import { toast } from 'sonner';

interface CardContextType {
  cards: Card[];
  isLoading: boolean;
  error: Error | null;
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  getCard: (cardId: string) => Card | undefined;
  getCardById: (cardId: string) => Card | undefined;
  refreshCards: () => Promise<void>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// Export CardProvider as a named export
export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with sample cards
  React.useEffect(() => {
    const loadInitialCards = async () => {
      try {
        setIsLoading(true);
        
        // Transform sample cards to ensure they have all required properties
        const transformedCards = sampleCards.map(card => {
          // Create a new object with all properties from the card
          const transformedCard = {
            ...card,
            // Add default designMetadata if it doesn't exist
            designMetadata: {
              cardStyle: {
                template: 'classic',
                effect: 'classic',
                borderRadius: '8px',
                borderColor: '#000000',
                frameColor: '#000000',
                frameWidth: 2,
                shadowColor: 'rgba(0,0,0,0.2)',
              },
              textStyle: {
                titleColor: '#FFFFFF',
                titleAlignment: 'left',
                titleWeight: 'bold',
                descriptionColor: '#FFFFFF',
              },
              marketMetadata: {
                isPrintable: false,
                isForSale: false,
                includeInCatalog: true
              },
              cardMetadata: {
                category: 'sports',
                cardType: 'collectible',
                series: 'standard'
              }
            }
          };
          return transformedCard as Card;
        });
        
        setCards(transformedCards);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        toast.error("Failed to load cards");
      }
    };
    
    loadInitialCards();
  }, []);

  const addCard = (card: Card) => {
    setCards(prevCards => [...prevCards, card]);
    toast.success("Card added successfully");
  };

  const updateCard = (updatedCard: Card) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    );
    toast.success("Card updated successfully");
  };

  const deleteCard = (cardId: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    toast.success("Card deleted successfully");
  };

  const getCard = (cardId: string) => {
    return cards.find(card => card.id === cardId);
  };

  const getCardById = (cardId: string) => {
    return cards.find(card => card.id === cardId);
  };

  const refreshCards = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, we would make an API call here
      // For demo purposes, just wait a bit then use the same cards
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      toast.success("Cards refreshed");
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      toast.error("Failed to refresh cards");
    }
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        isLoading,
        error,
        addCard,
        updateCard,
        deleteCard,
        getCard,
        getCardById,
        refreshCards
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Hook to use the card context
export const useCards = () => {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  
  return context;
};
