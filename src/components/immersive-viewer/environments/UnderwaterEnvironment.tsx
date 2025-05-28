
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UnderwaterEnvironment = () => {
  const causticsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  
  // Create a procedural sand texture
  const createSandTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Base sand color
      ctx.fillStyle = '#c4a484';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add sand grain variations
      for (let i = 0; i < 2000; i++) {
        const brightness = 180 + Math.random() * 75;
        ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, ${brightness * 0.6}, 0.6)`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };
  
  const sandTexture = createSandTexture();
  sandTexture.wrapS = THREE.RepeatWrapping;
  sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(20, 20);
  
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
      {/* Underwater gradient background */}
      <color attach="background" args={['#006994']} />
      
      {/* Procedural underwater background sphere */}
      <mesh position={[0, 0, -200]}>
        <sphereGeometry args={[300, 32, 32]} />
        <meshBasicMaterial 
          color="#004d6b" 
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
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
      
      {/* Sandy ocean floor */}
      <mesh position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial 
          map={sandTexture}
          color="#c4a484" 
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
