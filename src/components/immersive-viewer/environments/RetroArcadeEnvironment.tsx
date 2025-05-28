
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
            (index - 2) * 20,
            15 + Math.sin(index) * 8,
            (index % 2 === 0 ? 25 : -25)
          ]}
          color={color}
          intensity={1.2}
          distance={60}
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
      
      {/* Use built-in warehouse environment for arcade structure */}
      <Environment 
        preset="warehouse"
        background={true}
        blur={0.6}
      />
      
      {/* Arcade ambient lighting */}
      <ambientLight intensity={0.4} color="#330066" />
      
      {/* Main arcade lighting */}
      <directionalLight 
        position={[20, 30, 20]} 
        intensity={2.0} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[-20, 30, 20]} 
        intensity={2.0} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[0, 35, -25]} 
        intensity={1.8} 
        color="#ffff00"
      />
      
      {/* Arcade machine glow */}
      <spotLight
        position={[30, 25, 30]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.6}
        intensity={2.8}
        color="#ff0080"
        castShadow
      />
      <spotLight
        position={[-30, 25, 30]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.6}
        intensity={2.8}
        color="#00ff80"
        castShadow
      />
      
      {/* Retro neon accents */}
      <pointLight position={[40, 12, 0]} intensity={1.5} color="#ff0080" />
      <pointLight position={[-40, 12, 0]} intensity={1.5} color="#00ff80" />
      <pointLight position={[0, 18, 45]} intensity={1.2} color="#8000ff" />
      <pointLight position={[0, 18, -45]} intensity={1.2} color="#ff8000" />
      
      {/* Screen glow effects */}
      <pointLight position={[25, 8, 25]} intensity={0.8} color="#0080ff" />
      <pointLight position={[-25, 8, 25]} intensity={0.8} color="#ff4080" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#80ff40" />
    </>
  );
};
