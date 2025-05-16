
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { CardEffectDefinition } from '@/hooks/card-effects/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { getEffectsByCategory, getEffectById } from '@/components/effects/effectRegistry';

interface EffectsStepProps {
  cardData: Partial<Card>;
  onUpdateEffects: (effects: string[]) => void;
}

const EffectsStep: React.FC<EffectsStepProps> = ({ cardData, onUpdateEffects }) => {
  const [selectedEffects, setSelectedEffects] = useState<string[]>(cardData.effects || []);
  const [selectedEffect, setSelectedEffect] = useState<CardEffectDefinition | null>(null);
  const [standardEffects, setStandardEffects] = useState<CardEffectDefinition[]>([]);
  const [premiumEffects, setPremiumEffects] = useState<CardEffectDefinition[]>([]);

  // Load effects on component mount
  useEffect(() => {
    setStandardEffects(getEffectsByCategory('standard'));
    setPremiumEffects(getEffectsByCategory('premium'));
  }, []);

  // Update selected effect when changing selection
  useEffect(() => {
    if (selectedEffects.length > 0) {
      const effect = getEffectById(selectedEffects[0]);
      if (effect) {
        setSelectedEffect(effect);
      }
    } else {
      setSelectedEffect(null);
    }
  }, [selectedEffects]);

  // Update parent component when effects change
  useEffect(() => {
    onUpdateEffects(selectedEffects);
  }, [selectedEffects, onUpdateEffects]);

  // Toggle effect selection
  const toggleEffect = (effectId: string) => {
    if (selectedEffects.includes(effectId)) {
      setSelectedEffects(selectedEffects.filter(id => id !== effectId));
    } else {
      // For simplicity, we'll only allow one effect at a time for now
      setSelectedEffects([effectId]);
    }
  };

  // Render effect card
  const renderEffectCard = (effect: CardEffectDefinition) => {
    const isSelected = selectedEffects.includes(effect.id);
    
    return (
      <div
        key={effect.id}
        className={`border rounded-lg p-3 cursor-pointer transition-all ${
          isSelected ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
        }`}
        onClick={() => toggleEffect(effect.id)}
      >
        <div className="aspect-[2.5/3.5] bg-gray-100 mb-2 rounded-md overflow-hidden">
          {effect.thumbnail ? (
            <img 
              src={effect.thumbnail} 
              alt={effect.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Preview
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-sm">{effect.name}</h3>
            <p className="text-xs text-gray-500 truncate">{effect.description}</p>
          </div>
          {isSelected && (
            <Badge variant="default" className="ml-2">Active</Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Card Effects</h2>
      
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="standard">Standard Effects</TabsTrigger>
          <TabsTrigger value="premium">Premium Effects</TabsTrigger>
          <TabsTrigger value="settings">Effect Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {standardEffects.map(renderEffectCard)}
          </div>
          
          {standardEffects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Loading standard effects...
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="premium" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {premiumEffects.map(renderEffectCard)}
          </div>
          
          {premiumEffects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Loading premium effects...
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          {selectedEffect ? (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedEffect.name} Settings</h3>
                <Badge>{selectedEffect.category}</Badge>
              </div>
              
              <div className="space-y-6">
                {selectedEffect.defaultSettings.intensity !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Effect Intensity</Label>
                      <span className="text-sm text-gray-500">
                        {Math.round(selectedEffect.defaultSettings.intensity * 100)}%
                      </span>
                    </div>
                    <Slider 
                      defaultValue={[selectedEffect.defaultSettings.intensity * 100]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
                
                {selectedEffect.defaultSettings.speed !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Animation Speed</Label>
                      <span className="text-sm text-gray-500">
                        {Math.round(selectedEffect.defaultSettings.speed * 100)}%
                      </span>
                    </div>
                    <Slider 
                      defaultValue={[selectedEffect.defaultSettings.speed * 100]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
                
                {selectedEffect.defaultSettings.animationEnabled !== undefined && (
                  <div className="flex items-center justify-between">
                    <Label>Enable Animation</Label>
                    <Switch 
                      checked={selectedEffect.defaultSettings.animationEnabled}
                    />
                  </div>
                )}
                
                {selectedEffect.defaultSettings.pattern && (
                  <div className="space-y-2">
                    <Label>Pattern Style</Label>
                    <div className="flex flex-wrap gap-2">
                      {['linear', 'radial', 'angular'].map(pattern => (
                        <Badge 
                          key={pattern}
                          variant={pattern === selectedEffect.defaultSettings.pattern ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Simple color scheme display */}
                {selectedEffect.defaultSettings.colorScheme && (
                  <div className="space-y-2">
                    <Label>Color Scheme</Label>
                    <div className="flex gap-1">
                      {Array.isArray(selectedEffect.defaultSettings.colorScheme) ? (
                        selectedEffect.defaultSettings.colorScheme.map((color, index) => (
                          <div 
                            key={index}
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: selectedEffect.defaultSettings.colorScheme }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select an effect to see available settings
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EffectsStep;
