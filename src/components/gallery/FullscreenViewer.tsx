
import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import CardViewer from '@/components/home/CardViewer';
import { CardData } from '@/types/card';
import { toast } from 'sonner';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(['Refractor']);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      // Find the index of the card in the collection
      const index = cards.findIndex(c => c.id === cardId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }

    // Add key event listeners to close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        navigateToNext();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Enter fullscreen mode if available
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen()
        .catch(err => {
          console.warn('Error attempting to enable fullscreen:', err);
        });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      // Exit fullscreen when component unmounts if we're in fullscreen mode
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch(err => {
            console.warn('Error attempting to exit fullscreen:', err);
          });
      }
    };
  }, [cardId, cards, onClose]);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const navigateToNext = () => {
    if (currentIndex < cards.length - 1) {
      const nextCard = cards[currentIndex + 1];
      setSelectedCard(nextCard);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to the first card
      const firstCard = cards[0];
      setSelectedCard(firstCard);
      setCurrentIndex(0);
    }
  };

  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      const prevCard = cards[currentIndex - 1];
      setSelectedCard(prevCard);
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to the last card
      const lastCard = cards[cards.length - 1];
      setSelectedCard(lastCard);
      setCurrentIndex(cards.length - 1);
    }
  };

  const takeScreenshot = () => {
    // This is just a placeholder - in a real app you would use 
    // something like html2canvas to capture the card
    toast.success('Screenshot saved to your gallery', {
      description: 'Card image has been saved with current effects'
    });
  };

  const toggleEffect = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
    
    toast.success(
      activeEffects.includes(effect) 
        ? `${effect} effect removed` 
        : `${effect} effect applied`
    );
  };

  // Convert the card to the format expected by CardViewer
  const convertToCardData = (card: Card): CardData => {
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
      textColor: '#fff'
    };
  };

  if (!selectedCard) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="h-screen w-screen flex items-center justify-center">
        {/* Navigation buttons */}
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

      {/* Bottom control bar */}
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

      {/* Effects toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {['Refractor', 'Holographic', 'Shimmer', 'Vintage'].map(effect => (
          <Button
            key={effect}
            variant={activeEffects.includes(effect) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleEffect(effect)}
            className={activeEffects.includes(effect) 
              ? "bg-cardshow-blue text-white" 
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
          >
            {effect}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FullscreenViewer;
