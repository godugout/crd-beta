
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CardEffect {
  id: string;
  name: string;
  description: string;
  category: 'finish' | 'border' | 'background' | 'special';
  preview: string;
  intensity?: number;
  enabled?: boolean;
  isPremium?: boolean;
}

interface EffectsSelectionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  completeStep: () => void;
}

// Sample effects data - in a real app, this would come from an API
const CARD_EFFECTS: CardEffect[] = [
  {
    id: 'glossy',
    name: 'Glossy Finish',
    description: 'Classic glossy card finish',
    category: 'finish',
    preview: 'https://storage.googleapis.com/pai-images/6c54daa7570e4349a79659ecfca0f14c.jpeg',
    intensity: 50,
  },
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Rainbow refractor effect',
    category: 'finish',
    preview: 'https://storage.googleapis.com/pai-images/22aacb65dd274e6fa3b7f74c7a7195a7.jpeg',
    intensity: 50,
    isPremium: true,
  },
  {
    id: 'matte',
    name: 'Matte Finish',
    description: 'Non-glossy matte texture',
    category: 'finish',
    preview: 'https://storage.googleapis.com/pai-images/6c54daa7570e4349a79659ecfca0f14c.jpeg',
  },
  {
    id: 'gold-border',
    name: 'Gold Border',
    description: 'Luxurious gold border',
    category: 'border',
    preview: 'https://storage.googleapis.com/pai-images/db68568c82fe42c8bb55b62a8d5f3407.jpeg',
    isPremium: true,
  },
  {
    id: 'silver-border',
    name: 'Silver Border',
    description: 'Elegant silver border',
    category: 'border',
    preview: 'https://storage.googleapis.com/pai-images/b15a9344da0042a487c36248e9c269f2.jpeg',
  },
  {
    id: 'gradient',
    name: 'Team Colors Gradient',
    description: 'Gradient using team colors',
    category: 'background',
    preview: 'https://storage.googleapis.com/pai-images/5b9197449731422c8c0781b33b909640.jpeg',
  },
  {
    id: 'confetti',
    name: 'Confetti Background',
    description: 'Celebratory confetti pattern',
    category: 'background',
    preview: 'https://storage.googleapis.com/pai-images/9399d4c7706d4641accb06d6fda62c21.jpeg',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Full holographic treatment',
    category: 'special',
    preview: 'https://storage.googleapis.com/pai-images/5b9197449731422c8c0781b33b909640.jpeg',
    intensity: 70,
    isPremium: true,
  },
  {
    id: 'autograph',
    name: 'Signature Overlay',
    description: 'Digital signature effect',
    category: 'special',
    preview: 'https://storage.googleapis.com/pai-images/9399d4c7706d4641accb06d6fda62c21.jpeg',
  },
];

