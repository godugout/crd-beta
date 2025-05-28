
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sun, Settings, Lightbulb } from 'lucide-react';
import { LightingSettings, LightingPreset, LIGHTING_PRESETS } from '@/hooks/useCardLighting';

interface LightingControlsProps {
  lightingSettings: LightingSettings;
  lightingPreset: LightingPreset;
  onPresetChange: (preset: LightingPreset) => void;
  onIntensityChange: (intensity: number) => void;
  onAmbientChange: (intensity: number) => void;
  onToggleDynamic: () => void;
}

export const LightingControls: React.FC<LightingControlsProps> = ({
  lightingSettings,
  lightingPreset,
  onPresetChange,
  onIntensityChange,
  onAmbientChange,
  onToggleDynamic
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const presetLabels: Record<LightingPreset, string> = {
    studio: 'Studio',
    natural: 'Natural',
    dramatic: 'Dramatic',
    display_case: 'Display Case'
  };

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
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium">Lighting</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {presetLabels[lightingPreset]}
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
              {/* Lighting Presets */}
              <div>
                <label className="text-xs font-medium text-white/80 mb-2 block">
                  Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(LIGHTING_PRESETS) as LightingPreset[]).map((preset) => (
                    <Button
                      key={preset}
                      variant={lightingPreset === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPresetChange(preset)}
                      className="text-xs"
                    >
                      {presetLabels[preset]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Primary Light Intensity */}
              <div>
                <label className="text-xs font-medium text-white/80 mb-2 block">
                  Primary Light: {lightingSettings.primaryLight.intensity.toFixed(1)}
                </label>
                <Slider
                  value={[lightingSettings.primaryLight.intensity]}
                  onValueChange={([value]) => onIntensityChange(value)}
                  min={0}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Ambient Light Intensity */}
              <div>
                <label className="text-xs font-medium text-white/80 mb-2 block">
                  Ambient Light: {lightingSettings.ambientLight.intensity.toFixed(1)}
                </label>
                <Slider
                  value={[lightingSettings.ambientLight.intensity]}
                  onValueChange={([value]) => onAmbientChange(value)}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Dynamic Lighting Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/80">
                  Dynamic Lighting
                </span>
                <Button
                  variant={lightingSettings.useDynamicLighting ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleDynamic}
                  className="text-xs"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {lightingSettings.useDynamicLighting ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
