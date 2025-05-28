
import React from 'react';
import { Environment } from '@react-three/drei';

export const LuxuryEnvironment = () => {
  return (
    <>
      {/* Rich warm background */}
      <color attach="background" args={['#1a1510']} />
      
      {/* Use built-in apartment environment for luxury feel */}
      <Environment 
        preset="apartment"
        background={false}
        blur={0.4}
      />
      
      {/* Warm luxury ambient lighting */}
      <ambientLight intensity={0.5} color="#ffd700" />
      
      {/* Main luxury lighting setup */}
      <directionalLight 
        position={[12, 18, 15]} 
        intensity={2.0} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-10, 15, 12]} 
        intensity={1.8} 
        color="#f5e6a3"
        castShadow
      />
      <directionalLight 
        position={[0, 20, -18]} 
        intensity={1.5} 
        color="#ffebcd"
      />
      
      {/* Elegant chandelier-style lighting */}
      <spotLight
        position={[0, 25, 8]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.6}
        intensity={2.8}
        color="#ffd700"
        castShadow
      />
      <spotLight
        position={[15, 22, 0]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.2}
        color="#fff8dc"
      />
      <spotLight
        position={[-15, 22, 0]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.2}
        color="#fff8dc"
      />
      
      {/* Accent warm lighting */}
      <pointLight position={[20, 12, 20]} intensity={0.8} color="#ffd700" />
      <pointLight position={[-20, 12, 20]} intensity={0.8} color="#ffd700" />
      <pointLight position={[0, 8, 30]} intensity={0.6} color="#ffebcd" />
      <pointLight position={[0, 8, -30]} intensity={0.6} color="#ffebcd" />
      
      {/* Luxury rim lighting */}
      <pointLight position={[25, 5, 0]} intensity={0.4} color="#daa520" />
      <pointLight position={[-25, 5, 0]} intensity={0.4} color="#daa520" />
      
      {/* Warm atmospheric effect */}
      <fog attach="fog" args={['#2d2416', 60, 180]} />
    </>
  );
};
