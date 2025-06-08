
import { useCards } from '@/hooks/useCards';

export const useFullscreenNavigation = (cardId: string) => {
  const { cards } = useCards();
  
  // Find all card indices from cards array to enable navigation between cards
  const allCardIds = cards?.map(card => card.id) || [];
  const currentIndex = allCardIds.indexOf(cardId);
  
  // Handle previous/next card navigation
  const handlePrevCard = () => {
    if (currentIndex > 0) {
      const prevCardId = allCardIds[currentIndex - 1];
      setTimeout(() => {
        window.location.hash = `/cards/${prevCardId}`;
      }, 50);
    }
  };
  
  const handleNextCard = () => {
    if (currentIndex < allCardIds.length - 1) {
      const nextCardId = allCardIds[currentIndex + 1];
      setTimeout(() => {
        window.location.hash = `/cards/${nextCardId}`;
      }, 50);
    }
  };

  return {
    currentIndex,
    allCardIds,
    handlePrevCard,
    handleNextCard,
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < allCardIds.length - 1
  };
};
