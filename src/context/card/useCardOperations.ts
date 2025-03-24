
import { useState } from 'react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import { cardOperations } from '@/lib/supabase';

interface UseCardOperationsProps {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useCardOperations = ({
  cards,
  setCards,
  setIsLoading, 
  setError
}: UseCardOperationsProps) => {
  
  // Fetch cards from Supabase
  const refreshCards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.getCards();
      
      if (error) {
        setError(error.message);
        toast.error('Failed to load cards: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(data);
      }
    } catch (err: any) {
      console.error('Fetch cards error:', err);
      setError(err.message || 'Failed to load cards');
      toast.error('An unexpected error occurred loading cards');
    } finally {
      setIsLoading(false);
    }
  };

  // Card operations
  const addCard = async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.createCard(card);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to create card: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(prev => [...prev, data]);
        toast.success('Card created successfully');
        return data;
      }
    } catch (err: any) {
      console.error('Create card error:', err);
      setError(err.message || 'Failed to create card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await cardOperations.updateCard(id, updates);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to update card: ' + error.message);
        return;
      }
      
      if (data) {
        setCards(prev => 
          prev.map(card => 
            card.id === id ? data : card
          )
        );
        
        toast.success('Card updated successfully');
      }
    } catch (err: any) {
      console.error('Update card error:', err);
      setError(err.message || 'Failed to update card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await cardOperations.deleteCard(id);
      
      if (error) {
        setError(error.message);
        toast.error('Failed to delete card: ' + error.message);
        return;
      }
      
      setCards(prev => prev.filter(card => card.id !== id));
      
      toast.success('Card deleted successfully');
    } catch (err: any) {
      console.error('Delete card error:', err);
      setError(err.message || 'Failed to delete card');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    refreshCards,
    addCard,
    updateCard,
    deleteCard
  };
};
