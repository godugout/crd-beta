import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { sampleCards } from '@/lib/data/sampleCards';
import { toast } from '@/hooks/use-toast';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

// Fallback image to use when card image is not available
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCard } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validImageUrl, setValidImageUrl] = useState<string>(FALLBACK_IMAGE);
  
  useEffect(() => {
    if (!cardId) {
      setError("No card ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('FullscreenViewer: Loading card with ID:', cardId);
      
      // First try to find card directly from sampleCards
      let foundCard = sampleCards.find(c => c.id === cardId);
      
      // If not found in sampleCards, try the cards context
      if (!foundCard) {
        console.log('FullscreenViewer: Card not found in sampleCards, checking context');
        foundCard = getCard ? getCard(cardId) : cards.find(c => c.id === cardId);
      }
      
      if (foundCard) {
        // Create a processed card with all required fields
        const processedCard: Card = {
          ...foundCard,
          // Ensure required properties exist with default values
          description: foundCard.description || '',
          effects: foundCard.effects || [],
          title: foundCard.title || 'Untitled Card',
          tags: foundCard.tags || [],
          createdAt: foundCard.createdAt || new Date().toISOString(),
          updatedAt: foundCard.updatedAt || new Date().toISOString(),
          userId: foundCard.userId || '',
          // Make sure image URLs are present
          imageUrl: foundCard.imageUrl || FALLBACK_IMAGE,
          thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || FALLBACK_IMAGE,
          // Add any other required fields with default values
          designMetadata: foundCard.designMetadata || {
            cardStyle: {},
            textStyle: {},
            marketMetadata: {},
            cardMetadata: {}
          }
        };
        
        // Always initialize with fallback first, then update if the real image loads
        setValidImageUrl(FALLBACK_IMAGE);
        
        if (processedCard.imageUrl && 
            processedCard.imageUrl !== 'undefined' && 
            typeof processedCard.imageUrl === 'string') {
          // Validate the image URL by preloading it
          const img = new Image();
          img.onload = () => {
            console.log('FullscreenViewer: Image validated successfully:', processedCard.imageUrl);
            setValidImageUrl(processedCard.imageUrl || FALLBACK_IMAGE);
          };
          img.onerror = () => {
            console.warn('FullscreenViewer: Image validation failed, using fallback');
            setValidImageUrl(FALLBACK_IMAGE);
            toast({
              title: "Image Error",
              description: "Could not load the card image. Using a fallback image instead.",
              variant: "destructive"
            });
          };
          img.src = processedCard.imageUrl;
        } else {
          console.warn('FullscreenViewer: Card has invalid imageUrl, using fallback');
        }
        
        console.log('FullscreenViewer: Card loaded successfully');
        setCurrentCard(processedCard);
      } else {
        console.error('FullscreenViewer: Card not found with ID:', cardId);
        setError(`Card with ID ${cardId} not found`);
      }
    } catch (err) {
      console.error('FullscreenViewer: Error loading card:', err);
      setError('Failed to load card');
    } finally {
      setIsLoading(false);
    }
  }, [cardId, cards, getCard]);
  
  // Find all card indices from sampleCards to enable navigation between cards
  const allCardIds = sampleCards.map(card => card.id);
  const currentIndex = allCardIds.indexOf(cardId);
  
  // Handle previous/next card navigation
  const handlePrevCard = () => {
    if (currentIndex > 0) {
      window.location.href = `/cards/${allCardIds[currentIndex - 1]}`;
    }
  };
  
  const handleNextCard = () => {
    if (currentIndex < allCardIds.length - 1) {
      window.location.href = `/cards/${allCardIds[currentIndex + 1]}`;
    }
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevCard} 
            className="text-white hover:bg-gray-800"
            disabled={currentIndex <= 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
            <img
              src={validImageUrl}
              alt={currentCard.title || "Card"}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                console.error('FullscreenViewer: Failed to load image:', validImageUrl);
                if (validImageUrl !== FALLBACK_IMAGE) {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }
              }}
              onLoad={() => console.log('FullscreenViewer: Image loaded successfully:', validImageUrl)}
            />
          </div>
        </div>
        
        <div className="absolute right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextCard} 
            className="text-white hover:bg-gray-800"
            disabled={currentIndex >= allCardIds.length - 1}
          >
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
