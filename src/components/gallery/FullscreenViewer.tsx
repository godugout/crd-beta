
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/lib/types';
import { useCards } from '@/context/CardContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adaptCard } from '@/lib/adapters/typeAdapters';

interface FullscreenViewerProps {
  onClose?: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const { cards, getCardById } = useCards();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        // Use the type adapter to ensure compatibility
        const adaptedCard = adaptCard(foundCard);
        setCurrentCard(adaptedCard);
        
        // Find the index of the card in the cards array
        const index = cards.findIndex(card => card.id === id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } else {
        console.error(`Card with ID ${id} not found`);
        handleClose();
      }
    }
  }, [id, getCardById, cards]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevCard = cards[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      
      // Use the type adapter to ensure compatibility
      const adaptedCard = adaptCard(prevCard);
      setCurrentCard(adaptedCard);
      
      // Update URL without triggering a new page load
      window.history.replaceState(null, '', `/cards/${prevCard.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      const nextCard = cards[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      
      // Use the type adapter to ensure compatibility
      const adaptedCard = adaptCard(nextCard);
      setCurrentCard(adaptedCard);
      
      // Update URL without triggering a new page load
      window.history.replaceState(null, '', `/cards/${nextCard.id}`);
    }
  };

  if (!currentCard) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-white text-lg font-medium">{currentCard.title}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/10">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {/* Navigation buttons */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="absolute left-4 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        
        {/* Card image */}
        <div className="max-h-[80vh] max-w-[80vw]">
          <img 
            src={currentCard.imageUrl} 
            alt={currentCard.title} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="absolute right-4 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
      
      {/* Footer */}
      <div className="p-4 text-white">
        <p className="text-sm opacity-70">
          {currentIndex + 1} of {cards.length}
        </p>
      </div>
    </div>
  );
};

export default FullscreenViewer;
