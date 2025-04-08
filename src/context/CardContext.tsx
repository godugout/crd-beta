
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { sampleCards } from '@/data/sampleCards';

// Define the Card type
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  collectionId?: string;
  tags: string[];
  designMetadata?: {
    cardStyle?: {
      template?: string;
      effect?: string;
      borderRadius?: string;
      borderColor?: string;
      frameColor?: string;
      frameWidth?: number;
      shadowColor?: string;
    };
    textStyle?: {
      titleColor?: string;
      titleAlignment?: string;
      titleWeight?: string;
      descriptionColor?: string;
    };
    marketMetadata?: {
      isPrintable?: boolean;
      isForSale?: boolean;
      includeInCatalog?: boolean;
    };
    cardMetadata?: {
      category?: string;
      cardType?: string;
      series?: string;
    };
  };
}

type CardContextType = {
  cards: Card[];
  addCard: (cardData: Partial<Card>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Card | null;
  getCard: (id: string) => Card | undefined;
  deleteCard: (id: string) => boolean;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample cards
  const [cards, setCards] = useState<Card[]>(sampleCards);

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    try {
      // Generate a new ID if one isn't provided
      const newCard: Card = {
        id: cardData.id || uuidv4(),
        title: cardData.title || 'Untitled Card',
        description: cardData.description || '',
        imageUrl: cardData.imageUrl || '',
        thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: cardData.userId || 'anonymous',
        collectionId: cardData.collectionId,
        designMetadata: cardData.designMetadata || {
          cardStyle: {},
          textStyle: {},
          marketMetadata: {},
          cardMetadata: {}
        },
        tags: cardData.tags || [],
      };

      setCards(prevCards => [newCard, ...prevCards]);
      return newCard;
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
      throw error;
    }
  };

  const updateCard = (id: string, updates: Partial<Card>): Card | null => {
    let updatedCard: Card | null = null;

    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === id) {
          updatedCard = { 
            ...card, 
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return updatedCard;
        }
        return card;
      });
    });

    return updatedCard;
  };

  const getCard = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const deleteCard = (id: string): boolean => {
    const cardExists = cards.some(card => card.id === id);
    
    if (cardExists) {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      return true;
    }
    
    return false;
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, getCard, deleteCard }}>
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
