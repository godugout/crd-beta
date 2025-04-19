
import React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useLighting } from '@/context/LightingContext';

const DynamicLighting: React.FC = () => {
  const { lightSettings } = useLighting();
  const { scene } = useThree();

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
        preset={lightSettings.environmentType}
        background={false}
      />
    </>
  );
};

export default DynamicLighting;
