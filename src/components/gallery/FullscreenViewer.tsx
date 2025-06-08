
import React from 'react';
import { useCardLoader } from '@/hooks/useCardLoader';
import { useImageValidation } from '@/hooks/useImageValidation';
import { useFullscreenNavigation } from '@/hooks/useFullscreenNavigation';
import FullscreenHeader from './viewer/FullscreenHeader';
import NavigationControls from './viewer/NavigationControls';
import CardImage from './viewer/CardImage';
import CardInfo from './viewer/CardInfo';
import LoadingState from './viewer/LoadingState';
import ErrorState from './viewer/ErrorState';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { currentCard, isLoading, error } = useCardLoader(cardId);
  const { validImageUrl } = useImageValidation(currentCard);
  const { handlePrevCard, handleNextCard, canGoPrev, canGoNext } = useFullscreenNavigation(cardId);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('FullscreenViewer: Failed to load image:', validImageUrl);
    if (validImageUrl !== '/images/card-placeholder.png') {
      e.currentTarget.src = '/images/card-placeholder.png';
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !currentCard) {
    return <ErrorState error={error || "Could not load card"} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <FullscreenHeader onClose={onClose} />
      
      <div className="relative w-full h-full max-w-2xl max-h-[80vh] flex items-center justify-center">
        <NavigationControls 
          onPrev={handlePrevCard}
          onNext={handleNextCard}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />
        
        <CardImage 
          src={validImageUrl}
          alt={currentCard.title || "Card"}
          onError={handleImageError}
        />
      </div>
      
      <CardInfo card={currentCard} />
    </div>
  );
};

export default FullscreenViewer;
