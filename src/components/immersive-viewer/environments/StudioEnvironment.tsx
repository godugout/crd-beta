
import React from 'react';
import { Environment } from '@react-three/drei';

export const StudioEnvironment = () => {
  return (
    <>
      {/* Clean neutral studio background */}
      <color attach="background" args={['#f0f0f0']} />
      
      {/* Use built-in studio environment */}
      <Environment 
        preset="studio"
        background={true}
        blur={0.2}
      />
      
      {/* Professional studio lighting */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
      
      {/* Key light */}
      <directionalLight 
        position={[12, 20, 15]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill lights */}
      <directionalLight 
        position={[-10, 18, 12]} 
        intensity={2.2} 
        color="#f0f0ff"
      />
      <directionalLight 
        position={[0, 12, -20]} 
        intensity={1.8} 
        color="#fff5e0"
      />
      
      {/* Professional studio spots */}
      <spotLight
        position={[18, 28, 20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.2}
        intensity={3.8}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-18, 28, 20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.2}
        intensity={3.5}
        color="#ffffff"
      />
      <spotLight
        position={[0, 35, -25]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={3.0}
        color="#fff8dc"
      />
      
      {/* Rim lighting */}
      <pointLight position={[25, 15, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-25, 15, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 8, 35]} intensity={1.0} color="#f8f8ff" />
    </>
  );
};
