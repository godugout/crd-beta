
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
              {[
                { id: 'studio', name: 'Studio' },
                { id: 'gallery', name: 'Gallery' },
                { id: 'stadium', name: 'Stadium' },
                { id: 'twilight', name: 'Twilight' },
                { id: 'quarry', name: 'Quarry' },
                { id: 'coastline', name: 'Coastline' },
                { id: 'hillside', name: 'Hillside' },
                { id: 'milkyway', name: 'Milky Way' },
                { id: 'esplanade', name: 'Esplanade' },
                { id: 'neonclub', name: 'Neon Club' },
                { id: 'industrial', name: 'Industrial' }
              ].map((env) => (
                <button
                  key={env.id}
                  onClick={() => onEnvironmentChange(env.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    environmentType === env.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {env.name}
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
