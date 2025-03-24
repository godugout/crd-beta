
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import CameraView from './CameraView';
import ArControls from './ArControls';

interface ArModeViewProps {
  activeCards: Card[];
  availableCards: Card[];
  onExitAr: () => void;
  onCameraError: (message: string) => void;
  onTakeSnapshot: () => void;
  onFlip: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

const ArModeView: React.FC<ArModeViewProps> = ({
  activeCards,
  availableCards,
  onExitAr,
  onCameraError,
  onTakeSnapshot,
  onFlip,
  onZoomIn,
  onZoomOut,
  onRotate
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    activeCards.length > 0 ? activeCards[0].id : null
  );
  const [showCardSelector, setShowCardSelector] = useState(false);

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
  };

  const handleAddCard = (card: Card) => {
    // If the card is already in the scene, don't add it again
    if (activeCards.some(c => c.id === card.id)) {
      toast.info('Card already in scene');
      return;
    }
    
    // This is just a notification - the actual adding happens in the parent component
    toast.success('Card added to scene');
    setShowCardSelector(false);
    setSelectedCardId(card.id);
  };

  const handleRemoveSelected = () => {
    if (!selectedCardId) return;
    
    // This is just a notification - the actual removal happens in the parent component
    toast.success('Card removed from scene');
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* AR Camera View */}
      <CameraView 
        activeCards={activeCards}
        selectedCardId={selectedCardId}
        onSelectCard={handleSelectCard}
        onError={onCameraError}
      />
      
      {/* AR Controls */}
      <ArControls
        onTakeSnapshot={onTakeSnapshot}
        onFlip={onFlip}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotate={onRotate}
      />
      
      {/* Add/Remove Card Buttons */}
      <div className="absolute top-16 right-4 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 text-white border-white/20"
          onClick={() => setShowCardSelector(!showCardSelector)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {selectedCardId && (
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-white/20"
            onClick={handleRemoveSelected}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Card Selector */}
      {showCardSelector && (
        <div className="absolute right-4 top-28 z-50 bg-white rounded-lg shadow-lg p-4 w-64 max-h-80 overflow-y-auto">
          <h3 className="font-semibold mb-3">Add Card to Scene</h3>
          <div className="space-y-2">
            {availableCards.map(card => (
              <div 
                key={card.id}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddCard(card)}
              >
                <div className="w-8 h-12 bg-gray-200 rounded overflow-hidden mr-2">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-sm truncate">{card.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Exit AR Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-50 bg-black/50 text-white border-white/20"
        onClick={onExitAr}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Exit AR
      </Button>
      
      {/* Share Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/50 text-white border-white/20"
        onClick={() => toast.success('Sharing options opened')}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ArModeView;
