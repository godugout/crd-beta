
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Layers } from 'lucide-react';

interface EffectsControlsProps {
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  onEffectToggle: (effect: string) => void;
  onIntensityChange: (effect: string, intensity: number) => void;
}

const availableEffects = [
  { id: 'holographic', label: 'Holographic', color: 'from-purple-500 to-pink-500' },
  { id: 'chrome', label: 'Chrome', color: 'from-gray-400 to-gray-600' },
  { id: 'foil', label: 'Foil', color: 'from-yellow-400 to-orange-500' },
  { id: 'refractor', label: 'Refractor', color: 'from-blue-400 to-cyan-500' },
  { id: 'prismatic', label: 'Prismatic', color: 'from-green-400 to-blue-500' }
];

export const EffectsControls: React.FC<EffectsControlsProps> = ({
  activeEffects,
  effectIntensities,
  onEffectToggle,
  onIntensityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between text-white hover:bg-white/10"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Effects</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {activeEffects.length}
          </Badge>
        </Button>
      </div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Effect Toggles */}
              <div>
                <label className="text-xs font-medium text-white/80 mb-3 block">
                  Available Effects
                </label>
                <div className="space-y-2">
                  {availableEffects.map((effect) => (
                    <div key={effect.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Button
                          variant={activeEffects.includes(effect.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => onEffectToggle(effect.id)}
                          className={`text-xs ${
                            activeEffects.includes(effect.id) 
                              ? `bg-gradient-to-r ${effect.color}` 
                              : ''
                          }`}
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          {effect.label}
                        </Button>
                        {activeEffects.includes(effect.id) && (
                          <span className="text-xs text-white/60">
                            {(effectIntensities[effect.id] || 0).toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* Intensity Slider */}
                      {activeEffects.includes(effect.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4"
                        >
                          <Slider
                            value={[effectIntensities[effect.id] || 0]}
                            onValueChange={([value]) => onIntensityChange(effect.id, value)}
                            min={0}
                            max={1}
                            step={0.1}
                            className="w-full"
                          />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-xs font-medium text-white/80 mb-2 block">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEffectToggle('holographic');
                      onIntensityChange('holographic', 0.8);
                    }}
                    className="text-xs"
                  >
                    Rainbow
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEffectToggle('chrome');
                      onIntensityChange('chrome', 0.9);
                    }}
                    className="text-xs"
                  >
                    Mirror
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
