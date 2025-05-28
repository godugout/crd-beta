
import React from 'react';
import { Environment } from '@react-three/drei';

export const CosmicEnvironment = () => {
  return (
    <>
      {/* Simple space background with stars */}
      <color attach="background" args={['#000008']} />
      
      {/* Use a space HDR environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dancing_hall_2k.hdr"
        background={false}
        blur={0.8}
      />
      
      {/* Minimal ambient lighting for space */}
      <ambientLight intensity={0.1} color="#001122" />
      
      {/* Distant starlight */}
      <pointLight position={[100, 50, 100]} color="#ffffff" intensity={0.3} distance={1000} />
      <pointLight position={[-80, -30, 120]} color="#aaccff" intensity={0.2} distance={800} />
      
      {/* Space fog for depth */}
      <fog attach="fog" args={['#000011', 200, 800]} />
    </>
  );
};
