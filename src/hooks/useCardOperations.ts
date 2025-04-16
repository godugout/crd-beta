
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Card } from '@/lib/types';

/**
 * Hook that provides standard card operations and navigation
 */
export function useCardOperations() {
  const navigate = useNavigate();
  
  // Get functions from CardContext
  const { deleteCard, updateCard } = useCards();
  
  /**
   * View a card in the full screen viewer
   */
  const viewCard = useCallback((cardId: string) => {
    navigate(`/view/${cardId}`);
  }, [navigate]);
  
  /**
   * Navigate to card detail page
   */
  const showCardDetails = useCallback((cardId: string) => {
    navigate(`/card/${cardId}`);
  }, [navigate]);
  
  /**
   * Navigate to card edit page
   */
  const editCard = useCallback((cardId: string) => {
    navigate(`/edit/${cardId}`);
  }, [navigate]);
  
  /**
   * Share a card
   */
  const shareCard = useCallback((card: Card) => {
    if (navigator.share) {
      navigator.share({
        title: card.title || 'Check out this card',
        text: card.description || '',
        url: window.location.origin + `/card/${card.id}`,
      })
        .then(() => toast.success('Card shared successfully'))
        .catch((error) => {
          console.error('Error sharing card:', error);
          copyCardLink(card.id);
        });
    } else {
      copyCardLink(card.id);
    }
  }, []);
  
  /**
   * Copy card link to clipboard
   */
  const copyCardLink = useCallback((cardId: string) => {
    const url = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  }, []);
  
  /**
   * Delete a card with confirmation
   */
  const removeCard = useCallback((cardId: string, onSuccess?: () => void) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId).then(success => {
        if (success) {
          toast.success('Card deleted successfully');
          if (onSuccess) onSuccess();
        } else {
          toast.error('Failed to delete card');
        }
      });
    }
  }, [deleteCard]);
  
  return {
    viewCard,
    showCardDetails,
    editCard,
    shareCard,
    copyCardLink,
    removeCard
  };
}
