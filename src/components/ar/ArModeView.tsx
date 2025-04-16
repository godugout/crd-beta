import React from 'react';
import { Card } from '@/lib/types';
import { X, Camera, RotateCw, ZoomIn, ZoomOut, Flip } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArModeViewProps {
  activeCards: Card[];
  availableCards: Card[];
  onExitAr: () => void;
  onCameraError: (error: string) => void;
  onTakeSnapshot: () => void;
  onFlip: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onAddCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
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
  onRotate,
  onAddCard,
  onRemoveCard
}) => {
  // Mock AR view for development
  React.useEffect(() => {
    // Simulate AR initialization
    console.log('Initializing AR view with cards:', activeCards);
    
    // Simulate potential camera error
    const hasError = false; // Set to true to test error handling
    if (hasError) {
      onCameraError('Failed to access camera. Please check permissions.');
    }
    
    return () => {
      console.log('Cleaning up AR resources');
    };
  }, [activeCards, onCameraError]);

  const handleEffectActivate = () => {
    // Add glow effect instead of explosion
    const cardElement = document.querySelector('.card-container');
    if (cardElement) {
      cardElement.classList.add('effect-glow');
      setTimeout(() => {
        cardElement.classList.remove('effect-glow');
      }, 1500); // Match animation duration
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Mock camera feed */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center max-w-md px-6">
          <Camera size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">AR Mode</h2>
          <p className="text-gray-400 mb-6">
            This is a placeholder for the AR camera view. 
            In a production app, this would show a live camera feed with AR content.
          </p>
          
          {activeCards.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {activeCards.map(card => (
                <div key={card.id} className="relative bg-gray-800 rounded p-2 w-24">
                  <button 
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    onClick={() => onRemoveCard(card.id)}
                  >
                    <X size={12} />
                  </button>
                  <div className="h-20 bg-gray-700 rounded mb-2 flex items-center justify-center">
                    {card.thumbnailUrl ? (
                      <img 
                        src={card.thumbnailUrl} 
                        alt={card.title} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">{card.title}</div>
                    )}
                  </div>
                  <div className="text-xs truncate">{card.title}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={onFlip}>
              <Flip size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={onZoomIn}>
              <ZoomIn size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={onZoomOut}>
              <ZoomOut size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={onRotate}>
              <RotateCw size={18} />
            </Button>
            <Button variant="default" onClick={onTakeSnapshot}>
              <Camera size={18} className="mr-2" /> Snapshot
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-between items-center">
          <Button variant="destructive" onClick={onExitAr}>
            <X size={18} className="mr-2" />
            Exit AR
          </Button>
          
          {availableCards.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 max-w-[70%]">
              {availableCards.slice(0, 5).map(card => (
                <button 
                  key={card.id}
                  className="bg-gray-800 rounded p-1 w-16 flex flex-col items-center"
                  onClick={() => onAddCard(card.id)}
                >
                  <div className="h-12 w-12 bg-gray-700 rounded mb-1 flex items-center justify-center">
                    {card.thumbnailUrl ? (
                      <img 
                        src={card.thumbnailUrl} 
                        alt={card.title} 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">{card.title.substring(0, 5)}...</div>
                    )}
                  </div>
                  <div className="text-xs text-white truncate w-full text-center">
                    {card.title.length > 8 ? card.title.substring(0, 8) + '...' : card.title}
                  </div>
                </button>
              ))}
              {availableCards.length > 5 && (
                <div className="text-xs text-gray-400 flex items-center px-2">
                  +{availableCards.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArModeView;
