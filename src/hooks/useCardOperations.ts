
import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';

export function useCardOperations() {
  const { addCard, updateCard, deleteCard } = useCards();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCard = async (cardData: Partial<Card>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCard = await addCard(cardData);
      toast.success('Card created successfully');
      return newCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create card');
      setError(error);
      toast.error('Failed to create card');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const modifyCard = async (cardData: Partial<Card>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedCard = await updateCard(cardData);
      toast.success('Card updated successfully');
      return updatedCard;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update card');
      setError(error);
      toast.error('Failed to update card');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCard = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteCard(id);
      toast.success('Card deleted successfully');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete card');
      setError(error);
      toast.error('Failed to delete card');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCard,
    modifyCard,
    removeCard,
    isLoading,
    error,
  };
}
