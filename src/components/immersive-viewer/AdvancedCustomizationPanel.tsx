
import React from 'react';
import { Card } from '@/lib/types';
import { X, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnvironmentSelector from './EnvironmentSelector';

interface AdvancedCustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onSaveRemix: (settings: any) => void;
  activeEffects: string[];
  onEffectsChange: (effects: string[]) => void;
  effectIntensities: Record<string, number>;
  onEffectIntensityChange: (effect: string, intensity: number) => void;
  materialSettings: any;
  onMaterialChange: (changes: any) => void;
  lightingSettings: any;
  onLightingChange: (changes: any) => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const AdvancedCustomizationPanel: React.FC<AdvancedCustomizationPanelProps> = ({
  card,
  isOpen,
  onClose,
  onSaveRemix,
  activeEffects,
  onEffectsChange,
  effectIntensities,
  onEffectIntensityChange,
  materialSettings,
  onMaterialChange,
  lightingSettings,
  onLightingChange,
  environmentType,
  onEnvironmentChange
}) => {
  if (!isOpen) return null;

  const availableEffects = [
    'holographic',
    'refractor', 
    'foil',
    'chrome',
    'prismatic',
    'vintage',
    'neon',
    'galaxy'
  ];

  const handleEffectToggle = (effect: string) => {
    const newEffects = activeEffects.includes(effect)
      ? activeEffects.filter(e => e !== effect)
      : [...activeEffects, effect];
    onEffectsChange(newEffects);
  };

  const handleSaveRemix = () => {
    const remixSettings = {
      effects: activeEffects,
      effectSettings: effectIntensities,
      materialSettings,
      lightingSettings,
      environmentType
    };
    onSaveRemix(remixSettings);
  };

  const resetToDefaults = () => {
    onEffectsChange(['holographic']);
    onEffectIntensityChange('holographic', 0.7);
    onEnvironmentChange('studio');
    onMaterialChange({
      roughness: 0.2,
      metalness: 0.8,
      reflectivity: 0.5,
      clearcoat: 0.7,
      envMapIntensity: 1.0
    });
    onLightingChange({
      intensity: 1.2,
      color: '#ffffff',
      position: { x: 10, y: 10, z: 10 },
      ambientIntensity: 0.6,
      environmentType: 'studio'
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[420px] bg-gray-900/95 backdrop-blur-xl border-l border-white/10 text-white overflow-y-auto z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Customize Card</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Environment Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Environment</h3>
          <EnvironmentSelector
            environmentType={environmentType}
            onEnvironmentChange={onEnvironmentChange}
          />
        </div>

        {/* Effects Section */}
        <div>
          <h3 className="text-sm font-medium mb-3">Effects</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableEffects.map((effect) => {
              const isActive = activeEffects.includes(effect);
              return (
                <button
                  key={effect}
                  onClick={() => handleEffectToggle(effect)}
                  className={`p-2 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {effect.charAt(0).toUpperCase() + effect.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Effect Intensities */}
        {activeEffects.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Effect Intensity</h3>
            <div className="space-y-3">
              {activeEffects.map((effect) => (
                <div key={effect}>
                  <label className="text-xs text-white/70 mb-1 block">
                    {effect.charAt(0).toUpperCase() + effect.slice(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={effectIntensities[effect] || 0.5}
                    onChange={(e) => onEffectIntensityChange(effect, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-white/50 text-right">
                    {((effectIntensities[effect] || 0.5) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Material Settings */}
        <div>
          <h3 className="text-sm font-medium mb-3">Material Properties</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/70 mb-1 block">Metalness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={materialSettings.metalness}
                onChange={(e) => onMaterialChange({ metalness: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 mb-1 block">Roughness</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={materialSettings.roughness}
                onChange={(e) => onMaterialChange({ roughness: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-white/70 mb-1 block">Reflectivity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={materialSettings.reflectivity}
                onChange={(e) => onMaterialChange({ reflectivity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <Button
          onClick={handleSaveRemix}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Remix
        </Button>
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default AdvancedCustomizationPanel;
