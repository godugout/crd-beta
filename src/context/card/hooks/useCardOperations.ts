
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

export default function useCardOperations() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCard = async (cardData: Omit<Card, "id" | "createdAt" | "updatedAt">): Promise<Card> => {
    setIsLoading(true);
    try {
      const newCard: Card = {
        ...cardData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCards(prevCards => [...prevCards, newCard]);
      toast.success("Card created successfully");
      return newCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create card');
      setError(error);
      toast.error(`Error creating card: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>): Promise<boolean> => {
    setIsLoading(true);
    try {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === id
            ? { ...card, ...updates, updatedAt: new Date().toISOString() }
            : card
        )
      );
      toast.success("Card updated successfully");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update card');
      setError(error);
      toast.error(`Error updating card: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setCards(prevCards => prevCards.filter(card => card.id !== id));
      toast.success("Card deleted successfully");
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete card');
      setError(error);
      toast.error(`Error deleting card: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cards,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard
  };
}
