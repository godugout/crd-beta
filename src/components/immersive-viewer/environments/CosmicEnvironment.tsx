
import React, { useRef } from 'react';
import { Stars, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicEnvironment = () => {
  const nebulaRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.001;
      nebulaRef.current.rotation.x += 0.0002;
    }
  });
  
  return (
    <>
      {/* Space environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/space_exploration_1k.hdr"
        background={true}
        blur={0}
        intensity={0.8}
      />
      
      {/* Fallback space background */}
      <color attach="background" args={['#000011']} />
      
      {/* Enhanced stars field */}
      <Stars 
        radius={500} 
        depth={200} 
        count={5000} 
        factor={8} 
        saturation={0.8} 
        fade 
        speed={2}
      />
      
      {/* Cosmic lighting */}
      <ambientLight intensity={0.1} color="#1a1a3a" />
      <pointLight position={[100, 100, 100]} color="#4a9eff" intensity={2} />
      <pointLight position={[-100, -100, -100]} color="#ff4a9e" intensity={1.5} />
      <pointLight position={[0, 200, 0]} color="#ffffff" intensity={0.8} />
      
      {/* Animated nebula group */}
      <group ref={nebulaRef}>
        {/* Main nebula */}
        <mesh position={[0, 0, -200]}>
          <sphereGeometry args={[300, 32, 32]} />
          <meshBasicMaterial 
            color="#6a0dad" 
            transparent 
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Secondary nebula clouds */}
        <mesh position={[150, 80, -180]}>
          <sphereGeometry args={[80, 16, 16]} />
          <meshBasicMaterial 
            color="#ff1493" 
            transparent 
            opacity={0.1}
          />
        </mesh>
        
        <mesh position={[-120, -60, -220]}>
          <sphereGeometry args={[60, 16, 16]} />
          <meshBasicMaterial 
            color="#00bfff" 
            transparent 
            opacity={0.08}
          />
        </mesh>
      </group>
      
      {/* Deep space fog */}
      <fog attach="fog" args={['#000022', 200, 800]} />
    </>
  );
};
