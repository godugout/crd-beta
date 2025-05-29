
import React from 'react';
import { X } from 'lucide-react';
import { Card } from '@/lib/types';
import { LightingSettings } from '@/hooks/useCardLighting';
import CustomizationPanel from './CustomizationPanel';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface UnifiedSettingsPanelProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'scenes' | 'customize';
  onTabChange: (tab: 'scenes' | 'customize') => void;
  environmentType: string;
  onEnvironmentChange: (environment: string) => void;
  lightingSettings: LightingSettings;
  onUpdateLighting: (settings: Partial<LightingSettings>) => void;
  materialSettings: MaterialSettings;
  onUpdateMaterial: (settings: Partial<MaterialSettings>) => void;
  onShareCard: () => void;
  onDownloadCard: () => void;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  onEffectsChange?: (effects: string[]) => void;
  onEffectIntensityChange?: (effect: string, intensity: number) => void;
}

const UnifiedSettingsPanel: React.FC<UnifiedSettingsPanelProps> = ({
  card,
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  environmentType,
  onEnvironmentChange,
  lightingSettings,
  onUpdateLighting,
  materialSettings,
  onUpdateMaterial,
  onShareCard,
  onDownloadCard,
  activeEffects = [],
  effectIntensities = {},
  onEffectsChange = () => {},
  onEffectIntensityChange = () => {}
}) => {
  if (!isOpen) return null;

  const environments = [
    { id: 'studio', name: 'Studio', emoji: '🎬' },
    { id: 'gallery', name: 'Gallery', emoji: '🏛️' },
    { id: 'stadium', name: 'Stadium', emoji: '🏟️' },
    { id: 'twilight', name: 'Twilight', emoji: '🌅' },
    { id: 'quarry', name: 'Quarry', emoji: '⛰️' },
    { id: 'coastline', name: 'Coastline', emoji: '🌊' },
    { id: 'hillside', name: 'Hillside', emoji: '🌲' },
    { id: 'milkyway', name: 'Milky Way', emoji: '🌌' },
    { id: 'esplanade', name: 'Esplanade', emoji: '✨' },
    { id: 'neonclub', name: 'Neon Club', emoji: '🌆' },
    { id: 'industrial', name: 'Industrial', emoji: '🏭' }
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-gray-900/95 backdrop-blur-lg border-l border-gray-700 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Customize Card</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => onTabChange('scenes')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'scenes'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Scenes
        </button>
        <button
          onClick={() => onTabChange('customize')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'customize'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Customize
        </button>
      </div>

      {/* Panel Content */}
      <div className="h-[calc(100%-120px)]">
        {activeTab === 'scenes' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Environment Scenes</h3>
            <div className="grid grid-cols-2 gap-3">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => onEnvironmentChange(env.id)}
                  className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                    environmentType === env.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50'
                  }`}
                >
                  <span className="text-2xl">{env.emoji}</span>
                  <span>{env.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customize' && (
          <CustomizationPanel
            card={card}
            isOpen={isOpen}
            onClose={onClose}
            lightingSettings={lightingSettings}
            onUpdateLighting={onUpdateLighting}
            materialSettings={materialSettings}
            onUpdateMaterial={onUpdateMaterial}
            onShareCard={onShareCard}
            onDownloadCard={onDownloadCard}
            activeEffects={activeEffects}
            effectIntensities={effectIntensities}
            onEffectsChange={onEffectsChange}
            onEffectIntensityChange={onEffectIntensityChange}
          />
        )}
      </div>
    </div>
  );
};

export default UnifiedSettingsPanel;
