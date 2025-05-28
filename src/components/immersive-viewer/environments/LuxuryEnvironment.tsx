
import React from 'react';
import { Environment } from '@react-three/drei';

export const LuxuryEnvironment = () => {
  return (
    <>
      {/* Rich warm background */}
      <color attach="background" args={['#2a1f15']} />
      
      {/* Use built-in apartment environment for luxury feel */}
      <Environment 
        preset="apartment"
        background={true}
        blur={0.3}
      />
      
      {/* Warm luxury ambient lighting */}
      <ambientLight intensity={0.7} color="#ffd700" />
      
      {/* Main luxury lighting setup */}
      <directionalLight 
        position={[15, 25, 20]} 
        intensity={2.8} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-12, 22, 18]} 
        intensity={2.5} 
        color="#f5e6a3"
        castShadow
      />
      <directionalLight 
        position={[0, 30, -25]} 
        intensity={2.2} 
        color="#ffebcd"
      />
      
      {/* Elegant chandelier-style lighting */}
      <spotLight
        position={[0, 35, 12]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.5}
        intensity={3.8}
        color="#ffd700"
        castShadow
      />
      <spotLight
        position={[20, 30, 0]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.6}
        intensity={3.2}
        color="#fff8dc"
      />
      <spotLight
        position={[-20, 30, 0]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.6}
        intensity={3.2}
        color="#fff8dc"
      />
      
      {/* Accent warm lighting */}
      <pointLight position={[30, 18, 30]} intensity={1.2} color="#ffd700" />
      <pointLight position={[-30, 18, 30]} intensity={1.2} color="#ffd700" />
      <pointLight position={[0, 12, 40]} intensity={1.0} color="#ffebcd" />
      <pointLight position={[0, 12, -40]} intensity={1.0} color="#ffebcd" />
      
      {/* Luxury rim lighting */}
      <pointLight position={[35, 8, 0]} intensity={0.6} color="#daa520" />
      <pointLight position={[-35, 8, 0]} intensity={0.6} color="#daa520" />
    </>
  );
};
