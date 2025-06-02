
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Card } from '@/lib/types';
import EnvironmentRenderer from '@/components/immersive-viewer/EnvironmentRenderer';
import ImmersiveCard from '@/components/immersive-viewer/ImmersiveCard';
import ImmersiveViewerUI from './ImmersiveViewerUI';

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
    <div className="h-screen bg-gray-900 relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full" shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={lightingSettings?.autoRotate || false}
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
        />

        {/* Environment and Lighting */}
        <EnvironmentRenderer
          environmentType={environmentType}
          lightingSettings={lightingSettings}
        />

        {/* Primary Lighting */}
        <directionalLight
          position={[
            lightingSettings?.primaryLight?.x || 10,
            lightingSettings?.primaryLight?.y || 10,
            lightingSettings?.primaryLight?.z || 5
          ]}
          intensity={lightingSettings?.primaryLight?.intensity || 1.2}
          color={lightingSettings?.primaryLight?.color || '#ffffff'}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Ambient Lighting */}
        <ambientLight
          intensity={lightingSettings?.ambientLight?.intensity || 0.6}
          color={lightingSettings?.ambientLight?.color || '#f0f0ff'}
        />

        {/* 3D Card */}
        <ImmersiveCard
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          effectIntensities={effectIntensities}
          materialSettings={materialSettings}
          lightingSettings={lightingSettings}
        />
      </Canvas>

      {/* UI Overlay */}
      <ImmersiveViewerUI
        card={card}
        isFlipped={isFlipped}
        isSettingsPanelOpen={isSettingsPanelOpen}
        activeSettingsTab={activeSettingsTab}
        activeEffects={activeEffects}
        effectIntensities={effectIntensities}
        environmentType={environmentType}
        materialSettings={materialSettings}
        lightingSettings={lightingSettings}
        handlers={handlers}
        setIsSettingsPanelOpen={setIsSettingsPanelOpen}
        setActiveSettingsTab={setActiveSettingsTab}
      />
    </div>
  );
};

export default ImmersiveViewerLayout;
