
import React from 'react';
import { CardData } from '@/types/card';
import CardItem from './CardItem';
import { Sparkles, Flame, PaintBucket, Zap, Clock } from 'lucide-react';

interface CardSidebarProps {
  cardData: CardData[];
  activeCard: number;
  onSelectCard: (index: number) => void;
  activeEffects: string[];
  toggleEffect: (effect: string) => void;
  snapshots: { id: number, timestamp: Date, effects: string[] }[];
  onSelectSnapshot: (snapshotId: number) => void;
}

const CardSidebar = ({ 
  cardData, 
  activeCard, 
  onSelectCard,
  activeEffects,
  toggleEffect,
  snapshots,
  onSelectSnapshot
}: CardSidebarProps) => {
  const effectOptions = [
    { name: 'Classic Holographic', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Refractor', icon: <Flame className="h-4 w-4" /> },
    { name: 'Prismatic', icon: <PaintBucket className="h-4 w-4" /> },
    { name: 'Electric', icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <div className="w-full lg:w-1/3 bg-gray-50 p-4 mt-6 lg:mt-0 lg:ml-6 rounded-lg">
      <h3 className="font-bold text-lg mb-4">More Cards</h3>
      
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
      
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Effect Options</h3>
        
        <div className="space-y-2">
          {effectOptions.map((effect, index) => (
            <button 
              key={index}
              className={`w-full text-left px-4 py-2 rounded-lg border transition flex items-center
                ${activeEffects.includes(effect.name) 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              onClick={() => toggleEffect(effect.name)}
            >
              <span className={`mr-2 ${activeEffects.includes(effect.name) ? 'text-blue-500' : 'text-gray-400'}`}>
                {effect.icon}
              </span>
              {effect.name}
            </button>
          ))}
        </div>
      </div>

      {snapshots.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Snapshots</h3>
          
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
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-bold text-md mb-2">Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Apply multiple effects at once for unique combinations. Use the camera button to save snapshots of your favorite combinations!
        </p>
      </div>
    </div>
  );
};

export default CardSidebar;
