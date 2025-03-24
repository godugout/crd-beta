
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/lib/types';

interface ArPreviewPanelProps {
  activeCard: Card | null;
  availableCards: Card[];
  cameraError: string | null;
  onLaunchAr: () => void;
}

const ArPreviewPanel: React.FC<ArPreviewPanelProps> = ({
  activeCard,
  availableCards,
  cameraError,
  onLaunchAr
}) => {
  if (!availableCards.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No cards available. Add some cards to your collection first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col">
        <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          {activeCard ? (
            <div className="relative w-full h-full">
              <img 
                src={activeCard.imageUrl} 
                alt={activeCard.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-white">No card selected</div>
          )}
        </div>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          onClick={onLaunchAr}
          disabled={!!cameraError || !activeCard}
        >
          <Camera className="mr-2 h-5 w-5" />
          Launch AR Experience
        </Button>
      </div>
      
      <div className="md:w-64">
        <h3 className="font-semibold mb-4">Available Cards</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {availableCards.map(card => (
            <Link 
              key={card.id}
              to={`/ar-card-viewer/${card.id}`}
              className={`block p-3 rounded-md border transition-colors ${
                activeCard?.id === card.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3">
                  <img 
                    src={card.thumbnailUrl || card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{card.title}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {card.tags && card.tags.length > 0 
                      ? card.tags.slice(0, 2).join(', ') 
                      : 'No tags'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArPreviewPanel;
