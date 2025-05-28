
import React from 'react';
import { Environment } from '@react-three/drei';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium night background */}
      <color attach="background" args={['#0a0f1a']} />
      
      {/* Use built-in dawn environment for stadium lighting */}
      <Environment 
        preset="dawn"
        background={true}
        blur={0.3}
      />
      
      {/* Stadium ambient lighting */}
      <ambientLight intensity={0.6} color="#2a3a5a" />
      
      {/* Main stadium floodlights */}
      <directionalLight 
        position={[25, 40, 25]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-25, 40, 25]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[0, 45, -30]} 
        intensity={3.0} 
        color="#fff8dc"
      />
      
      {/* Stadium tower lights */}
      <spotLight
        position={[35, 50, 35]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={4.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-35, 50, 35]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={4.0}
        color="#ffffff"
        castShadow
      />
      
      {/* Stadium perimeter lighting */}
      <pointLight position={[50, 25, 0]} intensity={1.5} color="#ffffe0" />
      <pointLight position={[-50, 25, 0]} intensity={1.5} color="#ffffe0" />
      <pointLight position={[0, 20, 60]} intensity={1.2} color="#e6f3ff" />
      <pointLight position={[0, 20, -60]} intensity={1.2} color="#e6f3ff" />
    </>
  );
};
