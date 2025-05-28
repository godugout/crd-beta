
import React from 'react';
import { Environment } from '@react-three/drei';

export const StudioEnvironment = () => {
  return (
    <>
      {/* Studio background */}
      <color attach="background" args={['#f0f0f0']} />
      
      {/* Use built-in studio environment */}
      <Environment 
        preset="studio"
        background={false}
        blur={0.2}
      />
      
      {/* Professional studio lighting */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={3.0} 
        color="#ffffff"
        castShadow
      />
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
      
      {/* Key lights */}
      <spotLight
        position={[15, 20, 15]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={2.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-15, 20, 15]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={1.8}
        color="#ffffff"
      />
      
      {/* Ambient studio lighting */}
      <ambientLight intensity={0.4} color="#f0f0ff" />
    </>
  );
};
