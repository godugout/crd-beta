
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

export const GalleryEnvironment = () => {
  return (
    <>
      {/* Clean gallery lighting */}
      <Environment preset="studio" background={false} />
      
      {/* Gallery spotlights */}
      <spotLight 
        position={[5, 10, 5]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={2} 
        color="#ffffff"
        castShadow
      />
      <spotLight 
        position={[-5, 10, 5]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={2} 
        color="#ffffff"
        castShadow
      />
      
      {/* Ambient gallery lighting */}
      <ambientLight intensity={0.8} color="#f5f5f5" />
      
      {/* Gallery walls */}
      <mesh position={[0, 0, -20]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <meshLambertMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Gallery floor */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
    </>
  );
};
