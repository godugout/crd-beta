
import React from 'react';
import { Environment } from '@react-three/drei';

export const RetroArcadeEnvironment = () => {
  return (
    <>
      {/* Neon arcade background */}
      <color attach="background" args={['#1a0826']} />
      
      {/* Use built-in apartment environment */}
      <Environment 
        preset="apartment"
        background={false}
        blur={0.7}
      />
      
      {/* Neon lighting setup */}
      <ambientLight intensity={0.4} color="#ff00ff" />
      
      {/* Colorful neon lights */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.8} 
        color="#00ffff"
        castShadow
      />
      <pointLight position={[15, 10, 15]} intensity={2.0} color="#ff0080" />
      <pointLight position={[-15, 12, 10]} intensity={1.5} color="#00ff80" />
      <pointLight position={[0, 8, -20]} intensity={1.2} color="#8000ff" />
      
      {/* Retro spotlight */}
      <spotLight
        position={[0, 30, 20]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={2.5}
        color="#ffff00"
        castShadow
      />
      
      {/* Arcade atmosphere */}
      <fog attach="fog" args={['#1a0826', 25, 80]} />
    </>
  );
};
