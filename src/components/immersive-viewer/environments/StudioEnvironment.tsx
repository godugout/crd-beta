
import React, { useMemo } from 'react';
import * as THREE from 'three';

export const StudioEnvironment = () => {
  // Create professional studio background
  const studioTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Clean neutral studio background
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#f0f0f0');
      gradient.addColorStop(0.5, '#e8e8e8');
      gradient.addColorStop(1, '#d0d0d0');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add studio equipment silhouettes
      ctx.fillStyle = '#333333';
      
      // Camera tripods
      ctx.fillRect(100, 400, 8, 100);
      ctx.fillRect(900, 420, 8, 80);
      
      // Lighting stands
      ctx.fillRect(50, 350, 6, 150);
      ctx.fillRect(200, 380, 6, 120);
      ctx.fillRect(800, 360, 6, 140);
      ctx.fillRect(950, 390, 6, 110);
      
      // Light fixtures
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 340, 25, 15);
      ctx.fillRect(190, 370, 25, 15);
      ctx.fillRect(790, 350, 25, 15);
      ctx.fillRect(940, 380, 25, 15);
      
      // Seamless backdrop curve
      ctx.fillStyle = '#f8f8f8';
      ctx.beginPath();
      ctx.moveTo(0, 350);
      ctx.quadraticCurveTo(512, 300, 1024, 350);
      ctx.lineTo(1024, 512);
      ctx.lineTo(0, 512);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Clean neutral studio background */}
      <primitive object={studioTexture} attach="background" />
      
      {/* Professional studio lighting */}
      <ambientLight intensity={0.6} color="#f0f0ff" />
      
      {/* Key light */}
      <directionalLight 
        position={[12, 20, 15]} 
        intensity={3.5} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill lights */}
      <directionalLight 
        position={[-10, 18, 12]} 
        intensity={2.2} 
        color="#f0f0ff"
      />
      <directionalLight 
        position={[0, 12, -20]} 
        intensity={1.8} 
        color="#fff5e0"
      />
      
      {/* Professional studio spots */}
      <spotLight
        position={[18, 28, 20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.2}
        intensity={3.8}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-18, 28, 20]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.2}
        intensity={3.5}
        color="#ffffff"
      />
      <spotLight
        position={[0, 35, -25]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.3}
        intensity={3.0}
        color="#fff8dc"
      />
      
      {/* Rim lighting */}
      <pointLight position={[25, 15, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-25, 15, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, 8, 35]} intensity={1.0} color="#f8f8ff" />
    </>
  );
};
