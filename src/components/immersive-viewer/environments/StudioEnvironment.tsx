
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
        background={false}
        blur={0.3}
      />
      
      {/* Professional studio lighting */}
      <ambientLight intensity={0.4} color="#f0f0ff" />
      
      {/* Key light */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={2.8} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill lights */}
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.5} 
        color="#f0f0ff"
      />
      <directionalLight 
        position={[0, 8, -15]} 
        intensity={1.0} 
        color="#fff5e0"
      />
      
      {/* Professional studio spots */}
      <spotLight
        position={[15, 20, 15]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-15, 20, 15]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={2.2}
        color="#ffffff"
      />
      <spotLight
        position={[0, 25, -20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.4}
        intensity={1.8}
        color="#fff8dc"
      />
      
      {/* Rim lighting */}
      <pointLight position={[20, 10, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-20, 10, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 5, 25]} intensity={0.6} color="#f8f8ff" />
      
      {/* Minimal studio atmosphere */}
      <fog attach="fog" args={['#f0f0f0', 100, 300]} />
    </>
  );
};
