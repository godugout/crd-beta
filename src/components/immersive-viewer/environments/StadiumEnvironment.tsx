
import React from 'react';
import { Environment } from '@react-three/drei';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium sky background */}
      <color attach="background" args={['#2a3c5f']} />
      
      {/* Use stadium/sports venue HDR */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/stadium_01_2k.hdr"
        background={true}
        blur={0.6}
      />
      
      {/* Stadium lighting */}
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={2.0} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-10, 15, 5]} intensity={1.5} color="#ffffff" />
      <ambientLight intensity={0.8} color="#f5f5dc" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#2a3c5f', 50, 200]} />
    </>
  );
};
