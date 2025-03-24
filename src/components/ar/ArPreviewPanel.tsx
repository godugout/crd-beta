
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/lib/types';

interface ArPreviewPanelProps {
  activeCard: Card | null;
  baseballCards: Array<{
    id: string;
    title: string;
    player: string;
    team: string;
    year: string;
    manufacturer: string;
    position: string;
    imageUrl: string;
  }>;
  cameraError: string | null;
  onLaunchAr: () => void;
}

const ArPreviewPanel: React.FC<ArPreviewPanelProps> = ({
  activeCard,
  baseballCards,
  cameraError,
  onLaunchAr
}) => {
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
          disabled={!!cameraError}
        >
          <Camera className="mr-2 h-5 w-5" />
          Launch AR Experience
        </Button>
      </div>
      
      <div className="md:w-64">
        <h3 className="font-semibold mb-4">Available Cards</h3>
        <div className="space-y-3">
          {baseballCards.map(card => (
            <Link 
              key={card.id}
              to={`/ar-card-viewer/${card.id}`}
              className={`block p-3 rounded-md border transition-colors ${
                activeCard?.id === card.id.toString() 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3">
                  <img 
                    src={card.imageUrl} 
                    alt={card.player}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{card.player}</div>
                  <div className="text-xs text-gray-500">{card.year} {card.manufacturer}</div>
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
