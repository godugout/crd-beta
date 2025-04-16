import React, { useState } from 'react';
import { Card } from '@/lib/types';
import CardEffectsPanel from '@/components/immersive-viewer/CardEffectsPanel';

interface CardDetailPanelProps {
  card: Card;
  availableEffects?: any[];
  activeEffects?: string[];
  onToggleEffect?: (effectId: string) => void;
  effectIntensities?: Record<string, number>;
  onAdjustIntensity?: (effect: string, value: number) => void;
}

const CardDetailPanel: React.FC<CardDetailPanelProps> = ({
  card,
  availableEffects = [],
  activeEffects = [],
  onToggleEffect = () => {},
  effectIntensities = {},
  onAdjustIntensity = () => {}
}) => {
  const [showEffects, setShowEffects] = useState(false);
  
  // Create default intensity object if not provided
  const intensities = {
    refractor: effectIntensities.Refractor || 0.5,
    holographic: effectIntensities.Holographic || 0.5,
    shimmer: effectIntensities.Shimmer || 0.5,
    vintage: effectIntensities.Vintage || 0.5,
    gold: effectIntensities["Gold Foil"] || 0.5,
    ...effectIntensities
  };
  
  return (
    <div className="bg-gray-800 text-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
        {card.description && (
          <p className="text-gray-300">{card.description}</p>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Card Details</h3>
        <dl className="grid grid-cols-2 gap-2">
          {card.artist || (card.designMetadata?.cardMetadata?.artist) && (
            <>
              <dt className="text-gray-400">Artist</dt>
              <dd>{card.artist || card.designMetadata?.cardMetadata?.artist}</dd>
            </>
          )}
          {card.year && (
            <>
              <dt className="text-gray-400">Year</dt>
              <dd>{card.year}</dd>
            </>
          )}
          {card.set && (
            <>
              <dt className="text-gray-400">Series</dt>
              <dd>{card.set}</dd>
            </>
          )}
          {card.rarity && (
            <>
              <dt className="text-gray-400">Rarity</dt>
              <dd>{card.rarity}</dd>
            </>
          )}
          {card.tags && card.tags.length > 0 && (
            <>
              <dt className="text-gray-400">Tags</dt>
              <dd className="flex flex-wrap gap-1">
                {card.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-3">Visual Effects</h3>
        <button
          onClick={() => setShowEffects(!showEffects)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {showEffects ? 'Hide Effects' : 'Show Effects'}
        </button>
      </div>
      
      {showEffects && (
        <CardEffectsPanel 
          activeEffects={activeEffects}
          onToggleEffect={onToggleEffect}
          effectIntensity={intensities}
          onEffectIntensityChange={onAdjustIntensity}
          onClose={() => setShowEffects(false)}
        />
      )}
    </div>
  );
};

export default CardDetailPanel;
