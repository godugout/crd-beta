
import React from 'react';
import { X, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

// Define and export the EffectPreset type
export interface EffectPreset {
  id: string;
  name: string;
  description: string;
  effects: string[];
  settings: {
    motionSpeed: number;
    pulseIntensity: number;
    shimmerSpeed: number;
    goldIntensity: number;
    chromeIntensity: number;
    vintageIntensity: number;
    refractorIntensity?: number;
    spectralIntensity?: number;
  };
  thumbnail?: string;
  isFavorite?: boolean;
}

interface EffectsPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  presets: EffectPreset[];
  userPresets: EffectPreset[];
  onApplyPreset: (preset: EffectPreset) => void;
  onToggleFavorite: (presetId: string) => void;
}

const EffectsPresets: React.FC<EffectsPresetsProps> = ({
  isOpen,
  onClose,
  presets,
  userPresets,
  onApplyPreset,
  onToggleFavorite
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 right-0 h-full max-h-[calc(100%-4rem)] w-80 bg-gray-900/95 backdrop-blur-md text-white z-30 shadow-lg transition-transform duration-300 transform-gpu overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Effects Presets</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)] pr-3">
          {userPresets.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Your Presets</h4>
              <div className="space-y-2">
                {userPresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    onApply={onApplyPreset}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Standard Presets</h4>
            <div className="space-y-2">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onApply={onApplyPreset}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface PresetCardProps {
  preset: EffectPreset;
  onApply: (preset: EffectPreset) => void;
  onToggleFavorite: (presetId: string) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, onApply, onToggleFavorite }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-start">
        {preset.thumbnail && (
          <div className="w-16 h-16 bg-gray-700">
            <img 
              src={preset.thumbnail} 
              alt={preset.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-medium text-white">{preset.name}</h5>
              <p className="text-xs text-gray-400 mt-0.5">{preset.description}</p>
            </div>
            <button
              onClick={() => onToggleFavorite(preset.id)}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <Star size={16} fill={preset.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {preset.effects.map((effect, idx) => (
              <span 
                key={idx} 
                className="inline-block px-1.5 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded"
              >
                {effect}
              </span>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onApply(preset)}
            className="mt-2 w-full bg-blue-600/80 hover:bg-blue-600 text-white"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EffectsPresets;
