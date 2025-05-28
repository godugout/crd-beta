
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
  const stars = useMemo(() => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a large sphere around the scene
      const radius = 1000 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return starGeometry;
  }, []);

  return (
    <points>
      <primitive object={stars} />
      <pointsMaterial size={3} color="#ffffff" sizeAttenuation={false} />
    </points>
  );
};

export const CosmicEnvironment = () => {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000008']} />
      
      {/* Star field */}
      <StarField />
      
      {/* Use built-in night environment for cosmic feel */}
      <Environment 
        preset="night"
        background={true}
        blur={0.8}
      />
      
      {/* Minimal cosmic ambient light */}
      <ambientLight intensity={0.15} color="#001122" />
      
      {/* Distant starlight */}
      <directionalLight 
        position={[200, 100, 200]} 
        intensity={0.6} 
        color="#e6f3ff"
      />
      
      {/* Cosmic light sources */}
      <pointLight position={[300, 150, 250]} color="#ffffff" intensity={0.4} distance={3000} />
      <pointLight position={[-250, 200, -150]} color="#aaccff" intensity={0.35} distance={2800} />
      <pointLight position={[150, -120, 400]} color="#ffccaa" intensity={0.3} distance={2500} />
      
      {/* Nebula-like colored lights */}
      <pointLight position={[0, 400, 0]} color="#ff6699" intensity={0.15} distance={2000} />
      <pointLight position={[600, 0, 600]} color="#6699ff" intensity={0.18} distance={2400} />
      <pointLight position={[-500, -200, 360]} color="#99ff66" intensity={0.12} distance={2200} />
    </>
  );
};
