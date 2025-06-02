
import React from 'react';
import { Card } from '@/lib/types';
import { LightingSettings } from '@/hooks/useCardLighting';

interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  envMapIntensity: number;
}

interface ImmersiveViewerUIProps {
  card: Card;
  isFlipped: boolean;
  isSettingsPanelOpen: boolean;
  activeSettingsTab: string;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  environmentType: string;
  materialSettings: MaterialSettings;
  lightingSettings: LightingSettings;
  handlers: any;
  setIsSettingsPanelOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: string) => void;
}

const ImmersiveViewerUI: React.FC<ImmersiveViewerUIProps> = ({
  card,
  isFlipped,
  isSettingsPanelOpen,
  activeSettingsTab,
  activeEffects,
  effectIntensities,
  environmentType,
  materialSettings,
  lightingSettings,
  handlers,
  setIsSettingsPanelOpen,
  setActiveSettingsTab
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* UI overlay content will go here */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <button
          onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          Settings
        </button>
      </div>
      
      {isSettingsPanelOpen && (
        <div className="absolute right-0 top-0 h-full w-80 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="p-4 text-white">
            <h3 className="text-lg font-semibold mb-4">Immersive Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Environment</label>
                <select 
                  value={environmentType} 
                  onChange={(e) => handlers?.onEnvironmentChange?.(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded px-3 py-2"
                >
                  <option value="studio">Studio</option>
                  <option value="gallery">Gallery</option>
                  <option value="stadium">Stadium</option>
                  <option value="twilight">Twilight</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Active Effects</label>
                <div className="space-y-2">
                  {activeEffects.map((effect) => (
                    <div key={effect} className="flex items-center justify-between">
                      <span className="text-sm">{effect}</span>
                      <span className="text-xs text-gray-400">
                        {Math.round((effectIntensities[effect] || 0) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmersiveViewerUI;
