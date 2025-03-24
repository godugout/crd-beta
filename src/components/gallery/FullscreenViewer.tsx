
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/context/CardContext';
import { Card } from '@/lib/types';
import CardViewer from '@/components/home/CardViewer';
import { CardData } from '@/types/card';

interface FullscreenViewerProps {
  cardId: string;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ cardId, onClose }) => {
  const { cards } = useCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(['Refractor']);

  useEffect(() => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
    }

    // Add key event listeners to close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
        <div className="w-full max-w-5xl">
          <CardViewer
            card={convertToCardData(selectedCard)}
            isFlipped={isFlipped}
            flipCard={toggleFlip}
            onBackToCollection={onClose}
            activeEffects={activeEffects}
            onSnapshot={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default FullscreenViewer;
