
import React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useLighting } from '@/context/LightingContext';
import { mapLightingPresetToEnvironment, ValidEnvironmentPreset } from '@/utils/environmentPresets';

const DynamicLighting: React.FC = () => {
  const { lightSettings } = useLighting();
  const { scene } = useThree();
  
  // Map our custom environment type to one supported by drei
  const environmentPreset = mapLightingPresetToEnvironment(lightSettings.environmentType);

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
