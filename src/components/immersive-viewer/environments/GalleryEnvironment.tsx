
import React, { useMemo } from 'react';
import * as THREE from 'three';

export const GalleryEnvironment = () => {
  // Create gallery background texture
  const galleryTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clean white gallery walls
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add subtle wall panels
      ctx.strokeStyle = '#e8e8e8';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const x = i * 200 + 100;
        ctx.strokeRect(x, 50, 150, 200);
      }
      
      // Add gallery lighting fixtures
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 6; i++) {
        const x = i * 170 + 50;
        ctx.fillRect(x, 20, 60, 10);
      }
      
      // Add subtle floor reflection
      const floorGradient = ctx.createLinearGradient(0, 400, 0, 512);
      floorGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      floorGradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
      
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, 400, 1024, 112);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Clean white gallery background */}
      <primitive object={galleryTexture} attach="background" />
      
      {/* Gallery lighting setup */}
      <ambientLight intensity={0.8} color="#f5f5f5" />
      
      {/* Main gallery track lighting */}
      <directionalLight 
        position={[12, 20, 10]} 
        intensity={2.8} 
        color="#ffffff"
        castShadow
      />
      <directionalLight 
        position={[-10, 20, 10]} 
        intensity={2.6} 
        color="#f8f8ff"
        castShadow
      />
      <directionalLight 
        position={[0, 25, -15]} 
        intensity={2.4} 
        color="#fffafa"
      />
      
      {/* Focused spotlights for artwork */}
      <spotLight
        position={[0, 30, 15]}
        target-position={[0, 0, 0]}
        angle={0.2}
        penumbra={0.3}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[20, 28, 8]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
      />
      <spotLight
        position={[-20, 28, 8]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
      />
    </>
  );
};
