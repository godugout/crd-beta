
import React from 'react';
import { Environment } from '@react-three/drei';

export const GalleryEnvironment = () => {
  return (
    <>
      {/* Gallery background */}
      <color attach="background" args={['#f5f5f5']} />
      
      {/* Use museum/gallery HDR */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/museum_of_ethnography_2k.hdr"
        background={true}
        blur={0.3}
      />
      
      {/* Professional gallery lighting */}
      <directionalLight 
        position={[10, 15, 8]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.8} 
        color="#f8f8ff"
      />
      <ambientLight intensity={0.6} color="#f5f5f5" />
      
      {/* Track lighting effect */}
      <spotLight
        position={[0, 25, 10]}
        angle={0.3}
        penumbra={0.4}
        intensity={1.5}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
    </>
  );
};
