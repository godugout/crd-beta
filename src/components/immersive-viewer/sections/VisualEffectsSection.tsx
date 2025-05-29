
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles,
  Zap,
  Chrome,
  Gem,
  Star,
  Clock,
  Flashlight,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';

interface VisualEffectsSectionProps {
  activeEffect: string;
  effectIntensity: number;
  onEffectChange: (effectId: string) => void;
  onIntensityChange: (intensity: number) => void;
}

const VisualEffectsSection: React.FC<VisualEffectsSectionProps> = ({
  activeEffect,
  effectIntensity,
  onEffectChange,
  onIntensityChange
}) => {
  const [effectsMode, setEffectsMode] = React.useState<'easy' | 'pro'>('easy');

  // Easy mode - curated preset combinations
  const easyPresets = [
    { 
      id: 'holographic', 
      name: 'Holographic', 
      icon: Star,
      description: 'Rainbow prismatic finish',
      settings: { intensity: 75, roughness: 0.1, metalness: 0.9 }
    },
    { 
      id: 'premium_foil', 
      name: 'Premium Foil', 
      icon: Sparkles,
      description: 'Luxury metallic shine',
      settings: { intensity: 80, roughness: 0.2, metalness: 1.0 }
    },
    { 
      id: 'vintage_classic', 
      name: 'Vintage Classic', 
      icon: Clock,
      description: 'Aged premium look',
      settings: { intensity: 60, roughness: 0.7, metalness: 0.3 }
    },
    { 
      id: 'cosmic_rare', 
      name: 'Cosmic Rare', 
      icon: Circle,
      description: 'Deep space shimmer',
      settings: { intensity: 85, roughness: 0.1, metalness: 0.8 }
    }
  ];

  // Pro mode - individual effects
  const proEffects = [
    { id: 'holographic', name: 'Holographic', icon: Star },
    { id: 'galaxy', name: 'Galaxy', icon: Circle },
    { id: 'refractor', name: 'Refractor', icon: Gem },
    { id: 'foil', name: 'Foil', icon: Sparkles },
    { id: 'chrome', name: 'Chrome', icon: Chrome },
    { id: 'prismatic', name: 'Prismatic', icon: Zap },
    { id: 'vintage', name: 'Vintage', icon: Clock },
    { id: 'neon', name: 'Neon', icon: Flashlight },
  ];

  const handleEasyPreset = (preset: typeof easyPresets[0]) => {
    onEffectChange(preset.id);
    onIntensityChange(preset.settings.intensity);
    toast.success(`Applied ${preset.name} preset`);
  };

  const handleProEffect = (effectId: string) => {
    onEffectChange(effectId);
    const effect = proEffects.find(e => e.id === effectId);
    toast.success(`Applied ${effect?.name} effect`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Visual Effects</h3>
          <p className="text-sm text-gray-400">Choose a premium effect for your card</p>
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEffectsMode('easy')}
            className={`text-xs px-3 py-1 ${
              effectsMode === 'easy' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Easy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEffectsMode('pro')}
            className={`text-xs px-3 py-1 ${
              effectsMode === 'pro' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Pro
          </Button>
        </div>
      </div>
      
      {/* Easy Mode - Preset Combinations */}
      {effectsMode === 'easy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {easyPresets.map((preset) => {
              const IconComponent = preset.icon;
              const isActive = activeEffect === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant="outline"
                  onClick={() => handleEasyPreset(preset)}
                  className={`h-24 flex-col gap-2 p-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-lg shadow-blue-600/25' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <IconComponent className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">{preset.name}</span>
                  <span className="text-xs opacity-75 text-center leading-tight">
                    {preset.description}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Simple intensity control for easy mode */}
          <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <Label className="text-white font-medium">Effect Intensity</Label>
              <span className="text-sm text-blue-400 font-medium">{effectIntensity}%</span>
            </div>
            <Slider
              value={[effectIntensity]}
              min={0}
              max={100}
              step={5}
              onValueChange={([value]) => onIntensityChange(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtle</span>
              <span>Intense</span>
            </div>
          </div>
        </div>
      )}

      {/* Pro Mode - Individual Effects */}
      {effectsMode === 'pro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {proEffects.map((effect) => {
              const IconComponent = effect.icon;
              const isActive = activeEffect === effect.id;
              
              return (
                <Button
                  key={effect.id}
                  variant="outline"
                  onClick={() => handleProEffect(effect.id)}
                  className={`h-16 flex-col gap-1 text-xs transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{effect.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Advanced intensity control for pro mode */}
          <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-white capitalize font-medium">
                  {proEffects.find(e => e.id === activeEffect)?.name || activeEffect} Intensity
                </Label>
                <p className="text-xs text-gray-400 mt-1">Fine-tune the effect strength</p>
              </div>
              <span className="text-sm text-blue-400 font-medium">{effectIntensity}%</span>
            </div>
            <Slider
              value={[effectIntensity]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => onIntensityChange(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtle</span>
              <span>Maximum</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEffectsSection;
