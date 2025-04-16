
import { useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

export const useCardOperations = () => {
  const { addCard, updateCard: updateCardInContext, deleteCard: deleteCardFromContext } = useCards();

  const createCard = useCallback(
    async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        // Ensure all required properties are present
        const cardWithDefaults = {
          ...cardData,
          isPublic: cardData.isPublic !== undefined ? cardData.isPublic : true,
          effects: cardData.effects || [],
          rarity: cardData.rarity || 'common'
        };

        const newCard = await addCard(cardWithDefaults);
        toast.success('Card created successfully');
        return newCard;
      } catch (error) {
        console.error('Error creating card:', error);
        toast.error('Failed to create card');
        throw error;
      }
    },
    [addCard]
  );

  const updateCard = useCallback(
    async (id: string, updates: Partial<Card>) => {
      try {
        const success = await updateCardInContext(id, updates);
        if (success) {
          toast.success('Card updated successfully');
        } else {
          toast.error('Failed to update card');
        }
        return success;
      } catch (error) {
        console.error('Error updating card:', error);
        toast.error('Failed to update card');
        return false;
      }
    },
    [updateCardInContext]
  );

  const deleteCard = useCallback(
    async (id: string) => {
      try {
        const success = await deleteCardFromContext(id);
        if (success) {
          toast.success('Card deleted successfully');
        } else {
          toast.error('Failed to delete card');
        }
        return success;
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Failed to delete card');
        return false;
      }
    },
    [deleteCardFromContext]
  );

  return {
    createCard,
    updateCard,
    deleteCard
  };
};

export default useCardOperations;
