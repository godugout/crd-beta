
import React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useLighting } from '@/context/LightingContext';

// Map our custom environment types to the ones supported by drei
const mapEnvironmentType = (type: string): "studio" | "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "sunset" | "warehouse" => {
  switch (type) {
    case 'natural':
      return 'forest';
    case 'dramatic':
      return 'night';
    case 'display_case':
      return 'lobby';
    case 'studio':
    default:
      return 'studio';
  }
};

const DynamicLighting: React.FC = () => {
  const { lightSettings } = useLighting();
  const { scene } = useThree();
  
  // Map our custom environment type to one supported by drei
  const environmentPreset = mapEnvironmentType(lightSettings.environmentType);

  return (
    <>
      <ambientLight
        intensity={lightSettings.ambientLight.intensity}
        color={lightSettings.ambientLight.color}
      />
      
      <directionalLight
        position={[
          lightSettings.primaryLight.x,
          lightSettings.primaryLight.y,
          lightSettings.primaryLight.z
        ]}
        intensity={lightSettings.primaryLight.intensity}
        color={lightSettings.primaryLight.color}
        castShadow
      />
      
      <Environment
        preset={environmentPreset}
        background={false}
      />
    </>
  );
};

export default DynamicLighting;
