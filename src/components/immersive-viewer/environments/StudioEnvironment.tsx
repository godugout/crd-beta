
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

export const StudioEnvironment = () => {
  return (
    <>
      {/* Professional studio lighting */}
      <Environment preset="studio" background={false} />
      
      {/* Key light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-5, 8, 5]} 
        intensity={1} 
        color="#f0f0ff"
      />
      
      {/* Back light */}
      <directionalLight 
        position={[0, 5, -10]} 
        intensity={0.8} 
        color="#fff5e0"
      />
      
      {/* Ambient studio lighting */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
      
      {/* Studio backdrop */}
      <mesh position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Studio floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
    </>
  );
};
