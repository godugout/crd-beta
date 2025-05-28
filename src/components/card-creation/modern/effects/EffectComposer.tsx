
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Eye, 
  Move, 
  Trash2, 
  Plus,
  RotateCw,
  Zap,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export type EffectType = 
  | 'holographic' 
  | 'refractor' 
  | 'foil' 
  | 'chrome' 
  | 'matte' 
  | 'gloss' 
  | 'textured' 
  | 'animated';

export type BlendMode = 
  | 'normal' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'soft-light' 
  | 'hard-light';

export interface Effect {
  id: string;
  type: EffectType;
  name: string;
  parameters: {
    intensity: number;
    color?: string;
    pattern?: string;
    scale?: number;
    angle?: number;
    speed?: number;
  };
  blendMode: BlendMode;
  maskLayer?: string;
  enabled: boolean;
}

interface EffectComposerProps {
  effects: Effect[];
  onAddEffect: (type: EffectType) => void;
  onRemoveEffect: (id: string) => void;
  onUpdateEffect: (id: string, params: Partial<Effect>) => void;
  onReorderEffects: (effects: Effect[]) => void;
  onPreviewEffects: () => void;
  className?: string;
}

const EFFECT_TEMPLATES: Record<EffectType, { 
  name: string; 
  icon: React.ReactNode; 
  description: string;
  defaultParams: Effect['parameters'];
  color: string;
}> = {
  holographic: {
    name: 'Holographic',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Rainbow spectrum that shifts with movement',
    defaultParams: { intensity: 0.8, scale: 1.0, speed: 1.0 },
    color: 'from-pink-500 to-violet-500'
  },
  refractor: {
    name: 'Refractor',
    icon: <Zap className="w-4 h-4" />,
    description: 'Prismatic light patterns',
    defaultParams: { intensity: 0.7, pattern: 'prism', scale: 1.2 },
    color: 'from-cyan-500 to-blue-500'
  },
  foil: {
    name: 'Foil',
    icon: <Palette className="w-4 h-4" />,
    description: 'Metallic finish with environment reflection',
    defaultParams: { intensity: 0.9, color: '#C0C0C0', scale: 1.0 },
    color: 'from-gray-400 to-gray-600'
  },
  chrome: {
    name: 'Chrome',
    icon: <Eye className="w-4 h-4" />,
    description: 'Mirror-like surface',
    defaultParams: { intensity: 1.0, scale: 1.0 },
    color: 'from-blue-300 to-blue-500'
  },
  matte: {
    name: 'Matte',
    icon: <Layers className="w-4 h-4" />,
    description: 'Non-reflective textured finish',
    defaultParams: { intensity: 0.6, pattern: 'paper' },
    color: 'from-gray-300 to-gray-500'
  },
  gloss: {
    name: 'Gloss',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'High shine with specular highlights',
    defaultParams: { intensity: 0.8, scale: 1.1 },
    color: 'from-white to-gray-200'
  },
  textured: {
    name: 'Textured',
    icon: <Layers className="w-4 h-4" />,
    description: 'Canvas, linen, or custom patterns',
    defaultParams: { intensity: 0.5, pattern: 'canvas', scale: 1.0 },
    color: 'from-amber-300 to-orange-400'
  },
  animated: {
    name: 'Animated',
    icon: <RotateCw className="w-4 h-4" />,
    description: 'Shimmer, sparkle, or pulse effects',
    defaultParams: { intensity: 0.7, speed: 1.0, pattern: 'shimmer' },
    color: 'from-purple-400 to-pink-400'
  }
};

