
import React from 'react';
import { Environment } from '@react-three/drei';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium night sky background */}
      <color attach="background" args={['#1a1a2e']} />
      
      {/* Use built-in city environment for urban feel */}
      <Environment 
        preset="city"
        background={false}
        blur={0.7}
      />
      
      {/* Stadium lighting setup */}
      <ambientLight intensity={0.4} color="#2a2a4a" />
      
      {/* Main stadium floodlights */}
      <directionalLight 
        position={[20, 25, 15]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-20, 25, 15]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[0, 30, -20]} 
        intensity={2.0} 
        color="#f8f8ff"
        castShadow
      />
      
      {/* Corner floodlights */}
      <spotLight
        position={[25, 35, 25]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.3}
        intensity={3.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-25, 35, 25]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.3}
        intensity={3.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[25, 35, -25]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.3}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-25, 35, -25]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.3}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />
      
      {/* Additional accent lighting */}
      <pointLight position={[0, 40, 0]} intensity={1.0} color="#e6e6fa" />
      <pointLight position={[15, 20, 15]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-15, 20, 15]} intensity={0.8} color="#ffffff" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#1a1a2e', 40, 150]} />
    </>
  );
};
