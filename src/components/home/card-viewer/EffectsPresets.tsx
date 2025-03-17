
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart } from 'lucide-react';

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
  };
  thumbnail: string;
  isFavorite?: boolean;
}

interface EffectsPresetsProps {
  presets: EffectPreset[];
  onApplyPreset: (preset: EffectPreset) => void;
  onToggleFavorite: (presetId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userPresets: EffectPreset[];
}

const EffectsPresets: React.FC<EffectsPresetsProps> = ({
  presets,
  onApplyPreset,
  onToggleFavorite,
  isOpen,
  onClose,
  userPresets
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-4 w-72 bg-white rounded-lg shadow-lg p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Effect Presets</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {userPresets.length > 0 && (
        <>
          <h4 className="text-xs font-medium text-gray-500 mb-2">Your Combinations</h4>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {userPresets.map((preset) => (
              <PresetCard 
                key={preset.id} 
                preset={preset} 
                onApply={() => onApplyPreset(preset)} 
                onToggleFavorite={() => onToggleFavorite(preset.id)}
                isUserPreset
              />
            ))}
          </div>
        </>
      )}

      <h4 className="text-xs font-medium text-gray-500 mb-2">Built-in Presets</h4>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <PresetCard 
            key={preset.id} 
            preset={preset} 
            onApply={() => onApplyPreset(preset)} 
            onToggleFavorite={() => onToggleFavorite(preset.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface PresetCardProps {
  preset: EffectPreset;
  onApply: () => void;
  onToggleFavorite: () => void;
  isUserPreset?: boolean;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, onApply, onToggleFavorite, isUserPreset }) => {
  return (
    <Card className="p-3 relative hover:shadow-md transition-shadow">
      <div className="flex space-x-3">
        <div 
          className="w-12 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0"
          style={{
            backgroundImage: `url(${preset.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!preset.thumbnail && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium truncate pr-6">{preset.name}</h3>
            <button 
              onClick={onToggleFavorite} 
              className={`absolute top-2 right-2 text-gray-400 hover:text-red-500 ${preset.isFavorite ? 'text-red-500' : ''}`}
            >
              <Heart className="h-4 w-4" fill={preset.isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5 line-clamp-1">{preset.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {preset.effects.slice(0, 2).map((effect, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5">
                {effect}
              </Badge>
            ))}
            {preset.effects.length > 2 && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                +{preset.effects.length - 2}
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={onApply} 
            variant="secondary" 
            className="w-full h-7 text-xs py-0"
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EffectsPresets;
