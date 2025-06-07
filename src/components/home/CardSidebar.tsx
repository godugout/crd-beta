
import React from 'react';
import { CardData } from '@/lib/types/CardData';
import CardItem from './CardItem';
import { Clock } from 'lucide-react';
import CardEffectController from './CardEffectController';

interface CardSidebarProps {
  cardData: CardData[];
  activeCard: number;
  onSelectCard: (index: number) => void;
  activeEffects: string[];
  toggleEffect: (effect: string) => void;
  snapshots: { id: number, timestamp: Date, effects: string[] }[];
  onSelectSnapshot: (snapshotId: number) => void;
  onClearEffects: () => void;
  onSaveSnapshot?: () => void;
  effectIntensity?: Record<string, number>;
  onEffectIntensityChange?: (effect: string, value: number) => void;
}

const CardSidebar = ({ 
  cardData, 
  activeCard, 
  onSelectCard,
  activeEffects,
  toggleEffect,
  snapshots,
  onSelectSnapshot,
  onClearEffects,
  onSaveSnapshot = () => {},
  effectIntensity = {},
  onEffectIntensityChange
}: CardSidebarProps) => {
  return (
    <div className="w-full lg:w-1/3 p-4 mt-6 lg:mt-0 lg:ml-6 space-y-6">
      {/* Card selection section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-4">Collection</h3>
        
        <div className="space-y-3">
          {cardData.map((card, index) => (
            <CardItem 
              key={card.id}
              card={card}
              isActive={activeCard === index}
              onClick={() => onSelectCard(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Card effects controller - new component */}
      <CardEffectController 
        activeEffects={activeEffects}
        toggleEffect={toggleEffect}
        clearEffects={onClearEffects}
        onSaveSnapshot={onSaveSnapshot}
        effectIntensity={effectIntensity}
        onEffectIntensityChange={onEffectIntensityChange}
      />

      {/* Snapshots section */}
      {snapshots.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Saved Combinations</h3>
          
          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <button 
                key={snapshot.id}
                className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-center"
                onClick={() => onSelectSnapshot(snapshot.id)}
              >
                <span className="mr-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {snapshot.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {snapshot.effects.length > 0 
                      ? `${snapshot.effects.length} effect${snapshot.effects.length !== 1 ? 's' : ''}` 
                      : 'No effects'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Pro tip section */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-bold text-md mb-2">Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Apply multiple effects at once for unique combinations. Use the camera button to save snapshots of your favorite combinations!
        </p>
      </div>
    </div>
  );
};

export default CardSidebar;
