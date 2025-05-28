
import React from 'react';
import { Environment } from '@react-three/drei';

export const GalleryEnvironment = () => {
  return (
    <>
      {/* Museum/Gallery environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/museum_of_ethnography_1k.hdr"
        background={true}
        blur={0.1}
        intensity={1.2}
      />
      
      {/* Professional gallery lighting */}
      <directionalLight 
        position={[10, 15, 8]} 
        intensity={2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.5} 
        color="#f8f8ff"
      />
      
      {/* Ambient gallery lighting */}
      <ambientLight intensity={0.4} color="#f5f5f5" />
      
      {/* Gallery floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>
    </>
  );
};
