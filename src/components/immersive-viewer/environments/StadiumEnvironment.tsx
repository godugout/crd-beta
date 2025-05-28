
import React from 'react';
import { Environment } from '@react-three/drei';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium night background */}
      <color attach="background" args={['#0a0f1a']} />
      
      {/* Use built-in city environment for urban feel */}
      <Environment 
        preset="city"
        background={false}
        blur={0.5}
      />
      
      {/* Stadium ambient lighting */}
      <ambientLight intensity={0.4} color="#2a3a5a" />
      
      {/* Main stadium floodlights */}
      <directionalLight 
        position={[20, 30, 20]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-20, 30, 20]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[0, 35, -25]} 
        intensity={2.0} 
        color="#fff8dc"
      />
      
      {/* Stadium tower lights */}
      <spotLight
        position={[30, 40, 30]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-30, 40, 30]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[0, 45, -35]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.5}
        intensity={2.5}
        color="#fff5e0"
      />
      
      {/* Stadium perimeter lighting */}
      <pointLight position={[40, 20, 0]} intensity={1.0} color="#ffffe0" />
      <pointLight position={[-40, 20, 0]} intensity={1.0} color="#ffffe0" />
      <pointLight position={[0, 15, 50]} intensity={0.8} color="#e6f3ff" />
      <pointLight position={[0, 15, -50]} intensity={0.8} color="#e6f3ff" />
      
      {/* Crowd area lighting */}
      <pointLight position={[25, 8, 25]} intensity={0.5} color="#ffd700" />
      <pointLight position={[-25, 8, 25]} intensity={0.5} color="#ffd700" />
      <pointLight position={[25, 8, -25]} intensity={0.4} color="#ff6b35" />
      <pointLight position={[-25, 8, -25]} intensity={0.4} color="#ff6b35" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#1a2030', 50, 200]} />
    </>
  );
};
