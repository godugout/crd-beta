
import { useCallback } from 'react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card } from '@/lib/types';

export const useCardOperations = () => {
  const { addCard, updateCard, deleteCard, cards } = useCards();
  
  const createCard = useCallback(async (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCard = await addCard(cardData);
      toast.success('Card created successfully');
      return newCard;
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
      throw error;
    }
  }, [addCard]);
  
  const editCard = useCallback(async (id: string, cardData: Partial<Card>) => {
    try {
      const success = await updateCard(id, cardData);
      
      if (success) {
        toast.success('Card updated successfully');
      } else {
        toast.error('Failed to update card');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
      throw error;
    }
  }, [updateCard]);
  
  const removeCard = useCallback(async (id: string, onSuccess?: () => void) => {
    try {
      const success = await deleteCard(id);
      
      if (success) {
        toast.success('Card deleted successfully');
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to delete card');
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
      throw error;
    }
  }, [deleteCard]);
  
  const duplicateCard = useCallback(async (id: string) => {
    try {
      const originalCard = cards.find(card => card.id === id);
      
      if (!originalCard) {
        toast.error('Card not found');
        return null;
      }
      
      const { id: _, createdAt, updatedAt, ...cardData } = originalCard;
      
      const duplicatedCard = {
        ...cardData,
        title: `Copy of ${cardData.title}`
      };
      
      const newCard = await addCard(duplicatedCard as Omit<Card, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Card duplicated successfully');
      
      return newCard;
    } catch (error) {
      console.error('Error duplicating card:', error);
      toast.error('Failed to duplicate card');
      throw error;
    }
  }, [addCard, cards]);
  
  const shareCard = useCallback((card: Card) => {
    const shareUrl = `${window.location.origin}/cards/${card.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description || 'Check out this card!',
        url: shareUrl
      })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      });
  };
  
  return {
    createCard,
    editCard,
    removeCard,
    duplicateCard,
    shareCard
  };
};

export default useCardOperations;
