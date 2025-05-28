
import React, { useMemo } from 'react';
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
  // Create cosmic space background
  const cosmicTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Deep space gradient
      const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
      gradient.addColorStop(0, '#001122');
      gradient.addColorStop(0.5, '#000508');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add nebula colors
      const nebulaGradient = ctx.createRadialGradient(300, 200, 0, 300, 200, 200);
      nebulaGradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
      nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add distant stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 2;
        ctx.fillRect(x, y, size, size);
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Deep space background */}
      <primitive object={cosmicTexture} attach="background" />
      
      {/* Star field */}
      <StarField />
      
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
