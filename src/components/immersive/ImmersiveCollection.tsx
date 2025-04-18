
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/lib/types';
import RealisticCardViewer from '../immersive-viewer/RealisticCardViewer';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImmersiveCollectionProps {
  cards: Card[];
  initialCardIndex?: number;
}

const ImmersiveCollection: React.FC<ImmersiveCollectionProps> = ({
  cards,
  initialCardIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialCardIndex);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const navigate = useNavigate();

  const currentCard = cards[currentIndex];

  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white">No cards available</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="absolute inset-y-0 left-4 flex items-center z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={goToPreviousCard}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={goToNextCard}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="h-full">
        <RealisticCardViewer
          card={currentCard}
          isCustomizationOpen={isCustomizationOpen}
          onToggleCustomization={() => setIsCustomizationOpen(!isCustomizationOpen)}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        Card {currentIndex + 1} of {cards.length}
      </div>
    </div>
  );
};

export default ImmersiveCollection;
