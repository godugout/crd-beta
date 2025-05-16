import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/lib/types/cardTypes';
import { sampleCards } from '@/lib/data/sampleCards';
import { useToast } from '@/hooks/use-toast';
import { adaptCardToSchema } from '@/lib/adapters/cardAdapter';
import { createToast } from '@/types/toast';

// Define a compatibile default design metadata constant
const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  },
  cardMetadata: {
    category: 'general',
    series: 'base',
    cardType: 'standard',
  },
  marketMetadata: {
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 0,
    editionNumber: 0,
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  }
};

// Define a constant for fallback image URL
const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards, getCard } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validImageUrl, setValidImageUrl] = useState<string>('/images/card-placeholder.png');
  const { toast } = useToast();
  
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
      let foundCard = sampleCards?.find(c => c.id === cardId);
      
      // If not found in sampleCards, try the cards context
      if (!foundCard) {
        console.log('FullscreenViewer: Card not found in sampleCards, checking context');
        foundCard = getCard ? getCard(cardId) : cards.find(c => c.id === cardId);
      }
      
      if (foundCard) {
        // Ensure the card has all required properties
        const processedCard = {
          ...foundCard,
          // Ensure imageUrl is present
          imageUrl: foundCard.imageUrl || '/images/card-placeholder.png',
          thumbnailUrl: foundCard.thumbnailUrl || foundCard.imageUrl || '/images/card-placeholder.png',
          // Ensure all required fields are present
          description: foundCard.description || '',  // Set default empty string
          designMetadata: foundCard.designMetadata ? {
            ...foundCard.designMetadata,
            marketMetadata: {
              ...DEFAULT_DESIGN_METADATA.marketMetadata,
              ...(foundCard.designMetadata.marketMetadata || {})
            }
          } : DEFAULT_DESIGN_METADATA,
          createdAt: foundCard.createdAt || new Date().toISOString(),
          updatedAt: foundCard.updatedAt || new Date().toISOString(),
          userId: foundCard.userId || 'anonymous',
          effects: foundCard.effects || [],
          tags: foundCard.tags || []  // Ensure tags are present
        };
        
        // Always initialize with fallback first, then update if the real image loads
        setValidImageUrl('/images/card-placeholder.png');
        
        if (processedCard.imageUrl && 
            processedCard.imageUrl !== 'undefined' && 
            typeof processedCard.imageUrl === 'string') {
          // Validate the image URL by preloading it
          const img = new Image();
          img.onload = () => {
            console.log('FullscreenViewer: Image validated successfully:', processedCard.imageUrl);
            setValidImageUrl(processedCard.imageUrl || '/images/card-placeholder.png');
            setCurrentCard(processedCard as Card);
            setIsLoading(false);
          };
          img.onerror = () => {
            console.warn('FullscreenViewer: Image validation failed, using fallback');
            setValidImageUrl('/images/card-placeholder.png');
            processedCard.imageUrl = '/images/card-placeholder.png';
            processedCard.thumbnailUrl = '/images/card-placeholder.png';
            setCurrentCard(processedCard as Card);
            setIsLoading(false);
            toast(createToast({
              title: "Image Error",
              description: "Could not load the card image. Using a fallback image instead.",
              variant: "destructive"
            }));
          };
          img.src = processedCard.imageUrl;
        } else {
          console.warn('FullscreenViewer: Card has invalid imageUrl, using fallback');
          processedCard.imageUrl = '/images/card-placeholder.png';
          processedCard.thumbnailUrl = '/images/card-placeholder.png';
          setCurrentCard(processedCard as Card);
          setIsLoading(false);
        }
      } else {
        console.error('FullscreenViewer: Card not found with ID:', cardId);
        setError(`Card with ID ${cardId} not found`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('FullscreenViewer: Error loading card:', err);
      setError('Failed to load card');
      setIsLoading(false);
    }
  }, [cardId, cards, getCard, toast]);
  
  // Find all card indices from cards array to enable navigation between cards
  const allCardIds = cards?.map(card => card.id) || [];
  const currentIndex = allCardIds.indexOf(cardId);
  
  // Handle previous/next card navigation
  const handlePrevCard = () => {
    if (currentIndex > 0) {
      const prevCardId = allCardIds[currentIndex - 1];
      setCurrentCard(null);
      setIsLoading(true);
      // Use the same component but update the cardId prop
      setTimeout(() => {
        window.location.hash = `/cards/${prevCardId}`;
      }, 50);
    }
  };
  
  const handleNextCard = () => {
    if (currentIndex < allCardIds.length - 1) {
      const nextCardId = allCardIds[currentIndex + 1];
      setCurrentCard(null);
      setIsLoading(true);
      // Use the same component but update the cardId prop
      setTimeout(() => {
        window.location.hash = `/cards/${nextCardId}`;
      }, 50);
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
                if (validImageUrl !== '/images/card-placeholder.png') {
                  e.currentTarget.src = '/images/card-placeholder.png';
                }
              }}
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