const EffectsSelectionStep: React.FC<EffectsSelectionStepProps> = ({
  formData,
  updateFormData,
  completeStep
}) => {
  const [selectedEffects, setSelectedEffects] = useState<{[key: string]: CardEffect}>(
    formData.effects || {}
  );
  const [activeCategory, setActiveCategory] = useState<string>('finish');
  
  // Update form data whenever selected effects change
  useEffect(() => {
    updateFormData({
      effects: selectedEffects,
    });
    
    // Auto-complete step if any effect is selected
    if (Object.keys(selectedEffects).length > 0) {
      completeStep();
    }
  }, [selectedEffects, updateFormData, completeStep]);
  
  // Handle effect selection
  const selectEffect = (category: string, effect: CardEffect) => {
    // For finish and border categories, we only allow one selection at a time
    if (category === 'finish' || category === 'border') {
      // Find any existing effect in this category and remove it
      const existingEffectKey = Object.keys(selectedEffects).find(key => 
        selectedEffects[key].category === category
      );
      
      if (existingEffectKey && existingEffectKey !== effect.id) {
        const newEffects = { ...selectedEffects };
        delete newEffects[existingEffectKey];
        setSelectedEffects(newEffects);
      }
    }
    
    // Toggle the selected effect
    if (selectedEffects[effect.id]) {
      const newEffects = { ...selectedEffects };
      delete newEffects[effect.id];
      setSelectedEffects(newEffects);
    } else {
      setSelectedEffects({
        ...selectedEffects,
        [effect.id]: effect
      });
    }
  };
  
  // Update effect intensity
  const updateEffectIntensity = (effectId: string, intensity: number) => {
    if (selectedEffects[effectId]) {
      setSelectedEffects({
        ...selectedEffects,
        [effectId]: {
          ...selectedEffects[effectId],
          intensity
        }
      });
    }
  };
  
  // Get effects for the current category
  const getCategoryEffects = () => {
    return CARD_EFFECTS.filter(effect => effect.category === activeCategory);
  };
  
  // Check if an effect is selected
  const isEffectSelected = (effectId: string) => {
    return !!selectedEffects[effectId];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Card Effects</h2>
        <p className="text-gray-500 text-sm">
          Choose effects to enhance your card's appearance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="finish">Finish</TabsTrigger>
              <TabsTrigger value="border">Border</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="special">Special</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCategoryEffects().map((effect) => (
                <Card 
                  key={effect.id}
                  className={cn(
                    "overflow-hidden cursor-pointer transition-all",
                    isEffectSelected(effect.id) ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                  )}
                  onClick={() => selectEffect(activeCategory, effect)}
                >
                  <div className="aspect-[2.5/3.5] relative">
                    <img 
                      src={effect.preview} 
                      alt={effect.name}
                      className="w-full h-full object-cover"
                    />
                    {effect.isPremium && (
                      <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                    {isEffectSelected(effect.id) && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{effect.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{effect.description}</p>
                    
                    {effect.intensity !== undefined && isEffectSelected(effect.id) && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Intensity</span>
                          <span className="text-xs font-medium">{selectedEffects[effect.id].intensity}%</span>
                        </div>
                        <Slider
                          value={[selectedEffects[effect.id].intensity || 50]}
                          min={10}
                          max={100}
                          step={5}
                          onValueChange={(value) => updateEffectIntensity(effect.id, value[0])}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Selected Effects</h3>
            {Object.keys(selectedEffects).length === 0 ? (
              <p className="text-sm text-gray-500">No effects selected yet</p>
            ) : (
              <div className="space-y-3">
                {Object.values(selectedEffects).map((effect) => (
                  <div key={effect.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div>
                      <p className="text-sm font-medium">{effect.name}</p>
                      <p className="text-xs text-gray-500">{effect.category}</p>
                    </div>
                    <Switch
                      checked={true}
                      onCheckedChange={() => selectEffect(effect.category, effect)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Preview</h3>
            <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Card preview with effects"
                  className={cn(
                    "w-full h-full object-cover",
                    isEffectSelected('refractor') && "animate-shimmer",
                    isEffectSelected('holographic') && "animate-rainbow"
                  )}
                  style={{
                    filter: [
                      isEffectSelected('glossy') && "brightness(1.1) contrast(1.1)",
                      isEffectSelected('matte') && "brightness(0.95) contrast(0.95)"
                    ].filter(Boolean).join(' ')
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No image uploaded</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500">
                This is an approximation. The final card may look slightly different.
              </p>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-50 border-blue-100">
            <h3 className="text-sm font-medium text-blue-700">Effect Combinations</h3>
            <div className="mt-2 space-y-2">
              <div className="bg-white p-2 rounded text-xs">
                <p className="font-medium">Rookie Spotlight</p>
                <p className="text-gray-500 mt-1">
                  Glossy Finish + Silver Border + Team Colors Gradient
                </p>
              </div>
              <div className="bg-white p-2 rounded text-xs">
                <p className="font-medium">Hall of Fame Edition</p>
                <p className="text-gray-500 mt-1">
                  Refractor + Gold Border + Signature Overlay
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.2) 25%,
            rgba(255,255,255,0.2) 50%,
            rgba(255,255,255,0) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 4s infinite linear;
        }
        
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg) brightness(1.1);
          }
          100% {
            filter: hue-rotate(360deg) brightness(1.1);
          }
        }
        
        .animate-rainbow {
          animation: rainbow 8s infinite linear;
        }
      `}} />
    </div>
  );
};

export default EffectsSelectionStep;
