
import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardService } from '@/lib/api/services/cardService';
import type { Card } from '@/lib/types';
import { toast } from 'sonner';

interface CardContextType {
  cards: Card[];
  isLoading: boolean;
  error: Error | null;
  addCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<boolean>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function CardStateProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch cards
  const { data: cards = [], isLoading, error } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const response = await cardService.getCards();
      return response.cards;
    },
  });

  // Add card mutation
  const addCardMutation = useMutation({
    mutationFn: cardService.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card created successfully');
    },
  });

  // Update card mutation
  const updateCardMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Card> }) =>
      cardService.updateCard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card updated successfully');
    },
  });

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: cardService.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card deleted successfully');
    },
  });

  const value = {
    cards,
    isLoading,
    error,
    addCard: addCardMutation.mutateAsync,
    updateCard: (id: string, updates: Partial<Card>) =>
      updateCardMutation.mutateAsync({ id, updates }),
    deleteCard: deleteCardMutation.mutateAsync,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

export const useCards = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardStateProvider');
  }
  return context;
};
