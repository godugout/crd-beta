
import React, { useMemo } from 'react';
import * as THREE from 'three';

const NeonGrid = () => {
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(300, 300, 60, 60);
    return geometry;
  }, []);

  return (
    <mesh position={[0, -15, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <primitive object={gridGeometry} />
      <meshBasicMaterial 
        color="#00ffff" 
        wireframe={true} 
        opacity={0.4} 
        transparent={true}
      />
    </mesh>
  );
};

export const CyberpunkEnvironment = () => {
  // Create cyberpunk city background
  const cyberpunkTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark cyberpunk sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.5, '#1a0a2a');
      gradient.addColorStop(1, '#0a0a0a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add cyberpunk city silhouette
      ctx.fillStyle = '#0a0a0a';
      for (let i = 0; i < 30; i++) {
        const x = i * 35;
        const height = 150 + Math.random() * 200;
        const width = 25 + Math.random() * 15;
        
        ctx.fillRect(x, 512 - height, width, height);
        
        // Add neon window lights
        ctx.fillStyle = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
        for (let j = 0; j < height / 20; j++) {
          if (Math.random() > 0.7) {
            ctx.fillRect(x + 2, 512 - height + j * 20 + 2, width - 4, 3);
          }
        }
        ctx.fillStyle = '#0a0a0a';
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Cyberpunk city background */}
      <primitive object={cyberpunkTexture} attach="background" />
      
      {/* Neon grid floor */}
      <NeonGrid />
      
      {/* Cyberpunk ambient lighting */}
      <ambientLight intensity={0.3} color="#001133" />
      
      {/* Neon lighting setup */}
      <directionalLight 
        position={[25, 35, 25]} 
        intensity={2.2} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[-25, 35, 25]} 
        intensity={2.2} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[0, 40, -30]} 
        intensity={1.8} 
        color="#ffff00"
      />
      
      {/* Cyberpunk neon spots */}
      <spotLight
        position={[40, 45, 40]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.5}
        color="#00ffff"
        castShadow
      />
      <spotLight
        position={[-40, 45, 40]}
        target-position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.7}
        intensity={3.5}
        color="#ff00ff"
        castShadow
      />
      
      {/* City neon glow */}
      <pointLight position={[50, 20, 0]} intensity={1.8} color="#00ffff" />
      <pointLight position={[-50, 20, 0]} intensity={1.8} color="#ff00ff" />
      <pointLight position={[0, 25, 60]} intensity={1.5} color="#ffff00" />
      <pointLight position={[0, 25, -60]} intensity={1.5} color="#ff4500" />
      
      {/* Scattered neon accents */}
      <pointLight position={[35, 12, 35]} intensity={1.0} color="#00ff00" />
      <pointLight position={[-35, 12, 35]} intensity={1.0} color="#ff1493" />
      <pointLight position={[35, 12, -35]} intensity={1.0} color="#1e90ff" />
      <pointLight position={[-35, 12, -35]} intensity={1.0} color="#ff6347" />
    </>
  );
};
