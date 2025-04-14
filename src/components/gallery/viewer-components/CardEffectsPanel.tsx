
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { Sparkles, Layers, Palette, ToggleLeft, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

interface CardEffectsPanelProps {
  activeEffects: string[];
  onToggleEffect: (effect: string) => void;
  onEffectIntensityChange?: (effect: string, intensity: number) => void;
  effectIntensities?: Record<string, number>;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  activeEffects,
  onToggleEffect,
  onEffectIntensityChange,
  effectIntensities = {}
}) => {
  const [expandedEffect, setExpandedEffect] = useState<string | null>(null);
  const [localIntensities, setLocalIntensities] = useState<Record<string, number>>({
    Holographic: effectIntensities.Holographic || 0.7,
    Refractor: effectIntensities.Refractor || 0.8,
    Chrome: effectIntensities.Chrome || 0.6,
    Vintage: effectIntensities.Vintage || 0.5,
  });
  
  // Sync with external intensities when they change
  useEffect(() => {
    setLocalIntensities(prev => ({
      ...prev,
      ...effectIntensities
    }));
  }, [effectIntensities]);

  const availableEffects = [
    { id: 'Holographic', name: 'Holographic', icon: <Sparkles size={18} /> },
    { id: 'Refractor', name: 'Refractor', icon: <Palette size={18} /> },
    { id: 'Chrome', name: 'Chrome', icon: <Layers size={18} /> },
    { id: 'Vintage', name: 'Vintage', icon: <ToggleLeft size={18} /> },
  ];

  const handleEffectToggle = (effectId: string) => {
    onToggleEffect(effectId);
    
    // If we're enabling an effect, expand its intensity controls
    if (!activeEffects.includes(effectId)) {
      setExpandedEffect(effectId);
    } else {
      // Only collapse if this was the expanded effect
      if (expandedEffect === effectId) {
        setExpandedEffect(null);
      }
    }
    
    toast.info(`${effectId} effect ${activeEffects.includes(effectId) ? 'disabled' : 'enabled'}`);
  };

  const handleIntensityChange = (effectId: string, value: number[]) => {
    const intensity = value[0];
    setLocalIntensities(prev => ({
      ...prev,
      [effectId]: intensity
    }));
    
    if (onEffectIntensityChange) {
      onEffectIntensityChange(effectId, intensity);
    }
  };

  // Function to handle expand/collapse of intensity controls
  const toggleExpandEffect = (e: React.MouseEvent, effectId: string) => {
    e.stopPropagation();
    setExpandedEffect(expandedEffect === effectId ? null : effectId);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md rounded-lg p-3 text-white">
      <h3 className="text-sm font-medium mb-2">Visual Effects</h3>
      <div className="flex flex-wrap gap-2">
        {availableEffects.map(effect => (
          <div key={effect.id} className="flex flex-col">
            <button
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
                activeEffects.includes(effect.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => handleEffectToggle(effect.id)}
            >
              <span>{effect.icon}</span>
              <span>{effect.name}</span>
              {activeEffects.includes(effect.id) && (
                <Sliders 
                  size={14} 
                  className="ml-1 cursor-pointer" 
                  onClick={(e) => toggleExpandEffect(e, effect.id)}
                />
              )}
            </button>
            
            {expandedEffect === effect.id && activeEffects.includes(effect.id) && (
              <div className="mt-2 px-2 py-1 bg-gray-800 rounded-md w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">Intensity</span>
                  <span className="text-xs">{localIntensities[effect.id].toFixed(1)}</span>
                </div>
                <Slider 
                  value={[localIntensities[effect.id]]}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                  onValueChange={(value) => handleIntensityChange(effect.id, value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEffectsPanel;
