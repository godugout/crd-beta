
import React, { useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UnderwaterEnvironment = () => {
  const causticsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (causticsRef.current) {
      causticsRef.current.position.y = 25 + Math.sin(time * 0.8) * 3;
      causticsRef.current.rotation.z = time * 0.15;
    }
    
    if (waterRef.current && waterRef.current.material) {
      const material = waterRef.current.material as THREE.MeshPhysicalMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
      }
    }
  });
  
  return (
    <>
      {/* Underwater environment */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/underwater_01_1k.hdr"
        background={true}
        blur={0.3}
      />
      
      {/* Fallback underwater background */}
      <color attach="background" args={['#006994']} />
      
      {/* Underwater lighting */}
      <ambientLight intensity={0.3} color="#0080b3" />
      <directionalLight 
        position={[0, 30, 0]} 
        intensity={2} 
        color="#00bfff"
        castShadow
      />
      
      {/* Animated caustics effects */}
      <group ref={causticsRef}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200, 32, 32]} />
          <meshBasicMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[50, 5, 50]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100, 16, 16]} />
          <meshBasicMaterial 
            color="#40e0d0" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* Water surface with animation */}
      <mesh 
        ref={waterRef} 
        position={[0, 40, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[400, 400, 64, 64]} />
        <meshPhysicalMaterial 
          color="#006994" 
          transparent 
          opacity={0.7}
          transmission={0.9}
          roughness={0.1}
          metalness={0.0}
          ior={1.33}
          thickness={10}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Ocean floor with texture */}
      <mesh position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          color="#1a3d2e" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      
      {/* Underwater fog */}
      <fog attach="fog" args={['#004d6b', 30, 120]} />
      
      {/* Floating particle lights */}
      <pointLight position={[30, 5, 30]} color="#00ffaa" intensity={0.8} />
      <pointLight position={[-30, 10, -30]} color="#0088ff" intensity={0.6} />
      <pointLight position={[0, 15, -40]} color="#40e0d0" intensity={0.4} />
    </>
  );
};
