
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const StarField = () => {
  const stars = useMemo(() => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Create stars in a dome above the scene
      const radius = 500 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6; // Only upper hemisphere
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = Math.abs(radius * Math.cos(phi)) + 50; // Keep above ground
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return starGeometry;
  }, []);

  return (
    <points>
      <primitive object={stars} />
      <pointsMaterial size={1.5} color="#ffffff" sizeAttenuation={false} />
    </points>
  );
};

export const NightSkyEnvironment = () => {
  return (
    <>
      {/* Night sky background */}
      <color attach="background" args={['#0a0a1a']} />
      
      {/* Star field */}
      <StarField />
      
      {/* Use built-in night environment */}
      <Environment 
        preset="night"
        background={false}
        blur={0.6}
      />
      
      {/* Moonlight ambient */}
      <ambientLight intensity={0.3} color="#b3ccff" />
      
      {/* Main moonlight */}
      <directionalLight 
        position={[50, 80, 30]} 
        intensity={1.8} 
        color="#e6f3ff"
        castShadow
      />
      
      {/* Subtle starlight */}
      <directionalLight 
        position={[-30, 60, 50]} 
        intensity={0.6} 
        color="#cce6ff"
      />
      <directionalLight 
        position={[20, 70, -40]} 
        intensity={0.5} 
        color="#ddeeff"
      />
      
      {/* Moonbeam spotlight */}
      <spotLight
        position={[0, 100, 0]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={2.0}
        color="#ffffff"
        castShadow
      />
      
      {/* Distant city lights */}
      <pointLight position={[100, 5, 100]} color="#ffaa00" intensity={0.3} distance={500} />
      <pointLight position={[-80, 8, 120]} color="#ffcc66" intensity={0.25} distance={400} />
      <pointLight position={[120, 12, -90]} color="#ff9966" intensity={0.2} distance={450} />
      
      {/* Aurora-like effects */}
      <pointLight position={[0, 150, 200]} color="#66ff99" intensity={0.15} distance={800} />
      <pointLight position={[200, 120, 0]} color="#9966ff" intensity={0.12} distance={700} />
      <pointLight position={[-150, 140, 100]} color="#66ccff" intensity={0.18} distance={750} />
      
      {/* Night atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 150, 400]} />
    </>
  );
};
