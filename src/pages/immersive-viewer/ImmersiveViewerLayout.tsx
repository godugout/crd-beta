
import React from 'react';
import { Card } from '@/lib/types';
import RealisticCardViewer from '@/components/immersive-viewer/RealisticCardViewer';
import ImmersiveViewerInterface from '@/components/immersive-viewer/ImmersiveViewerInterface';
import UnifiedSettingsPanel from '@/components/immersive-viewer/UnifiedSettingsPanel';

interface ImmersiveViewerLayoutProps {
  card: Card;
  isFlipped: boolean;
  isSettingsPanelOpen: boolean;
  activeSettingsTab: 'scenes' | 'customize';
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  environmentType: string;
  materialSettings: any;
  lightingSettings: any;
  handlers: {
    handleFlip: () => void;
    handleBack: () => void;
    handleShare: () => void;
    handleDownload: () => void;
    handleLike: () => void;
    handleBookmark: () => void;
    handleRemix: () => void;
    handleOpenScenesPanel: () => void;
    handleOpenCustomizePanel: () => void;
    handleEnvironmentChange: (environment: string) => void;
    handleEffectsChange: (effects: string[]) => void;
    handleEffectIntensityChange: (effect: string, intensity: number) => void;
    handleMaterialChange: (changes: any) => void;
    handleLightingChange: (changes: any) => void;
  };
  setIsSettingsPanelOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: 'scenes' | 'customize') => void;
}

const ImmersiveViewerLayout: React.FC<ImmersiveViewerLayoutProps> = ({
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Main viewer container - adjust width when panel is open */}
      <div 
        className={`transition-all duration-300 ${
          isSettingsPanelOpen ? 'mr-[420px]' : 'mr-0'
        }`}
        style={{ height: '100vh' }}
      >
        {/* 3D Card Viewer */}
        <RealisticCardViewer
          card={card}
          isCustomizationOpen={isSettingsPanelOpen}
          onToggleCustomization={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          environmentType={environmentType}
          materialSettings={materialSettings}
          lightingSettings={lightingSettings}
        />
        
        {/* Interface Overlay */}
        <ImmersiveViewerInterface
          card={card}
          isFlipped={isFlipped}
          onFlip={handlers.handleFlip}
          onBack={handlers.handleBack}
          onShare={handlers.handleShare}
          onDownload={handlers.handleDownload}
          onLike={handlers.handleLike}
          onBookmark={handlers.handleBookmark}
          onRemix={handlers.handleRemix}
          isCustomizationOpen={isSettingsPanelOpen}
          onToggleCustomization={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
          environmentType={environmentType}
          onEnvironmentChange={handlers.handleEnvironmentChange}
          onOpenScenesPanel={handlers.handleOpenScenesPanel}
          onOpenCustomizePanel={handlers.handleOpenCustomizePanel}
        />
      </div>
      
      {/* Unified Settings Panel */}
      <UnifiedSettingsPanel
        card={card}
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        activeTab={activeSettingsTab}
        onTabChange={setActiveSettingsTab}
        environmentType={environmentType}
        onEnvironmentChange={handlers.handleEnvironmentChange}
        lightingSettings={lightingSettings}
        onUpdateLighting={handlers.handleLightingChange}
        materialSettings={materialSettings}
        onUpdateMaterial={handlers.handleMaterialChange}
        onShareCard={handlers.handleShare}
        onDownloadCard={handlers.handleDownload}
        activeEffects={activeEffects}
        effectIntensities={effectIntensities}
        onEffectsChange={handlers.handleEffectsChange}
        onEffectIntensityChange={handlers.handleEffectIntensityChange}
      />
    </div>
  );
};

export default ImmersiveViewerLayout;
