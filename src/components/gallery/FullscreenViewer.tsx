
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import CardViewer from '@/components/card-viewer/CardViewer';
import { Card } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

interface FullscreenViewerProps {
  card?: Card;
  cardId?: string;
  onClose: () => void;
  onShare?: () => void;
  onCapture?: () => void;
}

/**
 * FullscreenViewer component that displays a card in fullscreen mode
 * Accepts either a card object or a cardId to fetch the card
 */
const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  card: providedCard,
  cardId,
  onClose,
  onShare,
  onCapture
}) => {
  const { getCardById } = useCards();
  const [card, setCard] = useState<Card | null>(providedCard || null);
  const [isLoading, setIsLoading] = useState(!providedCard && !!cardId);
  const [error, setError] = useState<string | null>(null);

  // Fetch card if cardId is provided but no card object
  useEffect(() => {
    if (!providedCard && cardId) {
      try {
        setIsLoading(true);
        const fetchedCard = getCardById(cardId);
        
        if (fetchedCard) {
          // Ensure card has all required properties
          setCard(adaptToCard(fetchedCard));
        } else {
          setError(`Card with ID ${cardId} not found`);
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Failed to load card');
      } finally {
        setIsLoading(false);
      }
    }
  }, [cardId, providedCard, getCardById]);

  // Handle keyboard events for closing the viewer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={onClose}
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading ? (
          <div className="text-white text-center">
            <div className="w-12 h-12 rounded-full border-t-2 border-white animate-spin mx-auto mb-4"></div>
            <p>Loading card...</p>
          </div>
        ) : error ? (
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : card ? (
          <CardViewer 
            card={card}
            isFlipped={false}
            activeEffects={card.effects || []}
            isFullscreen={true}
            onShare={onShare}
            onCapture={onCapture}
            onClose={onClose}
          />
        ) : (
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Card not found</h2>
            <p>The requested card could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenViewer;
