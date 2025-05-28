
import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImmersiveSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'environment' | 'settings';
  onTabChange: (tab: 'environment' | 'settings') => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
}

const environments = [
  { value: 'studio', label: 'Photo Studio', description: 'Professional photography setup', icon: '🎬' },
  { value: 'gallery', label: 'Art Gallery', description: 'Museum exhibition space', icon: '🏛️' },
  { value: 'stadium', label: 'Sports Stadium', description: 'Athletic arena with floodlights', icon: '🏟️' },
  { value: 'twilight', label: 'Twilight Road', description: 'Evening countryside highway', icon: '🌅' },
  { value: 'quarry', label: 'Stone Quarry', description: 'Industrial mining landscape', icon: '⛰️' },
  { value: 'coastline', label: 'Ocean Coastline', description: 'Seaside cliff with sunset', icon: '🌊' },
  { value: 'hillside', label: 'Forest Hillside', description: 'Wooded mountain slope', icon: '🌲' },
  { value: 'milkyway', label: 'Milky Way', description: 'Starry night sky panorama', icon: '🌌' },
  { value: 'esplanade', label: 'Royal Esplanade', description: 'Elegant palace courtyard', icon: '✨' },
  { value: 'neonclub', label: 'Neon Studio', description: 'Vibrant neon-lit interior', icon: '🌆' },
  { value: 'industrial', label: 'Industrial Workshop', description: 'Factory foundry environment', icon: '🏭' },
];

const ImmersiveSettingsPanel: React.FC<ImmersiveSettingsPanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  environmentType,
  onEnvironmentChange
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/20 z-30 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/20">
        <button
          onClick={() => onTabChange('environment')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'environment'
              ? 'text-white bg-white/10 border-b-2 border-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="h-4 w-4" />
          Environment
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'text-white bg-white/10 border-b-2 border-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="h-4 w-4" />
          Display
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'environment' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Choose Environment
              </label>
              <div className="grid gap-2">
                {environments.map((env) => (
                  <button
                    key={env.value}
                    onClick={() => onEnvironmentChange(env.value)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      environmentType === env.value
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{env.icon}</span>
                      <div>
                        <div className="font-medium">{env.label}</div>
                        <div className="text-xs opacity-60">{env.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Auto Rotate
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Enable automatic rotation</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Shadows
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Cast shadows</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Rendering Quality
              </label>
              <Select defaultValue="high">
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Frame Rate Limit
              </label>
              <div className="space-y-2">
                <Slider
                  defaultValue={[60]}
                  max={120}
                  min={30}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>30 FPS</span>
                  <span>120 FPS</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Lighting Intensity
              </label>
              <div className="space-y-2">
                <Slider
                  defaultValue={[75]}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Dark</span>
                  <span>Bright</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImmersiveSettingsPanel;