const EffectComposer: React.FC<EffectComposerProps> = ({
  effects,
  onAddEffect,
  onRemoveEffect,
  onUpdateEffect,
  onReorderEffects,
  onPreviewEffects,
  className = ''
}) => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const moveEffect = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= effects.length) return;
    
    const newEffects = [...effects];
    const [movedEffect] = newEffects.splice(fromIndex, 1);
    newEffects.splice(toIndex, 0, movedEffect);
    onReorderEffects(newEffects);
  }, [effects, onReorderEffects]);

  const handleAddEffect = (type: EffectType) => {
    onAddEffect(type);
  };

  const updateEffectParameter = (
    id: string, 
    parameter: string, 
    value: any
  ) => {
    const effect = effects.find(e => e.id === id);
    if (!effect) return;

    onUpdateEffect(id, {
      parameters: {
        ...effect.parameters,
        [parameter]: value
      }
    });
  };

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Effect Composer</h3>
          <p className="text-gray-300 text-sm">Stack and customize effects for your card</p>
        </div>
        <Button
          onClick={onPreviewEffects}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview in 3D
        </Button>
      </div>

      <Tabs defaultValue="stack" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="stack" className="text-white">Effect Stack</TabsTrigger>
          <TabsTrigger value="library" className="text-white">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="stack" className="space-y-4">
          {effects.length === 0 ? (
            <Card className="p-8 text-center bg-white/5 border-white/10">
              <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-300 mb-2">No effects added yet</p>
              <p className="text-gray-500 text-sm">Add effects to create stunning card finishes</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {effects.map((effect, index) => (
                <Card
                  key={effect.id}
                  className={`p-4 bg-white/10 border-white/20 transition-all ${
                    activeEffect === effect.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setActiveEffect(activeEffect === effect.id ? null : effect.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${EFFECT_TEMPLATES[effect.type].color} flex items-center justify-center`}>
                        {EFFECT_TEMPLATES[effect.type].icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{effect.name}</h4>
                        <p className="text-gray-400 text-xs">{effect.blendMode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={effect.enabled ? 'default' : 'secondary'}>
                        {Math.round(effect.parameters.intensity * 100)}%
                      </Badge>
                      
                      {/* Move up button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveEffect(index, index - 1);
                        }}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white h-8 w-8 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      
                      {/* Move down button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveEffect(index, index + 1);
                        }}
                        disabled={index === effects.length - 1}
                        className="text-gray-400 hover:text-white h-8 w-8 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveEffect(effect.id);
                        }}
                        className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {activeEffect === effect.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Intensity: {Math.round(effect.parameters.intensity * 100)}%
                        </label>
                        <Slider
                          value={[effect.parameters.intensity]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={([value]) => 
                            updateEffectParameter(effect.id, 'intensity', value)
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Blend Mode
                          </label>
                          <Select
                            value={effect.blendMode}
                            onValueChange={(value) => 
                              onUpdateEffect(effect.id, { blendMode: value as BlendMode })
                            }
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="multiply">Multiply</SelectItem>
                              <SelectItem value="screen">Screen</SelectItem>
                              <SelectItem value="overlay">Overlay</SelectItem>
                              <SelectItem value="soft-light">Soft Light</SelectItem>
                              <SelectItem value="hard-light">Hard Light</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {effect.parameters.scale !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Scale: {effect.parameters.scale.toFixed(1)}x
                            </label>
                            <Slider
                              value={[effect.parameters.scale]}
                              min={0.5}
                              max={3.0}
                              step={0.1}
                              onValueChange={([value]) => 
                                updateEffectParameter(effect.id, 'scale', value)
                              }
                            />
                          </div>
                        )}
                      </div>

                      {effect.parameters.color && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Color
                          </label>
                          <input
                            type="color"
                            value={effect.parameters.color}
                            onChange={(e) => 
                              updateEffectParameter(effect.id, 'color', e.target.value)
                            }
                            className="w-full h-10 rounded border-2 border-white/20"
                          />
                        </div>
                      )}

                      {effect.parameters.speed !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Animation Speed: {effect.parameters.speed.toFixed(1)}x
                          </label>
                          <Slider
                            value={[effect.parameters.speed]}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            onValueChange={([value]) => 
                              updateEffectParameter(effect.id, 'speed', value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(EFFECT_TEMPLATES).map(([type, template]) => (
              <Card
                key={type}
                className="p-4 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
                onClick={() => handleAddEffect(type as EffectType)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {template.icon}
                  </div>
                  <h4 className="text-white font-medium">{template.name}</h4>
                </div>
                <p className="text-gray-400 text-xs">{template.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EffectComposer;
