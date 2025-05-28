
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Palette, Sliders, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrdButton } from '@/components/ui/crd-button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { LightingSettings } from '@/hooks/useCardLighting';

interface ViewerSettingsProps {
  settings: LightingSettings;
  onUpdateSettings: (key: string, value: any) => void;
  onApplyPreset: (preset: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  settings,
  onUpdateSettings,
  onApplyPreset,
  isOpen,
  onClose
}) => {
  const presets = [
    { id: 'studio', name: 'Studio', icon: Sun },
    { id: 'gallery', name: 'Gallery', icon: Palette },
    { id: 'dramatic', name: 'Dramatic', icon: Moon },
    { id: 'showcase', name: 'Showcase', icon: Sliders }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-0 right-0 h-full w-80 z-50 pointer-events-auto"
        >
          <div className="glass-panel h-full m-4 rounded-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Lighting Settings</h2>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Presets */}
            <div className="mb-8">
              <Label className="text-white text-sm font-medium mb-3 block">Environment Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <CrdButton
                      key={preset.id}
                      variant="soft"
                      size="sm"
                      onClick={() => onApplyPreset(preset.id)}
                      className="h-12 flex-col space-y-1"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{preset.name}</span>
                    </CrdButton>
                  );
                })}
              </div>
            </div>

            {/* Primary Light Controls */}
            <div className="mb-8">
              <Label className="text-white text-sm font-medium mb-4 block">Primary Light</Label>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white/70 text-xs mb-2 block">Intensity</Label>
                  <Slider
                    value={[settings.primaryLight.intensity]}
                    onValueChange={([value]) => onUpdateSettings('primaryLight.intensity', value)}
                    max={3}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-white/70 text-xs mb-2 block">X Position</Label>
                  <Slider
                    value={[settings.primaryLight.x]}
                    onValueChange={([value]) => onUpdateSettings('primaryLight.x', value)}
                    max={20}
                    min={-20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-white/70 text-xs mb-2 block">Y Position</Label>
                  <Slider
                    value={[settings.primaryLight.y]}
                    onValueChange={([value]) => onUpdateSettings('primaryLight.y', value)}
                    max={20}
                    min={-20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-white/70 text-xs mb-2 block">Z Position</Label>
                  <Slider
                    value={[settings.primaryLight.z]}
                    onValueChange={([value]) => onUpdateSettings('primaryLight.z', value)}
                    max={20}
                    min={-20}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Ambient Light Controls */}
            <div className="mb-8">
              <Label className="text-white text-sm font-medium mb-4 block">Ambient Light</Label>
              
              <div>
                <Label className="text-white/70 text-xs mb-2 block">Intensity</Label>
                <Slider
                  value={[settings.ambientLight.intensity]}
                  onValueChange={([value]) => onUpdateSettings('ambientLight.intensity', value)}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Material Settings */}
            <div className="mb-8">
              <Label className="text-white text-sm font-medium mb-4 block">Material</Label>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white/70 text-xs mb-2 block">Environment Map Intensity</Label>
                  <Slider
                    value={[settings.envMapIntensity || 1]}
                    onValueChange={([value]) => onUpdateSettings('envMapIntensity', value)}
                    max={3}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Auto Rotate */}
            <div className="mb-6">
              <Label className="text-white text-sm font-medium mb-3 block">Animation</Label>
              <CrdButton
                variant={settings.autoRotate ? "spectrum" : "soft"}
                size="sm"
                onClick={() => onUpdateSettings('autoRotate', !settings.autoRotate)}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Auto Rotate {settings.autoRotate ? 'On' : 'Off'}
              </CrdButton>
            </div>

            {/* Reset Button */}
            <CrdButton
              variant="outline"
              size="sm"
              onClick={() => onApplyPreset('studio')}
              className="w-full"
            >
              Reset to Default
            </CrdButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewerSettings;
