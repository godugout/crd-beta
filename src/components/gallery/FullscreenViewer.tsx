
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards'; // Import sampleCards

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCard } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fallback image to use when card image is not available
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

  useEffect(() => {
    if (!cardId) {
      setError("No card ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First try to get card from context
      let card = getCard ? getCard(cardId) : cards.find(c => c.id === cardId);
      
      // If not found in context, try in sampleCards
      if (!card) {
        console.log('Card not found in context, checking sampleCards for ID:', cardId);
        card = sampleCards.find(c => c.id === cardId);
      }
      
      if (card) {
        // Ensure image URLs are valid
        if (!card.imageUrl || card.imageUrl === 'undefined') {
          console.warn('Card has invalid imageUrl, applying fallback');
          card = {
            ...card,
            imageUrl: fallbackImage,
            thumbnailUrl: fallbackImage
          };
        }
        
        setCurrentCard(card);
      } else {
        setError(`Card with ID ${cardId} not found`);
      }
    } catch (err) {
      console.error('Error loading card:', err);
      setError('Failed to load card');
    } finally {
      setIsLoading(false);
    }
  }, [cardId, cards, getCard]);
  
  // Handle previous/next card navigation (simplified version)
  const handlePrevCard = () => {
    // Implementation for previous card
    console.log('Previous card requested');
  };
  
  const handleNextCard = () => {
    // Implementation for next card
    console.log('Next card requested');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentCard) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 text-white">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
          <p className="mb-4">{error || "Could not load card"}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="relative w-full h-full max-w-2xl max-h-[80vh] flex items-center justify-center">
        <div className="absolute left-4">
          <Button variant="ghost" size="icon" onClick={handlePrevCard} className="text-white hover:bg-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-full h-full flex items-center justify-center p-4">
          {currentCard.imageUrl && (
            <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
              <img
                src={currentCard.imageUrl}
                alt={currentCard.title || "Card"}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load image:', currentCard.imageUrl);
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>
          )}
        </div>
        
        <div className="absolute right-4">
          <Button variant="ghost" size="icon" onClick={handleNextCard} className="text-white hover:bg-gray-800">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 p-4 text-white">
        <h2 className="text-xl font-bold">{currentCard.title}</h2>
        {currentCard.description && (
          <p className="mt-2 text-sm text-gray-300">{currentCard.description}</p>
        )}
      </div>
    </div>
  );
};

export default FullscreenViewer;
