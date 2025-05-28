
import React from 'react';
import { Environment } from '@react-three/drei';

export const GalleryEnvironment = () => {
  return (
    <>
      {/* Clean white gallery background */}
      <color attach="background" args={['#f8f8f8']} />
      
      {/* Use built-in studio environment */}
      <Environment 
        preset="studio"
        background={false}
        blur={0.4}
      />
      
      {/* Gallery lighting setup */}
      <ambientLight intensity={0.6} color="#f5f5f5" />
      
      {/* Main gallery track lighting */}
      <directionalLight 
        position={[10, 15, 8]} 
        intensity={2.2} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-8, 15, 8]} 
        intensity={2.0} 
        color="#f8f8ff"
        castShadow
      />
      <directionalLight 
        position={[0, 18, -12]} 
        intensity={1.8} 
        color="#fffafa"
      />
      
      {/* Focused spotlights for artwork */}
      <spotLight
        position={[0, 20, 10]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[15, 22, 5]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2.0}
        color="#ffffff"
      />
      <spotLight
        position={[-15, 22, 5]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2.0}
        color="#ffffff"
      />
      
      {/* Accent lighting for depth */}
      <pointLight position={[0, 25, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[20, 10, 20]} intensity={0.3} color="#f0f0ff" />
      <pointLight position={[-20, 10, 20]} intensity={0.3} color="#f0f0ff" />
      
      {/* Minimal atmospheric effect */}
      <fog attach="fog" args={['#f8f8f8', 80, 200]} />
    </>
  );
};
