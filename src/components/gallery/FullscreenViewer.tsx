import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import CardViewer from '@/components/home/CardViewer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useCardEffects } from '@/hooks/useCardEffects';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { shouldOptimizeAnimations } = useMobileOptimization();
  
  const currentCardIdRef = useRef<string>(cardId);
  
  const preloadImagesRef = useRef<HTMLDivElement>(null);
  
  const { 
    cardEffects, 
    toggleEffect, 
    setCardEffects
  } = useCardEffects(
    cards, 
    shouldOptimizeAnimations,
    { initialEffects: { [cardId]: ['Refractor'] } }
  );
  
  const activeEffects = selectedCard ? (cardEffects[selectedCard.id] || []) : [];

  useEffect(() => {
    currentCardIdRef.current = cardId;
    
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      const index = cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen()
        .catch(err => {
          console.warn('Error attempting to enable fullscreen:', err);
        });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch(err => {
            console.warn('Error attempting to exit fullscreen:', err);
          });
      }
    };
  }, [cardId, cards, onClose]);

  useKeyboardShortcut('ArrowLeft', navigateToPrevious);
  useKeyboardShortcut('ArrowRight', navigateToNext);
  useKeyboardShortcut(' ', toggleFlip);

  useEffect(() => {
    if (cards.length <= 1 || !preloadImagesRef.current) return;
    
    const preloadContainer = preloadImagesRef.current;
    preloadContainer.innerHTML = '';
    
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    const nextIndex = (currentIndex + 1) % cards.length;
    
    [prevIndex, nextIndex].forEach(index => {
      if (index !== currentIndex && cards[index]) {
        const img = document.createElement('img');
        img.src = cards[index].imageUrl;
        img.style.display = 'none';
        preloadContainer.appendChild(img);
      }
    });
  }, [currentIndex, cards]);

  function toggleFlip() {
    setIsFlipped(!isFlipped);
  }

  function navigateToNext() {
    if (currentIndex < cards.length - 1) {
      const nextCard = cards[currentIndex + 1];
      setSelectedCard(nextCard);
      setCurrentIndex(currentIndex + 1);
    } else {
      const firstCard = cards[0];
      setSelectedCard(firstCard);
      setCurrentIndex(0);
    }
  }

  function navigateToPrevious() {
    if (currentIndex > 0) {
      const prevCard = cards[currentIndex - 1];
      setSelectedCard(prevCard);
      setCurrentIndex(currentIndex - 1);
    } else {
      const lastCard = cards[cards.length - 1];
      setSelectedCard(lastCard);
      setCurrentIndex(cards.length - 1);
    }
  }

  const takeScreenshot = () => {
    toast.success('Screenshot saved to your gallery', {
      description: 'Card image has been saved with current effects'
    });
  };

  const handleToggleEffect = useCallback((effect: string) => {
    if (selectedCard) {
      toggleEffect(selectedCard.id, effect);
    }
  }, [selectedCard, toggleEffect]);

  const convertToCardData = useCallback((card: Card): CardData => {
    return {
      id: parseInt(card.id),
      name: card.title,
      imageUrl: card.imageUrl,
      description: card.description,
      team: card.tags?.[0] || '',
      year: new Date(card.createdAt).getFullYear().toString(),
      cardType: card.tags?.[1] || 'Standard',
      artist: card.userId || 'Unknown',
      set: card.collectionId || 'Personal Collection',
      cardNumber: card.id.slice(0, 6),
      specialEffect: activeEffects[0] || 'Standard',
      jersey: '',
      backgroundColor: '#000',
      textColor: '#fff',
      fabricSwatches: card.designMetadata?.cardStyle?.fabricSwatches || []
    };
  }, [activeEffects]);

  if (!selectedCard) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-white rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div ref={preloadImagesRef} className="hidden"></div>
      
      <ErrorBoundary>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="h-screen w-screen flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToPrevious}
            className="absolute left-4 md:left-8 text-white hover:bg-white/10 h-12 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToNext}
            className="absolute right-4 md:right-8 text-white hover:bg-white/10 h-12 w-12"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="w-full max-w-5xl">
            <CardViewer
              card={convertToCardData(selectedCard)}
              isFlipped={isFlipped}
              flipCard={toggleFlip}
              onBackToCollection={onClose}
              activeEffects={activeEffects}
              onSnapshot={takeScreenshot}
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="container mx-auto max-w-5xl flex justify-between items-center">
            <div className="text-white">
              <h3 className="font-medium">{selectedCard.title}</h3>
              <p className="text-sm text-gray-300">
                {currentIndex + 1} of {cards.length}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={toggleFlip}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Flip
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={takeScreenshot}
              >
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {['Refractor', 'Holographic', 'Shimmer', 'Vintage'].map(effect => (
            <Button
              key={effect}
              variant={activeEffects.includes(effect) ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleEffect(effect)}
              className={activeEffects.includes(effect) 
                ? "bg-cardshow-blue text-white" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              {effect}
            </Button>
          ))}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default FullscreenViewer;
