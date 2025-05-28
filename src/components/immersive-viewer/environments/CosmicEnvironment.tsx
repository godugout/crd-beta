
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
  const stars = useMemo(() => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a large sphere around the scene
      const radius = 800 + Math.random() * 400;
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
      <pointsMaterial size={2} color="#ffffff" sizeAttenuation={false} />
    </points>
  );
};

export const CosmicEnvironment = () => {
  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#000011']} />
      
      {/* Star field */}
      <StarField />
      
      {/* Use built-in night environment */}
      <Environment 
        preset="night"
        background={false}
        blur={0.9}
      />
      
      {/* Minimal cosmic ambient light */}
      <ambientLight intensity={0.1} color="#001122" />
      
      {/* Distant starlight */}
      <directionalLight 
        position={[100, 50, 100]} 
        intensity={0.4} 
        color="#e6f3ff"
      />
      
      {/* Cosmic light sources */}
      <pointLight position={[150, 80, 120]} color="#ffffff" intensity={0.3} distance={2000} />
      <pointLight position={[-120, 100, -80]} color="#aaccff" intensity={0.25} distance={1800} />
      <pointLight position={[80, -60, 200]} color="#ffccaa" intensity={0.2} distance={1500} />
      <pointLight position={[-200, 150, 50]} color="#ccffcc" intensity={0.15} distance={2200} />
      
      {/* Nebula-like colored lights */}
      <pointLight position={[0, 200, 0]} color="#ff6699" intensity={0.1} distance={1000} />
      <pointLight position={[300, 0, 300]} color="#6699ff" intensity={0.12} distance={1200} />
      <pointLight position={[-250, -100, 180]} color="#99ff66" intensity={0.08} distance={1100} />
      
      {/* Subtle galaxy center glow */}
      <spotLight
        position={[0, 0, 500]}
        target-position={[0, 0, 0]}
        angle={0.8}
        penumbra={0.9}
        intensity={0.3}
        color="#ddddff"
      />
      
      {/* Deep space atmosphere */}
      <fog attach="fog" args={['#000011', 200, 1000]} />
    </>
  );
};
