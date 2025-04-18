
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import CardInteractive from '@/components/card-viewer/CardInteractive';
import EffectsPanel from '@/components/card-effects/EffectsPanel';
import { useCardEffects } from '@/hooks/useCardEffects';

interface CardEffectsGalleryProps {
  card: Card;
}

const CardEffectsGallery: React.FC<CardEffectsGalleryProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { 
    availableEffects,
    activeEffects,
    effectIntensities,
    toggleEffect,
    adjustEffectIntensity
  } = useCardEffects();
  
  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3 aspect-[3/4] max-h-[70vh]">
        <CardInteractive
          card={card}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>
      
      <div className="w-full md:w-1/3">
        <EffectsPanel
          availableEffects={availableEffects}
          activeEffects={activeEffects}
          onToggleEffect={toggleEffect}
          effectIntensities={effectIntensities}
          onAdjustIntensity={adjustEffectIntensity}
        />
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Card Details</h3>
          <dl className="divide-y divide-gray-200">
            <div className="py-2 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{card.title}</dd>
            </div>
            {card.player && (
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Player</dt>
                <dd className="text-sm text-gray-900">{card.player}</dd>
              </div>
            )}
            {card.team && (
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Team</dt>
                <dd className="text-sm text-gray-900">{card.team}</dd>
              </div>
            )}
            {card.year && (
              <div className="py-2 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd className="text-sm text-gray-900">{card.year}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CardEffectsGallery;
