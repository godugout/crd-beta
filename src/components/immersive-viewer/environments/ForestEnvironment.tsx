
import React from 'react';
import { Environment } from '@react-three/drei';

export const ForestEnvironment = () => {
  return (
    <>
      {/* Forest background */}
      <color attach="background" args={['#2d4a22']} />
      
      {/* Use built-in forest environment */}
      <Environment 
        preset="forest"
        background={false}
        blur={0.8}
      />
      
      {/* Natural forest lighting */}
      <ambientLight intensity={0.5} color="#4a6741" />
      
      {/* Sunlight filtering through trees */}
      <directionalLight 
        position={[20, 30, 15]} 
        intensity={2.0} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-10, 25, 20]} 
        intensity={1.2} 
        color="#f0fff0"
      />
      
      {/* Dappled light effects */}
      <spotLight
        position={[25, 35, 25]}
        target-position={[5, 0, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.8}
        color="#fffacd"
      />
      <spotLight
        position={[-20, 40, 15]}
        target-position={[-5, 0, -5]}
        angle={0.4}
        penumbra={0.7}
        intensity={1.5}
        color="#f5fffa"
      />
      
      {/* Forest atmosphere */}
      <fog attach="fog" args={['#2d4a22', 40, 120]} />
    </>
  );
};
