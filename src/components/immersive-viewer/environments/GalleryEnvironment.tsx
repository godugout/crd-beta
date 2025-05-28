
import React from 'react';
import { Environment } from '@react-three/drei';

export const GalleryEnvironment = () => {
  return (
    <>
      {/* Clean white gallery background */}
      <color attach="background" args={['#f8f8f8']} />
      
      {/* Use built-in warehouse environment for gallery feel */}
      <Environment 
        preset="warehouse"
        background={true}
        blur={0.2}
      />
      
      {/* Gallery lighting setup */}
      <ambientLight intensity={0.8} color="#f5f5f5" />
      
      {/* Main gallery track lighting */}
      <directionalLight 
        position={[12, 20, 10]} 
        intensity={2.8} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-10, 20, 10]} 
        intensity={2.6} 
        color="#f8f8ff"
        castShadow
      />
      <directionalLight 
        position={[0, 25, -15]} 
        intensity={2.4} 
        color="#fffafa"
      />
      
      {/* Focused spotlights for artwork */}
      <spotLight
        position={[0, 30, 15]}
        target-position={[0, 0, 0]}
        angle={0.2}
        penumbra={0.3}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[20, 28, 8]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
      />
      <spotLight
        position={[-20, 28, 8]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
      />
    </>
  );
};
