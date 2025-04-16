
import React from 'react';
import { Sparkles, Wind, LayoutGrid, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { DEFAULT_PARTICLE_PRESETS, ParticleEffectType } from '@/lib/types/particleEffects';

interface ParticleEffectsControlsProps {
  particleState: {
    effects: Record<string, any>;
    isActive: boolean;
    performanceLevel: 'high' | 'medium' | 'low';
    autoAdjust: boolean;
  };
  onToggleEffect: (effectType: ParticleEffectType) => void;
  onUpdateEffectSettings: (effectType: ParticleEffectType, settings: Record<string, any>) => void;
  onApplyPreset: (presetName: string) => void;
  onToggleSystem: () => void;
  onToggleAutoAdjust: () => void;
  onSetPerformanceLevel: (level: 'high' | 'medium' | 'low') => void;
}

const ParticleEffectsControls: React.FC<ParticleEffectsControlsProps> = ({
  particleState,
  onToggleEffect,
  onUpdateEffectSettings,
  onApplyPreset,
  onToggleSystem,
  onToggleAutoAdjust,
  onSetPerformanceLevel
}) => {
  const effectIcons = {
    sparkle: <Sparkles size={16} />,
    dust: <Wind size={16} />,
    energy: <Palette size={16} />,
    team: <LayoutGrid size={16} />
  };
  
  const effectLabels = {
    sparkle: 'Sparkle',
    dust: 'Atmospheric',
    energy: 'Energy Aura',
    team: 'Team Colors'
  };

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <Sparkles size={16} className="mr-2" />
        Particle Effects
      </h3>
      
      <div className="space-y-4">
        {/* Master Toggle */}
        <div className="flex justify-between items-center border-b border-white/20 pb-2">
          <span className="text-xs font-medium">Enable Effects</span>
          <Toggle
            pressed={particleState.isActive}
            onPressedChange={onToggleSystem}
            size="sm"
            aria-label="Toggle all particle effects"
          />
        </div>
        
        {/* Effect Toggles */}
        <div>
          <h4 className="text-xs font-medium mb-2">Effect Types</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(particleState.effects).map(([type, settings]) => (
              <Toggle
                key={type}
                pressed={settings.enabled}
                onPressedChange={() => onToggleEffect(type as ParticleEffectType)}
                size="sm"
                disabled={!particleState.isActive}
                className="flex items-center gap-2"
              >
                {effectIcons[type as keyof typeof effectIcons]}
                <span className="text-xs">{effectLabels[type as keyof typeof effectLabels]}</span>
              </Toggle>
            ))}
          </div>
        </div>
        
        {/* Selected Effect Settings */}
        {Object.entries(particleState.effects).map(([type, settings]) => (
          settings.enabled && (
            <div key={`settings-${type}`}>
              <h4 className="text-xs font-medium mb-2 border-t border-white/20 pt-2">
                {effectLabels[type as keyof typeof effectLabels]} Settings
              </h4>
              
              <div className="space-y-3">
                {/* Density Control */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Density</span>
                    <span className="text-xs">{Math.round(settings.density * 100)}%</span>
                  </div>
                  <Slider 
                    value={[settings.density * 100]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => onUpdateEffectSettings(
                      type as ParticleEffectType,
                      { density: value[0] / 100 }
                    )}
                  />
                </div>
                
                {/* Speed Control */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Speed</span>
                    <span className="text-xs">{Math.round(settings.speed * 100)}%</span>
                  </div>
                  <Slider 
                    value={[settings.speed * 100]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => onUpdateEffectSettings(
                      type as ParticleEffectType,
                      { speed: value[0] / 100 }
                    )}
                  />
                </div>
                
                {/* Reactivity Control */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Motion Reactivity</span>
                    <span className="text-xs">{Math.round(settings.reactivity * 100)}%</span>
                  </div>
                  <Slider 
                    value={[settings.reactivity * 100]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => onUpdateEffectSettings(
                      type as ParticleEffectType,
                      { reactivity: value[0] / 100 }
                    )}
                  />
                </div>
                
                {/* Emission Pattern */}
                <div>
                  <span className="text-xs block mb-2">Emission Pattern</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['edges', 'corners', 'full'].map(pattern => (
                      <Button 
                        key={pattern}
                        variant="outline" 
                        size="sm"
                        className={`text-xs ${settings.emissionPattern === pattern ? 'bg-primary text-primary-foreground' : ''}`}
                        onClick={() => onUpdateEffectSettings(
                          type as ParticleEffectType,
                          { emissionPattern: pattern }
                        )}
                      >
                        {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
        
        {/* Performance Settings */}
        <div className="border-t border-white/20 pt-3">
          <h4 className="text-xs font-medium mb-2">Performance</h4>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            {['low', 'medium', 'high'].map(level => (
              <Button 
                key={level}
                variant="outline" 
                size="sm"
                className={`text-xs ${particleState.performanceLevel === level ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => onSetPerformanceLevel(level as 'high' | 'medium' | 'low')}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
          
          <Toggle
            pressed={particleState.autoAdjust}
            onPressedChange={onToggleAutoAdjust}
            size="sm"
            className="w-full justify-between px-3"
          >
            <span className="text-xs">Auto-adjust for performance</span>
          </Toggle>
        </div>
        
        {/* Presets */}
        <div className="border-t border-white/20 pt-3">
          <h4 className="text-xs font-medium mb-2">Effect Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(DEFAULT_PARTICLE_PRESETS).map(presetName => (
              <Button 
                key={presetName}
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => onApplyPreset(presetName)}
                disabled={!particleState.isActive}
              >
                {DEFAULT_PARTICLE_PRESETS[presetName].name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticleEffectsControls;
