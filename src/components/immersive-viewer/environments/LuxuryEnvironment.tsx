
import React, { useMemo } from 'react';
import * as THREE from 'three';

export const LuxuryEnvironment = () => {
  // Create luxury lounge background
  const luxuryTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Rich warm background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#2a1f15');
      gradient.addColorStop(0.5, '#3d2a1a');
      gradient.addColorStop(1, '#4a3520');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add luxury wood paneling
      ctx.fillStyle = '#8B4513';
      for (let i = 0; i < 4; i++) {
        const x = i * 250 + 25;
        ctx.fillRect(x, 100, 200, 300);
        
        // Add gold trim
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, 100, 200, 300);
      }
      
      // Add chandelier silhouette
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(512, 80, 100, 30, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add luxury carpet pattern
      const carpetGradient = ctx.createLinearGradient(0, 400, 0, 512);
      carpetGradient.addColorStop(0, '#8B0000');
      carpetGradient.addColorStop(1, '#A0522D');
      
      ctx.fillStyle = carpetGradient;
      ctx.fillRect(0, 400, 1024, 112);
      
      // Add ornate pattern to carpet
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = i * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, 450, 20, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Rich luxury background */}
      <primitive object={luxuryTexture} attach="background" />
      
      {/* Warm luxury ambient lighting */}
      <ambientLight intensity={0.7} color="#ffd700" />
      
      {/* Main luxury lighting setup */}
      <directionalLight 
        position={[15, 25, 20]} 
        intensity={2.8} 
        color="#fff8dc"
        castShadow
      />
      <directionalLight 
        position={[-12, 22, 18]} 
        intensity={2.5} 
        color="#f5e6a3"
        castShadow
      />
      <directionalLight 
        position={[0, 30, -25]} 
        intensity={2.2} 
        color="#ffebcd"
      />
      
      {/* Elegant chandelier-style lighting */}
      <spotLight
        position={[0, 35, 12]}
        target-position={[0, 0, 0]}
        angle={0.25}
        penumbra={0.5}
        intensity={3.8}
        color="#ffd700"
        castShadow
      />
      <spotLight
        position={[20, 30, 0]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.6}
        intensity={3.2}
        color="#fff8dc"
      />
      <spotLight
        position={[-20, 30, 0]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.6}
        intensity={3.2}
        color="#fff8dc"
      />
      
      {/* Accent warm lighting */}
      <pointLight position={[30, 18, 30]} intensity={1.2} color="#ffd700" />
      <pointLight position={[-30, 18, 30]} intensity={1.2} color="#ffd700" />
      <pointLight position={[0, 12, 40]} intensity={1.0} color="#ffebcd" />
      <pointLight position={[0, 12, -40]} intensity={1.0} color="#ffebcd" />
      
      {/* Luxury rim lighting */}
      <pointLight position={[35, 8, 0]} intensity={0.6} color="#daa520" />
      <pointLight position={[-35, 8, 0]} intensity={0.6} color="#daa520" />
    </>
  );
};
