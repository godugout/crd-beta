
import React, { useRef } from 'react';
import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicEnvironment = () => {
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.001;
      nebulaRef.current.rotation.z += 0.0005;
    }
  });
  
  return (
    <>
      {/* Stars field */}
      <Stars 
        radius={300} 
        depth={100} 
        count={2000} 
        factor={8} 
        saturation={0.5} 
        fade 
        speed={1}
      />
      
      {/* Cosmic lighting */}
      <ambientLight intensity={0.3} color="#4a0e4e" />
      <pointLight position={[50, 50, 50]} color="#ff00ff" intensity={1} />
      <pointLight position={[-50, -50, -50]} color="#00ffff" intensity={1} />
      <pointLight position={[0, 100, 0]} color="#ffffff" intensity={0.5} />
      
      {/* Nebula background using basic mesh */}
      <mesh ref={nebulaRef} position={[0, 0, -100]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial 
          color="#4a0e4e" 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Additional cosmic elements */}
      <mesh position={[100, 50, -150]}>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.2}
        />
      </mesh>
      
      <mesh position={[-80, -30, -120]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Cosmic fog */}
      <fog attach="fog" args={['#0a0a0a', 100, 500]} />
    </>
  );
};
