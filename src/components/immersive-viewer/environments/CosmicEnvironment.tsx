
import React from 'react';
import { Environment } from '@react-three/drei';

export const CosmicEnvironment = () => {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000011']} />
      
      {/* Use built-in night environment */}
      <Environment 
        preset="night"
        background={false}
        blur={0.9}
      />
      
      {/* Minimal cosmic ambient light */}
      <ambientLight intensity={0.1} color="#001122" />
      
      {/* Distant starlight */}
      <directionalLight 
        position={[100, 50, 100]} 
        intensity={0.4} 
        color="#e6f3ff"
      />
      
      {/* Cosmic light sources */}
      <pointLight position={[150, 80, 120]} color="#ffffff" intensity={0.3} distance={2000} />
      <pointLight position={[-120, 100, -80]} color="#aaccff" intensity={0.25} distance={1800} />
      <pointLight position={[80, -60, 200]} color="#ffccaa" intensity={0.2} distance={1500} />
      <pointLight position={[-200, 150, 50]} color="#ccffcc" intensity={0.15} distance={2200} />
      
      {/* Nebula-like colored lights */}
      <pointLight position={[0, 200, 0]} color="#ff6699" intensity={0.1} distance={1000} />
      <pointLight position={[300, 0, 300]} color="#6699ff" intensity={0.12} distance={1200} />
      <pointLight position={[-250, -100, 180]} color="#99ff66" intensity={0.08} distance={1100} />
      
      {/* Subtle galaxy center glow */}
      <spotLight
        position={[0, 0, 500]}
        target-position={[0, 0, 0]}
        angle={0.8}
        penumbra={0.9}
        intensity={0.3}
        color="#ddddff"
      />
      
      {/* Deep space atmosphere */}
      <fog attach="fog" args={['#000011', 200, 1000]} />
    </>
  );
};
