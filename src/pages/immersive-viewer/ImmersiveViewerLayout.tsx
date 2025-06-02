
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
  activeSettingsTab: string;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  environmentType: string;
  materialSettings: any;
  lightingSettings: any;
  handlers: any;
  setIsSettingsPanelOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: string) => void;
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
      {/* Main 3D Scene */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={lightingSettings?.autoRotate || false}
          autoRotateSpeed={0.5}
        />
        
        {/* Pass lighting settings to EnvironmentRenderer */}
        <EnvironmentRenderer 
          environmentType={environmentType} 
          lightingSettings={lightingSettings}
        />
        
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
