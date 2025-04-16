
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
  // Use an array of expanded effects instead of just one
  const [expandedEffects, setExpandedEffects] = useState<string[]>([]);
  const [localIntensities, setLocalIntensities] = useState<Record<string, number>>({
    Holographic: effectIntensities.Holographic || 0.7,
    Refractor: effectIntensities.Refractor || 0.8,
    Chrome: effectIntensities.Chrome || 0.6,
    Vintage: effectIntensities.Vintage || 0.5,
  });
  
  // Debug logging
  console.log("CardEffectsPanel rendered with:", { activeEffects, effectIntensities });
  
  // Sync with external intensities when they change
  useEffect(() => {
    console.log("Effect intensities updated:", effectIntensities);
    setLocalIntensities(prev => ({
      ...prev,
      ...effectIntensities
    }));
  }, [effectIntensities]);

  const availableEffects = [
    { id: 'Holographic', name: 'Holographic', icon: <Sparkles size={18} />, color: 'bg-purple-600' },
    { id: 'Refractor', name: 'Refractor', icon: <Palette size={18} />, color: 'bg-blue-600' },
    { id: 'Chrome', name: 'Chrome', icon: <Layers size={18} />, color: 'bg-cyan-600' },
    { id: 'Vintage', name: 'Vintage', icon: <ToggleLeft size={18} />, color: 'bg-amber-600' },
  ];

  const handleEffectToggle = (effectId: string) => {
    onToggleEffect(effectId);
    
    // If toggling on, always expand
    if (!activeEffects.includes(effectId)) {
      setExpandedEffects(prev => [...prev, effectId]);
      
      // Immediately apply the intensity through CSS variables
      if (document.documentElement) {
        document.documentElement.style.setProperty(
          `--${effectId.toLowerCase()}-intensity`, 
          localIntensities[effectId]?.toString() || '0.7'
        );
      }
    }
    
    toast.info(`${effectId} effect ${activeEffects.includes(effectId) ? 'disabled' : 'enabled'}`);
  };

  const handleIntensityChange = (effectId: string, value: number[]) => {
    const intensity = value[0];
    console.log(`Changing ${effectId} intensity to ${intensity}`);
    
    setLocalIntensities(prev => ({
      ...prev,
      [effectId]: intensity
    }));
    
    if (onEffectIntensityChange) {
      onEffectIntensityChange(effectId, intensity);
    }
    
    // Directly apply to CSS variables for immediate effect
    if (document.documentElement) {
      document.documentElement.style.setProperty(
        `--${effectId.toLowerCase()}-intensity`, 
        intensity.toString()
      );
    }
  };

  // Function to handle expand/collapse of intensity controls
  const toggleExpandEffect = (e: React.MouseEvent, effectId: string) => {
    e.stopPropagation();
    
    setExpandedEffects(prev => 
      prev.includes(effectId)
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md rounded-lg p-3 text-white max-h-[calc(100vh-32rem)] overflow-y-auto">
      <h3 className="text-sm font-medium mb-3">Visual Effects</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableEffects.map(effect => (
          <div key={effect.id} className="flex flex-col">
            <button
              className={`flex flex-col items-center justify-center aspect-square rounded-lg text-xs p-4 transition-all ${
                activeEffects.includes(effect.id)
                  ? `${effect.color} text-white shadow-lg shadow-${effect.color}/20`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => handleEffectToggle(effect.id)}
            >
              <span className="mb-2">{effect.icon}</span>
              <span className="text-center font-medium">{effect.name}</span>
              {activeEffects.includes(effect.id) && (
                <Sliders 
                  size={14} 
                  className={`mt-2 cursor-pointer ${expandedEffects.includes(effect.id) ? 'text-yellow-300' : ''}`}
                  onClick={(e) => toggleExpandEffect(e, effect.id)}
                />
              )}
            </button>
            
            {expandedEffects.includes(effect.id) && activeEffects.includes(effect.id) && (
              <div className="mt-2 px-2 py-3 bg-gray-800 rounded-md w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">Intensity</span>
                  <span className="text-xs">{localIntensities[effect.id]?.toFixed(1) || '0.7'}</span>
                </div>
                <Slider 
                  value={[localIntensities[effect.id] || 0.7]}
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
