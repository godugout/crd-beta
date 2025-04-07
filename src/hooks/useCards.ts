
import { useState, useEffect, useCallback } from 'react';
import { cardRepository } from '@/lib/data/cardRepository';
import { Card } from '@/lib/schema/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface UseCardsOptions {
  teamId?: string;
  collectionId?: string;
  tags?: string[];
  autoFetch?: boolean;
}

export function useCards(options: UseCardsOptions = {}) {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!user) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await cardRepository.getCards({
        teamId: options.teamId,
        collectionId: options.collectionId,
        tags: options.tags
      });

      if (error) {
        console.error('Error fetching cards:', error);
        setError(error.message || 'Failed to load cards');
        toast.error('Failed to load cards');
        return;
      }

      if (data) {
        setCards(data);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching cards:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  }, [user, options.teamId, options.collectionId, options.tags]);

  // Initial fetch
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchCards();
    }
  }, [fetchCards, options.autoFetch]);

  const addCard = useCallback(async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to create cards');
      return null;
    }

    const { data, error } = await cardRepository.createCard({
      ...cardData,
      userId: user.id
    });

    if (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
      return null;
    }

    if (data) {
      setCards(prev => [data, ...prev]);
      toast.success('Card created successfully');
      return data;
    }

    return null;
  }, [user]);

  const updateCard = useCallback(async (id: string, updates: Partial<Card>) => {
    const { data, error } = await cardRepository.updateCard(id, updates);

    if (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
      return null;
    }

    if (data) {
      setCards(prev => prev.map(card => card.id === id ? data : card));
      toast.success('Card updated successfully');
      return data;
    }

    return null;
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    const { success, error } = await cardRepository.deleteCard(id);

    if (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
      return false;
    }

    if (success) {
      setCards(prev => prev.filter(card => card.id !== id));
      toast.success('Card deleted successfully');
      return true;
    }

    return false;
  }, []);

  const getCard = useCallback((id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const addReaction = useCallback(async (
    cardId: string,
    type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry'
  ) => {
    if (!user) {
      toast.error('You must be logged in to react to cards');
      return false;
    }

    const { success, error } = await cardRepository.addReaction(cardId, user.id, type);

    if (error) {
      console.error('Error adding reaction:', error);
      return false;
    }

    if (success) {
      // Update local state with optimistic update
      setCards(prev => prev.map(card => {
        if (card.id !== cardId) return card;
        
        const existingReactionIndex = card.reactions?.findIndex(r => r.userId === user.id);
        const reactions = [...(card.reactions || [])];
        
        if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
          // Update existing reaction
          reactions[existingReactionIndex] = {
            ...reactions[existingReactionIndex],
            type
          };
        } else {
          // Add new reaction
          reactions.push({
            id: 'temp-' + Date.now(),
            userId: user.id,
            cardId,
            type,
            createdAt: new Date().toISOString()
          });
        }
        
        return {
          ...card,
          reactions
        };
      }));
      return true;
    }

    return false;
  }, [user]);

  const removeReaction = useCallback(async (cardId: string) => {
    if (!user) return false;

    const { success, error } = await cardRepository.removeReaction(cardId, user.id);

    if (error) {
      console.error('Error removing reaction:', error);
      return false;
    }

    if (success) {
      // Update local state
      setCards(prev => prev.map(card => {
        if (card.id !== cardId) return card;
        
        return {
          ...card,
          reactions: (card.reactions || []).filter(r => r.userId !== user.id)
        };
      }));
      return true;
    }

    return false;
  }, [user]);

  return {
    cards,
    isLoading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
    getCard,
    addReaction,
    removeReaction
  };
}
