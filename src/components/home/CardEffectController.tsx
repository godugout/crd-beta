
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Paintbrush, 
  Flame, 
  Clock, 
  Award, 
  PackageOpen, 
  Palmtree, 
  Zap,
  Camera,
  XCircle
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface EffectOption {
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CardEffectControllerProps {
  activeEffects: string[];
  toggleEffect: (effect: string) => void;
  clearEffects: () => void;
  onSaveSnapshot: () => void;
  effectIntensity?: Record<string, number>;
  onEffectIntensityChange?: (effect: string, value: number) => void;
}

const CardEffectController: React.FC<CardEffectControllerProps> = ({
  activeEffects,
  toggleEffect,
  clearEffects,
  onSaveSnapshot,
  effectIntensity = {},
  onEffectIntensityChange
}) => {
  const [activeTab, setActiveTab] = useState<string>("effects");

  const effectOptions: EffectOption[] = [
    { name: 'Holographic', icon: <Sparkles className="h-4 w-4" />, description: 'Rainbow holographic pattern' },
    { name: 'Refractor', icon: <Flame className="h-4 w-4" />, description: 'Light refraction effect' },
    { name: 'Gold Foil', icon: <Award className="h-4 w-4" />, description: 'Premium gold accent' },
    { name: 'Chrome', icon: <PackageOpen className="h-4 w-4" />, description: 'Metallic chrome finish' },
    { name: 'Vintage', icon: <Palmtree className="h-4 w-4" />, description: 'Classic aged look' },
    { name: 'Electric', icon: <Zap className="h-4 w-4" />, description: 'Energetic glow effect' }
  ];

  const handleIntensityChange = (effect: string, values: number[]) => {
    if (onEffectIntensityChange) {
      onEffectIntensityChange(effect, values[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Card Effects</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onSaveSnapshot}
              title="Save current combination"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            {activeEffects.length > 0 && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearEffects}
                className="text-red-600"
                title="Clear all effects"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <TabsList className="grid grid-cols-2 m-4 mb-0">
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="effects" className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {effectOptions.map((effect) => {
              const isActive = activeEffects.includes(effect.name);
              return (
                <div 
                  key={effect.name}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleEffect(effect.name)}
                >
                  <div className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                    {effect.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{effect.name}</p>
                    <p className="text-xs text-gray-500">{effect.description}</p>
                  </div>
                  {isActive && (
                    <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Active
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          {activeEffects.length === 0 && (
            <div className="text-center py-4 text-gray-500 mt-4">
              No effects active. Click on an effect to apply it.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="p-4">
          {activeEffects.length > 0 ? (
            <div className="space-y-6">
              {activeEffects.map((effect) => (
                <div key={effect} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium flex items-center gap-1">
                      {effect === 'Holographic' && <Sparkles className="h-3 w-3" />}
                      {effect === 'Refractor' && <Flame className="h-3 w-3" />}
                      {effect === 'Gold Foil' && <Award className="h-3 w-3" />}
                      {effect === 'Chrome' && <PackageOpen className="h-3 w-3" />}
                      {effect === 'Vintage' && <Palmtree className="h-3 w-3" />}
                      {effect === 'Electric' && <Zap className="h-3 w-3" />}
                      {effect}
                    </Label>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => toggleEffect(effect)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">Intensity</span>
                      <span className="text-xs text-gray-500">
                        {Math.round((effectIntensity[effect.toLowerCase()] || 0.5) * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[effectIntensity[effect.toLowerCase()] * 100 || 50]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(values) => 
                        handleIntensityChange(effect.toLowerCase(), [values[0] / 100])
                      }
                    />
                  </div>
                  <hr className="my-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active effects to configure.</p>
              <p className="text-sm mt-1">Apply effects first to adjust their settings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardEffectController;
