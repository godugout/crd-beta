import React, { useState } from 'react';
import { Plus, X, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CardEffect } from './hooks/useCardEffectsStack';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AVAILABLE_EFFECTS = [
  { name: 'Refractor', description: 'Adds a refractive, prismatic effect to the card' },
  { name: 'Holographic', description: 'Adds holographic patterns that shift with perspective' },
  { name: 'Glossy', description: 'Adds a glossy, reflective finish to the card' },
  { name: 'Matte', description: 'Gives the card a premium matte finish' },
  { name: 'Foil', description: 'Adds foil accents to the card' },
  { name: 'Shadow', description: 'Adds depth with shadow effects' }
];

interface CardEffectsPanelProps {
  effectStack: CardEffect[];
  onAddEffect: (name: string, settings?: any) => void;
  onRemoveEffect: (id: string) => void;
  onUpdateSettings: (id: string, settings: any) => void;
}

const CardEffectsPanel: React.FC<CardEffectsPanelProps> = ({
  effectStack,
  onAddEffect,
  onRemoveEffect,
  onUpdateSettings
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);
  
  const handleAddEffect = () => {
    if (!selectedEffect) return;
    
    const defaultSettings: any = {};
    
    switch (selectedEffect) {
      case 'Refractor':
        defaultSettings.intensity = 'medium';
        defaultSettings.angle = 45;
        break;
      case 'Holographic':
        defaultSettings.pattern = 'lines';
        defaultSettings.speed = 0.5;
        break;
      case 'Glossy':
        defaultSettings.level = 'medium';
        defaultSettings.highlight = '#ffffff';
        break;
      case 'Foil':
        defaultSettings.color = 'rainbow';
        defaultSettings.coverage = 0.5;
        break;
      case 'Shadow':
        defaultSettings.depth = 'medium';
        defaultSettings.blur = 10;
        defaultSettings.color = 'rgba(0,0,0,0.5)';
        break;
    }
    
    onAddEffect(selectedEffect, defaultSettings);
    setSelectedEffect(null);
  };
  
  const toggleEffectExpansion = (id: string) => {
    setExpandedEffectId(prevId => prevId === id ? null : id);
  };
  
  const renderEffectSettings = (effect: CardEffect) => {
    switch (effect.name.toLowerCase()) {
      case 'refractor':
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm">Intensity</label>
                <span className="text-xs text-gray-500">{effect.settings.intensity}</span>
              </div>
              <Select
                value={effect.settings.intensity || 'medium'}
                onValueChange={(value) => onUpdateSettings(effect.id, { intensity: value })}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtle">Subtle</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm">Angle</label>
                <span className="text-xs text-gray-500">{effect.settings.angle}°</span>
              </div>
              <Slider
                value={[effect.settings.angle || 45]}
                min={0}
                max={360}
                step={5}
                onValueChange={(value) => onUpdateSettings(effect.id, { angle: value[0] })}
              />
            </div>
          </div>
        );
        
      case 'holographic':
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm">Pattern</label>
                <span className="text-xs text-gray-500">{effect.settings.pattern}</span>
              </div>
              <Select
                value={effect.settings.pattern || 'lines'}
                onValueChange={(value) => onUpdateSettings(effect.id, { pattern: value })}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="waves">Waves</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm">Animation Speed</label>
                <span className="text-xs text-gray-500">{effect.settings.speed}</span>
              </div>
              <Slider
                value={[effect.settings.speed || 0.5]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => onUpdateSettings(effect.id, { speed: value[0] })}
              />
            </div>
          </div>
        );
        
      case 'glossy':
      case 'matte':
      case 'foil':
      case 'shadow':
      default:
        return (
          <div className="text-sm text-gray-500 italic">
            Settings for this effect type will be available soon.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Card Effects</h3>
        <p className="text-sm text-gray-500">
          Add special effects to enhance your card's appearance and make it stand out.
        </p>
      </div>
      
      <div className="space-y-3">
        {effectStack.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">No effects added yet</p>
          </div>
        ) : (
          effectStack.map(effect => (
            <div 
              key={effect.id} 
              className="border rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 bg-gray-50">
                <div className="flex items-center">
                  <span className="font-medium">{effect.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleEffectExpansion(effect.id)}
                    className="h-8 w-8"
                  >
                    <Settings size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => onRemoveEffect(effect.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              {expandedEffectId === effect.id && (
                <div className="p-3 border-t bg-gray-50/50">
                  {renderEffectSettings(effect)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="space-y-2">
        <div>
          <Select
            value={selectedEffect || ''}
            onValueChange={setSelectedEffect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an effect" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_EFFECTS.map(effect => (
                <SelectItem key={effect.name} value={effect.name}>
                  {effect.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleAddEffect}
          disabled={!selectedEffect}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Effect
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2 text-sm">About Effects</h4>
        <p className="text-xs text-gray-500">
          Effects apply visual enhancements to your card. Multiple effects can be combined for unique looks.
          Some effects may only be visible when viewing the finished card.
        </p>
      </div>
    </div>
  );
};

export default CardEffectsPanel;
