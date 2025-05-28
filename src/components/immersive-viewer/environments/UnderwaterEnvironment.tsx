
import React, { useRef } from 'react';
import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const UnderwaterEnvironment = () => {
  const causticsRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (causticsRef.current) {
      const time = state.clock.getElapsedTime();
      causticsRef.current.position.y = 30 + Math.sin(time * 0.5) * 2;
      causticsRef.current.rotation.z = time * 0.1;
    }
  });
  
  return (
    <>
      {/* Underwater environment */}
      <Environment preset="forest" background={false} />
      
      {/* Underwater lighting */}
      <ambientLight intensity={0.4} color="#0080b3" />
      <directionalLight 
        position={[0, 20, 0]} 
        intensity={1.5} 
        color="#00bfff"
        castShadow
      />
      
      {/* Caustics effect */}
      <mesh ref={causticsRef} position={[0, 30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#00bfff" 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Water surface */}
      <mesh position={[0, 40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial 
          color="#006994" 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Ocean floor */}
      <mesh position={[0, -30, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color="#2a4d3a" />
      </mesh>
      
      {/* Underwater fog */}
      <fog attach="fog" args={['#006994', 20, 80]} />
      
      {/* Floating particles */}
      <pointLight position={[20, 10, 20]} color="#00ffaa" intensity={0.5} />
      <pointLight position={[-20, 15, -20]} color="#0088ff" intensity={0.5} />
    </>
  );
};
