
import React from 'react';
import BackgroundTypeSelector from './background/BackgroundTypeSelector';
import HdrPresetSelector from './background/HdrPresetSelector';
import GradientSelector from './background/GradientSelector';
import SolidColorSelector from './background/SolidColorSelector';
import EnvironmentControls from './background/EnvironmentControls';

export interface BackgroundSettings {
  type: 'preset' | 'gradient' | 'solid';
  preset?: string;
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
  solid?: string;
  intensity: number;
  blur: number;
  rotation: number;
}

interface BackgroundSelectorProps {
  settings: BackgroundSettings;
  onSettingsChange: (settings: BackgroundSettings) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSettings = (updates: Partial<BackgroundSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-6">
      <BackgroundTypeSelector 
        selectedType={settings.type}
        onTypeChange={(type) => updateSettings({ type })}
      />

      {settings.type === 'preset' && (
        <HdrPresetSelector
          selectedPreset={settings.preset}
          onPresetChange={(preset) => updateSettings({ preset })}
        />
      )}

      {settings.type === 'gradient' && (
        <GradientSelector
          onGradientChange={(gradient) => updateSettings({ gradient })}
        />
      )}

      {settings.type === 'solid' && (
        <SolidColorSelector
          selectedColor={settings.solid}
          onColorChange={(solid) => updateSettings({ solid })}
        />
      )}

      <EnvironmentControls 
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default BackgroundSelector;
