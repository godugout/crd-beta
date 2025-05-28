
import React, { useMemo } from 'react';
import * as THREE from 'three';

const NeonLights = () => {
  const neonColors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'];
  
  return (
    <>
      {neonColors.map((color, index) => (
        <pointLight
          key={index}
          position={[
            (index - 2) * 20,
            15 + Math.sin(index) * 8,
            (index % 2 === 0 ? 25 : -25)
          ]}
          color={color}
          intensity={1.2}
          distance={60}
        />
      ))}
    </>
  );
};

export const RetroArcadeEnvironment = () => {
  // Create retro arcade background
  const arcadeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark arcade background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add arcade machine silhouettes
      const machines = [
        { x: 50, width: 80, height: 180 },
        { x: 180, width: 90, height: 200 },
        { x: 320, width: 75, height: 170 },
        { x: 450, width: 85, height: 190 },
        { x: 580, width: 80, height: 175 },
        { x: 710, width: 90, height: 185 },
        { x: 850, width: 80, height: 180 }
      ];
      
      machines.forEach((machine, index) => {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(machine.x, 512 - machine.height, machine.width, machine.height);
        
        // Add colorful screen glow
        const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'];
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(machine.x + 10, 512 - machine.height + 20, machine.width - 20, machine.height * 0.4);
        
        // Add button panels
        ctx.fillStyle = '#333333';
        ctx.fillRect(machine.x + 15, 512 - machine.height * 0.4, machine.width - 30, 30);
      });
      
      // Add neon strip lighting on ceiling
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 4;
      for (let i = 0; i < 1024; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 20);
        ctx.lineTo(i + 80, 20);
        ctx.stroke();
      }
      
      // Add floor reflection
      const floorGradient = ctx.createLinearGradient(0, 450, 0, 512);
      floorGradient.addColorStop(0, 'rgba(255, 0, 128, 0)');
      floorGradient.addColorStop(1, 'rgba(255, 0, 128, 0.1)');
      
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, 450, 1024, 62);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      {/* Retro arcade background */}
      <primitive object={arcadeTexture} attach="background" />
      
      {/* Neon lighting array */}
      <NeonLights />
      
      {/* Arcade ambient lighting */}
      <ambientLight intensity={0.4} color="#330066" />
      
      {/* Main arcade lighting */}
      <directionalLight 
        position={[20, 30, 20]} 
        intensity={2.0} 
        color="#ff00ff"
        castShadow
      />
      <directionalLight 
        position={[-20, 30, 20]} 
        intensity={2.0} 
        color="#00ffff"
        castShadow
      />
      <directionalLight 
        position={[0, 35, -25]} 
        intensity={1.8} 
        color="#ffff00"
      />
      
      {/* Arcade machine glow */}
      <spotLight
        position={[30, 25, 30]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.6}
        intensity={2.8}
        color="#ff0080"
        castShadow
      />
      <spotLight
        position={[-30, 25, 30]}
        target-position={[0, 0, 0]}
        angle={0.35}
        penumbra={0.6}
        intensity={2.8}
        color="#00ff80"
        castShadow
      />
      
      {/* Retro neon accents */}
      <pointLight position={[40, 12, 0]} intensity={1.5} color="#ff0080" />
      <pointLight position={[-40, 12, 0]} intensity={1.5} color="#00ff80" />
      <pointLight position={[0, 18, 45]} intensity={1.2} color="#8000ff" />
      <pointLight position={[0, 18, -45]} intensity={1.2} color="#ff8000" />
      
      {/* Screen glow effects */}
      <pointLight position={[25, 8, 25]} intensity={0.8} color="#0080ff" />
      <pointLight position={[-25, 8, 25]} intensity={0.8} color="#ff4080" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#80ff40" />
    </>
  );
};
