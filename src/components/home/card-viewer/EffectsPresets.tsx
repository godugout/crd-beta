
import React from 'react';
import { X, Star, Plus, Heart } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  effects: string[];
  isFavorite?: boolean;
  isBuiltIn?: boolean;
  settings?: any;
}

interface EffectsPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  userPresets: Preset[];
  onApplyPreset: (preset: Preset) => void;
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
    <div className="absolute top-16 left-0 h-full max-h-[calc(100%-4rem)] w-72 bg-gray-900/95 backdrop-blur-md text-white z-30 shadow-lg transition-transform duration-300 transform-gpu overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Effect Presets</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Built-in presets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Built-in Presets</h4>
          
          <div className="space-y-2">
            {presets.map((preset) => (
              <div 
                key={preset.id}
                className="bg-gray-800/70 rounded-lg p-3 hover:bg-gray-700/70 transition-colors cursor-pointer group"
                onClick={() => onApplyPreset(preset)}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{preset.name}</h5>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(preset.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className={`h-4 w-4 ${preset.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {preset.effects.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* User presets */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Your Presets</h4>
          
          {userPresets.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-400">Save your first preset by creating a combination you like and clicking "Save"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className="bg-blue-900/20 rounded-lg p-3 hover:bg-blue-900/30 transition-colors cursor-pointer border border-blue-900/30 group"
                  onClick={() => onApplyPreset(preset)}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{preset.name}</h5>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(preset.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${preset.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {preset.effects.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Presets will be saved to your account when signed in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectsPresets;
