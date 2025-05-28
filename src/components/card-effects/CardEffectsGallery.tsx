
import React, { useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import CardInteractive from '@/components/card-viewer/CardInteractive';
import EffectsPanel from '@/components/card-viewer/panels/EffectsPanel';
import { useCardEffects } from '@/hooks/useCardEffects';

interface CardEffectsGalleryProps {
  card: Card;
}

// Local interface that matches what EffectsPanel expects
interface CardEffect {
  id: string;
  name: string;
  active: boolean;
  intensity: number;
  hue?: number;
  saturation?: number;
}

const CardEffectsGallery: React.FC<CardEffectsGalleryProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Use the hook that returns the card effects management functions
  const { 
    effects,
    updateEffectProperty,
    updateEffectIntensity
  } = useCardEffects();
  
  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };
  
  // Transform the effects from the hook to match the expected interface
  const transformedEffects: CardEffect[] = effects.map(effect => ({
    id: effect.id,
    name: effect.name,
    active: effect.active,
    intensity: effect.intensity,
    hue: effect.hue,
    saturation: effect.saturation
  }));
  
  // Get active effects from the transformed effects array
  const activeEffects = transformedEffects.filter(effect => effect.active).map(effect => effect.id);
  
  // Generate an object with effect intensities from the transformed effects array
  const effectIntensities = transformedEffects.reduce((acc, effect) => {
    acc[effect.id] = effect.intensity || 0.7;
    return acc;
  }, {} as Record<string, number>);
  
  // Wrapper functions to handle the interface differences
  const handleToggleEffect = (effectId: string) => {
    const effect = effects.find(e => e.id === effectId);
    if (effect) {
      updateEffectProperty(effectId, 'active', !effect.active);
    }
  };
  
  const handleUpdateIntensity = (effectId: string, intensity: number) => {
    updateEffectIntensity(effectId, intensity);
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
          effects={transformedEffects}
          onToggleEffect={handleToggleEffect}
          onUpdateIntensity={handleUpdateIntensity}
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
