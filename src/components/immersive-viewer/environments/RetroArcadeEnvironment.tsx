
import React from 'react';
import { Environment } from '@react-three/drei';

export const RetroArcadeEnvironment = () => {
  return (
    <>
      {/* Deep purple arcade background */}
      <color attach="background" args={['#0d0520']} />
      
      {/* Use built-in apartment environment for base */}
      <Environment 
        preset="apartment"
        background={false}
        blur={0.8}
      />
      
      {/* Ambient neon glow */}
      <ambientLight intensity={0.3} color="#4a0e4e" />
      
      {/* Primary neon lights with strong colors */}
      <directionalLight 
        position={[8, 12, 8]} 
        intensity={1.5} 
        color="#00ffff"
        castShadow
      />
      
      {/* Colorful arcade lighting */}
      <pointLight position={[12, 8, 12]} intensity={1.8} color="#ff0080" />
      <pointLight position={[-12, 10, 8]} intensity={1.6} color="#00ff80" />
      <pointLight position={[0, 6, -15]} intensity={1.4} color="#8000ff" />
      <pointLight position={[15, 15, 0]} intensity={1.2} color="#ffff00" />
      <pointLight position={[-8, 12, -10]} intensity={1.0} color="#ff4000" />
      
      {/* Animated neon spotlights */}
      <spotLight
        position={[0, 20, 15]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.6}
        intensity={2.0}
        color="#ff00ff"
        castShadow
      />
      <spotLight
        position={[20, 18, 0]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.7}
        intensity={1.8}
        color="#00ffff"
      />
      
      {/* Additional accent lights */}
      <pointLight position={[0, 25, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[10, 2, 10]} intensity={0.6} color="#ff1493" />
      <pointLight position={[-10, 3, -10]} intensity={0.5} color="#00ff7f" />
      
      {/* Atmospheric haze */}
      <fog attach="fog" args={['#1a0826', 20, 70]} />
    </>
  );
};
