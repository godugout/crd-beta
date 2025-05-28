
import React from 'react';
import { Environment } from '@react-three/drei';

export const NightSkyEnvironment = () => {
  return (
    <>
      {/* Dark night sky background */}
      <color attach="background" args={['#0c0c1e']} />
      
      {/* Use built-in night environment */}
      <Environment 
        preset="night"
        background={false}
        blur={0.9}
      />
      
      {/* Starlight and moonlight */}
      <ambientLight intensity={0.15} color="#1a1a3a" />
      <directionalLight 
        position={[50, 80, 30]} 
        intensity={0.8} 
        color="#e6f3ff"
        castShadow
      />
      
      {/* Distant star points */}
      <pointLight position={[200, 100, 150]} color="#ffffff" intensity={0.2} distance={2000} />
      <pointLight position={[-150, 120, -100]} color="#ffffcc" intensity={0.15} distance={1500} />
      <pointLight position={[80, -50, 200]} color="#ccffff" intensity={0.1} distance={1200} />
      
      {/* Night atmosphere */}
      <fog attach="fog" args={['#0c0c1e', 300, 1000]} />
    </>
  );
};
