
import React from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium lighting setup */}
      <Environment preset="sunset" background={false} />
      
      {/* Stadium lights */}
      <pointLight position={[10, 15, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, 15, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 15, -10]} intensity={1.5} color="#ffffff" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#1a1a2e', 50, 200]} />
      
      {/* Stadium background using basic mesh instead of Sphere */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial 
          color="#1a1a2e" 
          side={THREE.BackSide} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Stadium field/ground */}
      <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color="#2d5a2d" />
      </mesh>
    </>
  );
};
