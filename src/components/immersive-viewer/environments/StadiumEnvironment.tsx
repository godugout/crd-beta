
import React from 'react';
import { Environment, Sky, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const StadiumEnvironment = () => {
  return (
    <>
      {/* Stadium lighting setup */}
      <Environment preset="sunset" background={false} />
      
      {/* Stadium sky */}
      <Sky 
        sunPosition={[0, 0.4, 1]} 
        turbidity={10} 
        rayleigh={2} 
        mieCoefficient={0.1}
        mieDirectionalG={0.8}
      />
      
      {/* Stadium lights */}
      <pointLight position={[10, 15, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, 15, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 15, -10]} intensity={1.5} color="#ffffff" />
      
      {/* Stadium atmosphere */}
      <fog attach="fog" args={['#1a1a2e', 50, 200]} />
      
      {/* Stadium background sphere */}
      <Sphere args={[100]} position={[0, 0, -50]}>
        <meshBasicMaterial 
          color="#1a1a2e" 
          side={THREE.BackSide} 
          transparent 
          opacity={0.8} 
        />
      </Sphere>
    </>
  );
};
