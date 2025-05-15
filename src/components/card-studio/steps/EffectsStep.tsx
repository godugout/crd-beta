
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardEffect } from '@/components/card-creation/types/cardTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Plus, Trash2, Settings, Sparkles } from 'lucide-react';

interface EffectsStepProps {
  effects: string[];
  onUpdate: (effects: string[]) => void;
}

// Mock list of available effects
const AVAILABLE_EFFECTS = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Creates a rainbow-colored prismatic effect that shifts with light',
    thumbnail: '/effects/holographic-thumb.png',
    premium: false,
  },
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Refractive light pattern that bends across the surface',
    thumbnail: '/effects/refractor-thumb.png',
    premium: false,
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Metallic gold foil effect for premium cards',
    thumbnail: '/effects/gold-thumb.png',
    premium: true,
  },
  {
    id: 'silver-foil',
    name: 'Silver Foil',
    description: 'Metallic silver foil effect with light reflection',
    thumbnail: '/effects/silver-thumb.png',
    premium: true,
  },
  {
    id: 'cracked-ice',
    name: 'Cracked Ice',
    description: 'Fractured prismatic pattern resembling cracked ice',
    thumbnail: '/effects/cracked-ice-thumb.png',
    premium: true,
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    description: 'Animated pulsing glow emanating from the card',
    thumbnail: '/effects/pulsar-thumb.png',
    premium: false,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged appearance with slight texture and color shifts',
    thumbnail: '/effects/vintage-thumb.png',
    premium: false,
  },
];

const EffectsStep: React.FC<EffectsStepProps> = ({ effects = [], onUpdate }) => {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  
  const handleAddEffect = (effectId: string) => {
    if (!effects.includes(effectId)) {
      const newEffects = [...effects, effectId];
      onUpdate(newEffects);
    }
    setSelectedEffect(effectId);
  };
  
  const handleRemoveEffect = (effectId: string) => {
    const newEffects = effects.filter(id => id !== effectId);
    onUpdate(newEffects);
    if (selectedEffect === effectId) {
      setSelectedEffect(null);
    }
  };
  
  const selectedEffectData = AVAILABLE_EFFECTS.find(effect => effect.id === selectedEffect);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Card Effects</h2>
        <p className="text-sm text-gray-500 mt-1">
          Add special effects to enhance the appearance of your card
        </p>
      </div>
      
      <Tabs defaultValue="applied">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="applied">Applied Effects</TabsTrigger>
          <TabsTrigger value="available">Available Effects</TabsTrigger>
        </TabsList>
        
        {/* Applied Effects Tab */}
        <TabsContent value="applied">
          <div className="bg-gray-50 rounded-lg border p-4">
            {effects.length > 0 ? (
              <div className="space-y-3">
                <ScrollArea className="h-[200px]">
                  {effects.map((effectId) => {
                    const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
                    if (!effect) return null;
                    
                    return (
                      <div 
                        key={effect.id} 
                        className={`flex items-center justify-between p-3 rounded-md mb-2 hover:bg-gray-100 border ${
                          selectedEffect === effect.id ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedEffect(effect.id)}
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded bg-gray-200 mr-3 overflow-hidden">
                            {effect.thumbnail ? (
                              <img 
                                src={effect.thumbnail} 
                                alt={effect.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/effects/default-effect.png';
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200">
                                <Sparkles className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{effect.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-1">{effect.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Effect Settings"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEffect(effect.id);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            title="Remove Effect"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveEffect(effect.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
                
                {selectedEffectData && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">{selectedEffectData.name} Settings</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="effect-intensity" className="text-xs">Intensity</Label>
                        <div className="flex items-center">
                          <Slider
                            id="effect-intensity"
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-xs ml-2 w-6">50%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="effect-animation" className="text-xs flex items-center justify-between">
                          <span>Animation</span>
                          <Switch id="effect-animation" />
                        </Label>
                      </div>
                      
                      {['holographic', 'refractor'].includes(selectedEffectData.id) && (
                        <div>
                          <Label htmlFor="effect-color" className="text-xs">Color Scheme</Label>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            <div className="h-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-md cursor-pointer" />
                            <div className="h-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md cursor-pointer" />
                            <div className="h-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-md cursor-pointer" />
                            <div className="h-6 w-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-md cursor-pointer" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setSelectedEffect(null)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Effect
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-medium mt-4">No Effects Applied</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add effects to make your card stand out
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Effect
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Available Effects Tab */}
        <TabsContent value="available">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {AVAILABLE_EFFECTS.map((effect) => (
              <div 
                key={effect.id}
                className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  effects.includes(effect.id) 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleAddEffect(effect.id)}
              >
                <div className="h-24 bg-gray-100">
                  {effect.thumbnail ? (
                    <img 
                      src={effect.thumbnail} 
                      alt={effect.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/effects/default-effect.png';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Sparkles className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{effect.name}</h4>
                    {effect.premium && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {effect.description}
                  </p>
                  
                  {effects.includes(effect.id) ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveEffect(effect.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 w-full text-primary"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EffectsStep;
