
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Lightbulb, 
  Layers, 
  Sparkles, 
  Camera,
  Palette,
  Globe,
  X
} from 'lucide-react';
import { Card } from '@/lib/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface EffectSettings {
  holographic: number;
  refractor: number;
  foil: number;
  chrome: number;
  prismatic: number;
  vintage: number;
  neon: number;
  galaxy: number;
}

interface LightingSettings {
  intensity: number;
  color: string;
  position: { x: number; y: number; z: number };
  ambientIntensity: number;
  environmentType: string;
}

interface AdvancedCustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onSaveRemix: (settings: any) => void;
  activeEffects: string[];
  onEffectsChange: (effects: string[]) => void;
  effectIntensities: Record<string, number>;
  onEffectIntensityChange: (effect: string, intensity: number) => void;
  materialSettings: MaterialSettings;
  onMaterialChange: (settings: Partial<MaterialSettings>) => void;
  lightingSettings: LightingSettings;
  onLightingChange: (settings: Partial<LightingSettings>) => void;
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
  const [activeTab, setActiveTab] = useState("effects");

  // Available effects with presets
  const availableEffects = [
    { id: 'holographic', name: 'Holographic', description: 'Rainbow prism effect' },
    { id: 'refractor', name: 'Refractor', description: 'Light bending patterns' },
    { id: 'foil', name: 'Foil', description: 'Metallic shine' },
    { id: 'chrome', name: 'Chrome', description: 'Mirror finish' },
    { id: 'prismatic', name: 'Prismatic', description: 'Geometric patterns' },
    { id: 'vintage', name: 'Vintage', description: 'Aged patina' },
    { id: 'neon', name: 'Neon', description: 'Glowing edges' },
    { id: 'galaxy', name: 'Galaxy', description: 'Cosmic patterns' }
  ];

  // Environment presets
  const environments = [
    { id: 'stadium', name: 'Stadium', description: 'Sports arena lighting' },
    { id: 'gallery', name: 'Art Gallery', description: 'Museum spotlights' },
    { id: 'cardshop', name: 'Card Shop', description: 'Display case feel' },
    { id: 'store', name: 'Store', description: 'Retail lighting' },
    { id: 'mall', name: 'Mall', description: 'Bright commercial' },
    { id: 'studio', name: 'Studio', description: 'Professional setup' },
    { id: 'cosmic', name: 'Cosmic', description: 'Space environment' },
    { id: 'underwater', name: 'Underwater', description: 'Ocean depths' }
  ];

  const toggleEffect = (effectId: string) => {
    const newEffects = activeEffects.includes(effectId) 
      ? activeEffects.filter(id => id !== effectId)
      : [...activeEffects, effectId];
    onEffectsChange(newEffects);
    toast.success(`${effectId} effect ${activeEffects.includes(effectId) ? 'disabled' : 'enabled'}`);
  };

  const applyEffectPreset = (preset: string) => {
    const presets = {
      premium: ['holographic', 'foil', 'prismatic'],
      vintage: ['vintage', 'chrome'],
      cosmic: ['galaxy', 'neon', 'holographic'],
      minimal: ['refractor']
    };
    
    onEffectsChange(presets[preset] || []);
    toast.success(`Applied ${preset} preset`);
  };

  const handleSaveRemix = () => {
    const remixSettings = {
      effects: activeEffects,
      effectSettings: effectIntensities,
      materialSettings,
      lightingSettings,
      environmentType,
      card: {
        ...card,
        title: `${card.title} (Remix)`,
        id: `remix-${Date.now()}`
      }
    };
    
    onSaveRemix(remixSettings);
    toast.success('Remix saved! Redirecting to editor...');
  };

  return (
    <motion.div 
      className={`fixed top-0 right-0 h-full w-[420px] bg-gray-900/95 backdrop-blur-xl text-white shadow-2xl z-40 overflow-y-auto`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 180 }}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Card Remix Studio</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Card Info */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="font-medium text-lg">{card.title}</h3>
          <p className="text-sm text-gray-300 mt-1">Create your own version with custom effects</p>
        </div>

        {/* Customization Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-800/50">
            <TabsTrigger value="effects" className="flex items-center justify-center p-3">
              <Sparkles className="h-6 w-6" />
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center justify-center p-3">
              <Layers className="h-6 w-6" />
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex items-center justify-center p-3">
              <Lightbulb className="h-6 w-6" />
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center justify-center p-3">
              <Globe className="h-6 w-6" />
            </TabsTrigger>
          </TabsList>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Effect Presets</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['premium', 'vintage', 'cosmic', 'minimal'].map(preset => (
                  <Button 
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => applyEffectPreset(preset)}
                    className="text-xs"
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Individual Effects</h3>
              {availableEffects.map(effect => (
                <div key={effect.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={activeEffects.includes(effect.id)}
                        onCheckedChange={() => toggleEffect(effect.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{effect.name}</p>
                        <p className="text-xs text-gray-400">{effect.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {activeEffects.includes(effect.id) && (
                    <div className="ml-8 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Intensity</span>
                        <span>{(effectIntensities[effect.id] || 0.5).toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[effectIntensities[effect.id] || 0.5]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={([value]) => onEffectIntensityChange(effect.id, value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(materialSettings).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <span className="text-gray-400">{value.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[value]}
                    min={0}
                    max={key === 'envMapIntensity' ? 2 : 1}
                    step={0.01}
                    onValueChange={([newValue]) => 
                      onMaterialChange({ [key]: newValue })
                    }
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Lighting Tab */}
          <TabsContent value="lighting" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Light Intensity</Label>
                  <span className="text-gray-400">{lightingSettings.intensity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[lightingSettings.intensity]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => 
                    onLightingChange({ intensity: value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Ambient Light</Label>
                  <span className="text-gray-400">{lightingSettings.ambientIntensity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[lightingSettings.ambientIntensity]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={([value]) => 
                    onLightingChange({ ambientIntensity: value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Light Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['#ffffff', '#fff5e0', '#e0f0ff'].map(color => (
                    <Button
                      key={color}
                      variant={lightingSettings.color === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => onLightingChange({ color })}
                      className="h-8"
                      style={{ backgroundColor: color === lightingSettings.color ? color : undefined }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">3D Environment</Label>
              <Select 
                value={environmentType} 
                onValueChange={onEnvironmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id}>
                      <div>
                        <div className="font-medium">{env.name}</div>
                        <div className="text-xs text-gray-500">{env.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Remix Button */}
        <div className="pt-4 border-t border-gray-700">
          <Button 
            onClick={handleSaveRemix}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Save as New Card
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedCustomizationPanel;
