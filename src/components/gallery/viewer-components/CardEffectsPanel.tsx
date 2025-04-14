
import React from 'react';
import { Card } from '@/lib/types';
import { Sparkles, Layers, Palette, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CardEffectsPanelProps {
  activeEffects: string[];
  onToggleEffect: (effect: string) => void;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  activeEffects,
  onToggleEffect,
}) => {
  const availableEffects = [
    { id: 'Holographic', name: 'Holographic', icon: <Sparkles size={18} /> },
    { id: 'Refractor', name: 'Refractor', icon: <Palette size={18} /> },
    { id: 'Chrome', name: 'Chrome', icon: <Layers size={18} /> },
    { id: 'Vintage', name: 'Vintage', icon: <ToggleLeft size={18} /> },
  ];

  const handleEffectToggle = (effectId: string) => {
    onToggleEffect(effectId);
    toast.info(`${effectId} effect ${activeEffects.includes(effectId) ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white">
      <h3 className="text-sm font-medium mb-2">Visual Effects</h3>
      <div className="flex flex-wrap gap-2">
        {availableEffects.map(effect => (
          <button
            key={effect.id}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
              activeEffects.includes(effect.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => handleEffectToggle(effect.id)}
          >
            <span>{effect.icon}</span>
            <span>{effect.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardEffectsPanel;
