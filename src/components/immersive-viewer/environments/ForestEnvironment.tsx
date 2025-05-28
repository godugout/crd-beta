
import React from 'react';
import { Environment } from '@react-three/drei';

export const ForestEnvironment = () => {
  return (
    <>
      {/* Deep forest background with green tones */}
      <color attach="background" args={['#1a2f1a']} />
      
      {/* Use built-in forest environment */}
      <Environment 
        preset="forest"
        background={false}
        blur={0.6}
      />
      
      {/* Natural forest lighting with warm sunbeams */}
      <ambientLight intensity={0.3} color="#4a5d4a" />
      
      {/* Main sunlight filtering through canopy */}
      <directionalLight 
        position={[15, 25, 10]} 
        intensity={1.8} 
        color="#fff8dc"
        castShadow
      />
      
      {/* Secondary filtered light */}
      <directionalLight 
        position={[-8, 20, 15]} 
        intensity={1.0} 
        color="#e6f3e6"
      />
      
      {/* Dappled sunlight spots */}
      <spotLight
        position={[20, 30, 20]}
        target-position={[3, 0, 3]}
        angle={0.25}
        penumbra={0.9}
        intensity={2.2}
        color="#ffffe0"
        castShadow
      />
      <spotLight
        position={[-15, 35, 12]}
        target-position={[-2, 0, -2]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.8}
        color="#f0fff0"
      />
      <spotLight
        position={[8, 28, -18]}
        target-position={[1, 0, -1]}
        angle={0.2}
        penumbra={0.85}
        intensity={1.5}
        color="#fffacd"
      />
      
      {/* Soft undergrowth lighting */}
      <pointLight position={[12, 5, 8]} intensity={0.4} color="#90ee90" />
      <pointLight position={[-10, 3, -12]} intensity={0.3} color="#98fb98" />
      
      {/* Forest atmosphere with depth */}
      <fog attach="fog" args={['#2d4a22', 30, 100]} />
    </>
  );
};
