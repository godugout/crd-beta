
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface EffectsStepProps {
  effects: string[];
  onUpdate: (effects: string[]) => void;
}

// Available effect categories
const EFFECT_CATEGORIES = ['Premium', 'Standard', 'Patterns', 'Custom'];

// Sample effects data - in a real app this would come from an API
const AVAILABLE_EFFECTS = [
  {
    id: 'refractor',
    name: 'Refractor',
    category: 'Premium',
    description: 'Rainbow prismatic effect that shifts with viewing angle',
    thumbnail: '/placeholder-card.png',
    options: {
      intensity: { min: 0, max: 100, default: 80 },
      speed: { min: 0, max: 100, default: 50 }
    }
  },
  {
    id: 'chrome',
    name: 'Chrome',
    category: 'Premium',
    description: 'Metallic chrome finish with high reflectivity',
    thumbnail: '/placeholder-card.png',
    options: {
      intensity: { min: 0, max: 100, default: 70 }
    }
  },
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'Premium',
    description: '3D holographic pattern with depth effect',
    thumbnail: '/placeholder-card.png',
    options: {
      pattern: ['dots', 'lines', 'waves'],
      intensity: { min: 0, max: 100, default: 60 }
    }
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    category: 'Premium',
    description: 'Shimmering gold foil accent',
    thumbnail: '/placeholder-card.png',
    options: {
      coverage: { min: 0, max: 100, default: 30 }
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'Standard',
    description: 'Classic worn look with subtle aging',
    thumbnail: '/placeholder-card.png',
    options: {
      aging: { min: 0, max: 100, default: 40 }
    }
  },
  {
    id: 'glossy',
    name: 'Glossy',
    category: 'Standard',
    description: 'High-gloss finish',
    thumbnail: '/placeholder-card.png'
  }
];

const EffectsStep: React.FC<EffectsStepProps> = ({
  effects,
  onUpdate
}) => {
  const [activeCategory, setActiveCategory] = useState(EFFECT_CATEGORIES[0]);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [effectOptions, setEffectOptions] = useState<Record<string, any>>({});
  
  // Get effects for current category
  const filteredEffects = AVAILABLE_EFFECTS.filter(
    effect => effect.category === activeCategory
  );
  
  const handleAddEffect = (effectId: string) => {
    if (!effects.includes(effectId)) {
      const newEffects = [...effects, effectId];
      onUpdate(newEffects);
      setSelectedEffect(effectId);
      
      // Initialize default options
      const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
      if (effect?.options) {
        const defaultOptions: Record<string, any> = {};
        
        Object.entries(effect.options).forEach(([key, value]) => {
          if (typeof value === 'object' && 'default' in value) {
            defaultOptions[key] = value.default;
          }
        });
        
        setEffectOptions(prev => ({
          ...prev,
          [effectId]: defaultOptions
        }));
      }
    }
  };
  
  const handleRemoveEffect = (effectId: string) => {
    const newEffects = effects.filter(id => id !== effectId);
    onUpdate(newEffects);
    
    if (selectedEffect === effectId) {
      setSelectedEffect(null);
    }
  };
  
  const updateEffectOption = (effectId: string, option: string, value: any) => {
    setEffectOptions(prev => ({
      ...prev,
      [effectId]: {
        ...(prev[effectId] || {}),
        [option]: value
      }
    }));
    
    // In a real app, this would update a more complex effect state
    // For now we just toggle the effect on/off
    console.log(`Updated ${effectId} ${option} to ${value}`);
  };
  
  // Get the full effect object from its ID
  const getEffectById = (id: string) => AVAILABLE_EFFECTS.find(e => e.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Add Special Effects</h2>
        <p className="text-sm text-gray-500">
          Enhance your card with special visual effects that make it stand out.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <h3 className="text-sm font-medium mb-3">Applied Effects</h3>
          
          {effects.length > 0 ? (
            <div className="space-y-3">
              {effects.map(effectId => {
                const effect = getEffectById(effectId);
                return effect ? (
                  <div 
                    key={effectId}
                    className={`p-3 rounded-md border ${selectedEffect === effectId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedEffect(effectId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Switch 
                          id={`switch-${effectId}`} 
                          checked={true}
                          onCheckedChange={() => handleRemoveEffect(effectId)}
                        />
                        <Label 
                          htmlFor={`switch-${effectId}`}
                          className="font-medium ml-2 cursor-pointer"
                        >
                          {effect.name}
                        </Label>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {effect.category}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveEffect(effectId);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {selectedEffect === effectId && effect.options && (
                      <div className="mt-3 pt-3 border-t">
                        {Object.entries(effect.options).map(([key, value]) => {
                          if (typeof value === 'object' && 'min' in value && 'max' in value) {
                            // Slider control for numeric options
                            return (
                              <div key={key} className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <Label htmlFor={`${effectId}-${key}`} className="text-xs capitalize">
                                    {key}
                                  </Label>
                                  <span className="text-xs">
                                    {effectOptions[effectId]?.[key] || value.default}%
                                  </span>
                                </div>
                                <Slider
                                  id={`${effectId}-${key}`}
                                  min={value.min}
                                  max={value.max}
                                  step={1}
                                  value={[effectOptions[effectId]?.[key] || value.default]}
                                  onValueChange={([newValue]) => updateEffectOption(effectId, key, newValue)}
                                />
                              </div>
                            );
                          } else if (Array.isArray(value)) {
                            // Options dropdown for array options
                            return (
                              <div key={key} className="mb-3">
                                <Label htmlFor={`${effectId}-${key}`} className="text-xs capitalize mb-1 block">
                                  {key}
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {value.map((option: string) => (
                                    <Button
                                      key={option}
                                      variant={effectOptions[effectId]?.[key] === option ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updateEffectOption(effectId, key, option)}
                                      className="text-xs py-1 h-7"
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-6 text-center">
              <p className="text-gray-500">No effects applied yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Select from the available effects on the right.
              </p>
            </div>
          )}
        </div>
        
        <div className="md:w-1/2">
          <Tabs defaultValue={EFFECT_CATEGORIES[0]} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-4 mb-4">
              {EFFECT_CATEGORIES.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="text-xs"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory} className="mt-0">
              <div className="grid grid-cols-2 gap-3">
                {filteredEffects.map(effect => (
                  <div
                    key={effect.id}
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => handleAddEffect(effect.id)}
                  >
                    <div className="h-24 bg-gray-100 flex items-center justify-center">
                      <img
                        src={effect.thumbnail}
                        alt={effect.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="font-medium text-sm">{effect.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{effect.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EffectsStep;
