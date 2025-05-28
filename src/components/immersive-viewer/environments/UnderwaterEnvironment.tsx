
import React from 'react';
import { Environment } from '@react-three/drei';

export const UnderwaterEnvironment = () => {
  return (
    <>
      {/* Deep ocean blue background */}
      <color attach="background" args={['#003366']} />
      
      {/* Use built-in park environment for natural feel */}
      <Environment 
        preset="park"
        background={false}
        blur={0.9}
      />
      
      {/* Underwater ambient lighting */}
      <ambientLight intensity={0.3} color="#004466" />
      
      {/* Sunlight filtering down from surface */}
      <directionalLight 
        position={[0, 25, 0]} 
        intensity={1.2} 
        color="#87ceeb"
        castShadow
      />
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={0.8} 
        color="#4682b4"
      />
      
      {/* Caustic light patterns */}
      <spotLight
        position={[20, 30, 20]}
        target-position={[5, 0, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#87ceeb"
        castShadow
      />
      <spotLight
        position={[-15, 25, 15]}
        target-position={[-3, 0, -3]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.2}
        color="#4682b4"
      />
      <spotLight
        position={[0, 35, -20]}
        target-position={[0, 0, -2]}
        angle={0.3}
        penumbra={0.7}
        intensity={1.0}
        color="#5f9ea0"
      />
      
      {/* Underwater creature/plant glow */}
      <pointLight position={[12, 8, 12]} intensity={0.6} color="#20b2aa" />
      <pointLight position={[-10, 5, -8]} intensity={0.5} color="#48d1cc" />
      <pointLight position={[8, 12, -15]} intensity={0.4} color="#40e0d0" />
      <pointLight position={[-15, 15, 10]} intensity={0.3} color="#00ced1" />
      
      {/* Deep ocean particles effect */}
      <pointLight position={[0, 0, 30]} intensity={0.2} color="#87ceeb" />
      
      {/* Ocean depth atmosphere */}
      <fog attach="fog" args={['#003366', 15, 80]} />
    </>
  );
};
