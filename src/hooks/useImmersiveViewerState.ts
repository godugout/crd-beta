
import { useState } from 'react';
import { LightingPreset } from '@/hooks/useCardLighting';

export const useImmersiveViewerState = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'scenes' | 'customize'>('scenes');
  
  // Advanced customization state
  const [activeEffects, setActiveEffects] = useState<string[]>(['holographic']);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({
    holographic: 0.7,
    refractor: 0.5,
    foil: 0.6,
    chrome: 0.4,
    prismatic: 0.8,
    vintage: 0.3,
    neon: 0.5,
    galaxy: 0.6
  });
  const [environmentType, setEnvironmentType] = useState<LightingPreset>('studio');
  const [materialSettings, setMaterialSettings] = useState({
    roughness: 0.2,
    metalness: 0.8,
    reflectivity: 0.5,
    clearcoat: 0.7,
    envMapIntensity: 1.0
  });
  const [lightingSettings, setLightingSettings] = useState({
    primaryLight: {
      x: 10,
      y: 10,
      z: 10,
      intensity: 1.2,
      color: '#ffffff'
    },
    ambientLight: {
      intensity: 0.6,
      color: '#f0f0ff'
    },
    environmentType: 'studio' as LightingPreset,
    envMapIntensity: 1.0,
    useDynamicLighting: true
  });

  return {
    isFlipped,
    setIsFlipped,
    isSettingsPanelOpen,
    setIsSettingsPanelOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    activeEffects,
    setActiveEffects,
    effectIntensities,
    setEffectIntensities,
    environmentType,
    setEnvironmentType,
    materialSettings,
    setMaterialSettings,
    lightingSettings,
    setLightingSettings
  };
};
