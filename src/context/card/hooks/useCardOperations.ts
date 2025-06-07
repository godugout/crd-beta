import { useState } from 'react';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types/cardTypes';
import { toast } from 'sonner';

interface UseCardOperationsResult {
  createCard: (card: Omit<Card, 'id'>) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  duplicateCard: (cardId: string) => void;
  publishCard: (cardId: string) => void;
  unpublishCard: (cardId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const useCardOperations = (): UseCardOperationsResult => {
  const { addCard, updateCard: updateCardContext, deleteCard: deleteCardContext } = useCards();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = (card: Omit<Card, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        if (addCard) {
          addCard(card as Card);
          toast.success('Card created successfully');
        }
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to create card');
      toast.error('Failed to create card');
      setIsLoading(false);
    }
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        if (updateCardContext) {
          updateCardContext(cardId, updates);
          toast.success('Card updated successfully');
        }
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to update card');
      toast.error('Failed to update card');
      setIsLoading(false);
    }
  };

  const deleteCard = (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        if (deleteCardContext) {
          deleteCardContext(cardId);
          toast.success('Card deleted successfully');
        }
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to delete card');
      toast.error('Failed to delete card');
      setIsLoading(false);
    }
  };

  const duplicateCard = (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        // Logic to duplicate card
        toast.success('Card duplicated successfully');
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate card');
      toast.error('Failed to duplicate card');
      setIsLoading(false);
    }
  };

  const publishCard = (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        // Logic to publish card
        toast.success('Card published successfully');
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to publish card');
      toast.error('Failed to publish card');
      setIsLoading(false);
    }
  };

  const unpublishCard = (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      setTimeout(() => {
        // Logic to unpublish card
        toast.success('Card unpublished successfully');
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish card');
      toast.error('Failed to unpublish card');
      setIsLoading(false);
    }
  };

  return {
    createCard,
    updateCard,
    deleteCard,
    duplicateCard,
    publishCard,
    unpublishCard,
    isLoading,
    error,
  };
};
