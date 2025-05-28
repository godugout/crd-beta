
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const NeonLights = () => {
  const neonColors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'];
  
  return (
    <>
      {neonColors.map((color, index) => (
        <pointLight
          key={index}
          position={[
            (index - 2) * 15,
            10 + Math.sin(index) * 5,
            (index % 2 === 0 ? 20 : -20)
          ]}
          color={color}
          intensity={0.8}
          distance={50}
        />
      ))}
    </>
  );
};

export const RetroArcadeEnvironment = () => {
  return (
    <>
      {/* Dark arcade background */}
      <color attach="background" args={['#0a0a0a']} />
      
      {/* Neon lighting array */}
      <NeonLights />
      
      {/* Use built-in warehouse environment for arcade feel */}
      <Environment 
        preset="warehouse"
        background={false}
        blur={0.5}
      />
      
      {/* Arcade ambient lighting */}
      <ambientLight intensity={0.3} color="#330066" />
      
      {/* Main arcade lighting */}
      <directionalLight 
        position={[15, 20, 15]} 
        intensity={1.5} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[-15, 20, 15]} 
        intensity={1.5} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[0, 25, -20]} 
        intensity={1.2} 
        color="#ffff00"
      />
      
      {/* Arcade machine glow */}
      <spotLight
        position={[25, 18, 25]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.0}
        color="#ff0080"
        castShadow
      />
      <spotLight
        position={[-25, 18, 25]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.0}
        color="#00ff80"
        castShadow
      />
      
      {/* Retro neon accents */}
      <pointLight position={[30, 8, 0]} intensity={1.0} color="#ff0080" />
      <pointLight position={[-30, 8, 0]} intensity={1.0} color="#00ff80" />
      <pointLight position={[0, 12, 35]} intensity={0.8} color="#8000ff" />
      <pointLight position={[0, 12, -35]} intensity={0.8} color="#ff8000" />
      
      {/* Screen glow effects */}
      <pointLight position={[20, 5, 20]} intensity={0.6} color="#0080ff" />
      <pointLight position={[-20, 5, 20]} intensity={0.6} color="#ff4080" />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#80ff40" />
      
      {/* Arcade atmosphere */}
      <fog attach="fog" args={['#0a0a0a', 70, 200]} />
    </>
  );
};
