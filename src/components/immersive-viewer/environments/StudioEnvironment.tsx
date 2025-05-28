
import React from 'react';
import { Environment } from '@react-three/drei';

export const StudioEnvironment = () => {
  return (
    <>
      {/* Professional photo studio environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_loft_hall_1k.hdr"
        background={true}
        blur={0.1}
        intensity={1.5}
      />
      
      {/* Studio lighting setup */}
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={2.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill lights */}
      <directionalLight 
        position={[-8, 12, 8]} 
        intensity={1.2} 
        color="#f0f0ff"
      />
      <directionalLight 
        position={[0, 8, -15]} 
        intensity={0.8} 
        color="#fff5e0"
      />
      
      {/* Rim lighting */}
      <pointLight position={[15, 10, -10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-15, 10, -10]} intensity={1.2} color="#f8f8ff" />
      
      {/* Ambient studio lighting */}
      <ambientLight intensity={0.3} color="#f0f0ff" />
      
      {/* Studio floor with reflective material */}
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};
