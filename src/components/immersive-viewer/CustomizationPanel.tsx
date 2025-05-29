
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { LightingSettings, LightingPreset } from '@/hooks/useCardLighting';
import VisualEffectsSection from './sections/VisualEffectsSection';
import LightingSection from './sections/LightingSection';
import MaterialPropertiesSection from './sections/MaterialPropertiesSection';
import SaveRemixSection from './sections/SaveRemixSection';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface CustomizationPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  lightingSettings: LightingSettings;
  onUpdateLighting: (settings: Partial<LightingSettings>) => void;
  onApplyPreset?: (preset: LightingPreset) => void;
  onToggleDynamicLighting?: () => void;
  materialSettings?: MaterialSettings;
  onUpdateMaterial?: (settings: Partial<MaterialSettings>) => void;
  onShareCard?: () => void;
  onDownloadCard?: () => void;
  isUserCustomized?: boolean;
  // Add effect props
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  onEffectsChange?: (effects: string[]) => void;
  onEffectIntensityChange?: (effect: string, intensity: number) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  card,
  isOpen,
  onClose,
  lightingSettings,
  onUpdateLighting,
  onApplyPreset,
  onToggleDynamicLighting,
  materialSettings = { 
    roughness: 0.2, 
    metalness: 0.8,
    reflectivity: 0.2,
    clearcoat: 0.1,
    envMapIntensity: 1.0
  },
  onUpdateMaterial = () => {},
  onShareCard,
  onDownloadCard,
  isUserCustomized,
  activeEffects = ['holographic'],
  effectIntensities = {},
  onEffectsChange = () => {},
  onEffectIntensityChange = () => {}
}) => {
  const [lightingMode, setLightingMode] = useState<'easy' | 'pro'>('easy');
  const [brightness, setBrightness] = useState(120);

  // Handle effect changes
  const handleEffectChange = (effectId: string) => {
    const newEffects = [effectId]; // For now, only allow one effect at a time
    onEffectsChange(newEffects);
  };

  const handleIntensityChange = (intensity: number) => {
    if (activeEffects.length > 0) {
      onEffectIntensityChange(activeEffects[0], intensity / 100);
    }
  };

  // Get current effect intensity as percentage
  const getCurrentIntensity = () => {
    if (activeEffects.length > 0) {
      return (effectIntensities[activeEffects[0]] || 0.7) * 100;
    }
    return 70;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        <VisualEffectsSection
          activeEffect={activeEffects[0] || 'holographic'}
          effectIntensity={getCurrentIntensity()}
          onEffectChange={handleEffectChange}
          onIntensityChange={handleIntensityChange}
        />

        <LightingSection
          lightingSettings={lightingSettings}
          lightingMode={lightingMode}
          brightness={brightness}
          onUpdateLighting={onUpdateLighting}
          onApplyPreset={onApplyPreset}
          onLightingModeChange={setLightingMode}
          onBrightnessChange={setBrightness}
        />

        <MaterialPropertiesSection
          materialSettings={materialSettings}
          onUpdateMaterial={onUpdateMaterial}
        />

        <SaveRemixSection />
      </div>
    </div>
  );
};

export default CustomizationPanel;
