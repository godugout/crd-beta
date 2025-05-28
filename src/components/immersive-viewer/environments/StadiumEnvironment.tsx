
import React, { useMemo } from 'react';
import * as THREE from 'three';

export const StadiumEnvironment = () => {
  // Create stadium background texture
  const stadiumTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Night sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#0a0f1a');
      gradient.addColorStop(0.3, '#1a2040');
      gradient.addColorStop(1, '#2a3a5a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add stadium structure silhouette
      ctx.fillStyle = '#0a0a0a';
      
      // Stadium bowl outline
      ctx.beginPath();
      ctx.ellipse(512, 400, 400, 100, 0, 0, Math.PI);
      ctx.fill();
      
      // Stadium towers/lights
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI;
        const x = 512 + Math.cos(angle) * 350;
        const y = 400 - Math.sin(angle) * 80;
        
        ctx.fillRect(x - 5, y - 80, 10, 80);
        
        // Light fixtures
        ctx.fillStyle = '#ffff88';
        ctx.fillRect(x - 15, y - 85, 30, 8);
        ctx.fillStyle = '#0a0a0a';
      }
      
      // Add some crowd lighting
      ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
      ctx.fillRect(112, 350, 800, 50);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Stadium night background */}
      <primitive object={stadiumTexture} attach="background" />
      
      {/* Stadium ambient lighting */}
      <ambientLight intensity={0.6} color="#2a3a5a" />
      
      {/* Main stadium floodlights */}
      <directionalLight 
        position={[25, 40, 25]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-25, 40, 25]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[0, 45, -30]} 
        intensity={3.0} 
        color="#fff8dc"
      />
      
      {/* Stadium tower lights */}
      <spotLight
        position={[35, 50, 35]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={4.0}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-35, 50, 35]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={4.0}
        color="#ffffff"
        castShadow
      />
      
      {/* Stadium perimeter lighting */}
      <pointLight position={[50, 25, 0]} intensity={1.5} color="#ffffe0" />
      <pointLight position={[-50, 25, 0]} intensity={1.5} color="#ffffe0" />
      <pointLight position={[0, 20, 60]} intensity={1.2} color="#e6f3ff" />
      <pointLight position={[0, 20, -60]} intensity={1.2} color="#e6f3ff" />
    </>
  );
};
