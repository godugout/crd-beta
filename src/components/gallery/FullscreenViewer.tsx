
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCards } from '@/hooks/useCards';
import { Card } from '@/lib/types/card';
import { CardViewer } from '@/components/card-viewer/CardViewer';

export interface FullscreenViewerProps {
  card: Card;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ card, onClose }) => {
  const [activeEffects, setActiveEffects] = useState<string[]>(card.effects || []);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          className="h-10 w-10 rounded-full p-0 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {card ? (
          <CardViewer 
            card={card} 
            isFlipped={false}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            showLightingControls={true}
          />
        ) : (
          <div className="text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Card not found</h2>
            <p>The requested card could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenViewer;
