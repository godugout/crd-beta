
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
  const stars = useMemo(() => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a dome above the scene
      const radius = 600 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.7; // More stars visible
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = Math.abs(radius * Math.cos(phi)) + 60; // Keep above ground
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
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

export const NightSkyEnvironment = () => {
  return (
    <>
      {/* Night sky background */}
      <color attach="background" args={['#0a0a2e']} />
      
      {/* Star field */}
      <StarField />
      
      {/* Use built-in night environment with stars */}
      <Environment 
        preset="night"
        background={true}
        blur={0.4}
      />
      
      {/* Moonlight ambient */}
      <ambientLight intensity={0.4} color="#b3ccff" />
      
      {/* Main moonlight */}
      <directionalLight 
        position={[60, 100, 40]} 
        intensity={2.5} 
        color="#e6f3ff"
        castShadow
      />
      
      {/* Subtle starlight */}
      <directionalLight 
        position={[-40, 80, 60]} 
        intensity={1.0} 
        color="#cce6ff"
      />
      <directionalLight 
        position={[30, 90, -50]} 
        intensity={0.8} 
        color="#ddeeff"
      />
      
      {/* Moonbeam spotlight */}
      <spotLight
        position={[0, 120, 0]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />
      
      {/* Distant city lights */}
      <pointLight position={[150, 8, 150]} color="#ffaa00" intensity={0.4} distance={800} />
      <pointLight position={[-120, 12, 180]} color="#ffcc66" intensity={0.35} distance={600} />
      <pointLight position={[180, 15, -130]} color="#ff9966" intensity={0.3} distance={700} />
      
      {/* Aurora-like effects */}
      <pointLight position={[0, 200, 300]} color="#66ff99" intensity={0.2} distance={1200} />
      <pointLight position={[300, 180, 0]} color="#9966ff" intensity={0.18} distance={1000} />
      <pointLight position={[-250, 200, 150]} color="#66ccff" intensity={0.25} distance={1100} />
    </>
  );
};
