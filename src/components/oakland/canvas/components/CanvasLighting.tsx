
import React from 'react';
import { BackgroundSettings } from '../BackgroundSelector';

interface CanvasLightingProps {
  backgroundSettings: BackgroundSettings;
}

const CanvasLighting: React.FC<CanvasLightingProps> = ({ backgroundSettings }) => {
  return (
    <>
      {/* Enhanced Lighting Setup - apply intensity from background settings */}
      <ambientLight intensity={0.4 * backgroundSettings.intensity} color="#f0f0ff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2 * backgroundSettings.intensity}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight 
        position={[-5, 5, 5]} 
        intensity={0.6 * backgroundSettings.intensity} 
        color="#EFB21E" 
      />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.8 * backgroundSettings.intensity}
        angle={0.3}
        penumbra={0.5}
        color="#ffffff"
        castShadow
      />
    </>
  );
};

export default CanvasLighting;
