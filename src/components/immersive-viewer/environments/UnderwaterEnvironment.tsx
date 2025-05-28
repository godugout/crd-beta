
import React from 'react';
import { Environment } from '@react-three/drei';

export const UnderwaterEnvironment = () => {
  return (
    <>
      {/* Underwater background */}
      <color attach="background" args={['#004466']} />
      
      {/* Use built-in environment preset instead of external HDR */}
      <Environment 
        preset="dawn"
        background={false}
        blur={0.8}
      />
      
      {/* Underwater lighting */}
      <directionalLight 
        position={[0, 20, 0]} 
        intensity={1.5} 
        color="#87ceeb"
        castShadow
      />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4682b4" />
      <pointLight position={[-10, 5, -10]} intensity={0.6} color="#20b2aa" />
      
      {/* Ambient underwater glow */}
      <ambientLight intensity={0.3} color="#006994" />
      
      {/* Underwater fog for depth */}
      <fog attach="fog" args={['#004466', 20, 100]} />
    </>
  );
};
