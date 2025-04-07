
import { useState } from 'react';
import { Card } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const useCardOperations = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = async (cardData: Partial<Card>): Promise<Card> => {
    // Generate a new ID if one isn't provided
    const newCard: Card = {
      id: cardData.id || uuidv4(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || '',
      imageUrl: cardData.imageUrl || '',
      thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
      createdAt: new Date().toISOString(),
      userId: cardData.userId || 'anonymous',
      collectionId: cardData.collectionId,
      designMetadata: cardData.designMetadata || {
        cardStyle: {},
        textStyle: {}
      },
      tags: cardData.tags || [],
    };

    setCards(prevCards => [...prevCards, newCard]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Card>): Card | null => {
    let updatedCard: Card | null = null;

    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === id) {
          updatedCard = { ...card, ...updates };
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

  return {
    cards,
    addCard,
    updateCard,
    getCard,
    deleteCard,
    setCards,
  };
};
