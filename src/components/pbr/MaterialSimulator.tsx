
import React, { useEffect, useRef } from 'react';
import { MaterialSimulation } from '@/hooks/card-effects/types';
import './fabric-materials.css';

interface MaterialSimulatorProps {
  material: MaterialSimulation;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * A component that simulates different fabric materials for uniform textures
 */
const MaterialSimulator: React.FC<MaterialSimulatorProps> = ({
  material,
  width = 256,
  height = 256,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render the material effect onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the base color or texture
    if (material.textureUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply material-specific effects
        applyMaterialEffect(ctx, canvas.width, canvas.height, material);
      };
      img.src = material.textureUrl;
    } else {
      // Fill with base color if no texture
      ctx.fillStyle = material.baseColor || '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      applyMaterialEffect(ctx, canvas.width, canvas.height, material);
    }
  }, [material, width, height]);

  // Apply different effects based on material type
  const applyMaterialEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    material: MaterialSimulation
  ) => {
    // Save context state
    ctx.save();
    
    // Apply different patterns based on material type
    switch (material.type) {
      case 'mesh':
        // Create mesh pattern
        drawMeshPattern(ctx, width, height, material);
        break;
      case 'synthetic':
        // Create synthetic fabric pattern
        drawSyntheticPattern(ctx, width, height, material);
        break;
      case 'canvas':
      default:
        // Create canvas/cotton pattern
        drawCanvasPattern(ctx, width, height, material);
        break;
    }
    
    // Apply weathering if specified
    if (material.weathering) {
      applyWeatheringEffect(ctx, width, height, material.weathering);
    }
    
    // Apply lighting effects
    applyLightingEffect(ctx, width, height, material);
    
    // Restore context
    ctx.restore();
  };
  
  // Create mesh pattern (basketball jerseys, etc.)
  const drawMeshPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    material: MaterialSimulation
  ) => {
    const meshSize = 4;
    const opacity = 0.2;
    
    // Add mesh texture overlay
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = opacity;
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += meshSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Draw vertical lines
    for (let x = 0; x < width; x += meshSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    
    // Add subtle highlights
    ctx.globalCompositeOperation = 'overlay';
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Create synthetic fabric pattern
  const drawSyntheticPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    material: MaterialSimulation
  ) => {
    // Add smooth gradient sheen
    ctx.globalCompositeOperation = 'overlay';
    const gradient = ctx.createLinearGradient(0, 0, width, height / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add fine diagonal pattern
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.05;
    
    const patternSize = 2;
    for (let i = 0; i < width + height; i += patternSize * 2) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(i, 0);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };
  
  // Create canvas/cotton pattern
  const drawCanvasPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    material: MaterialSimulation
  ) => {
    // Apply canvas texture
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.1;
    
    // Create canvas texture with small dots/noise
    for (let x = 0; x < width; x += 3) {
      for (let y = 0; y < height; y += 3) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    
    // Add subtle fabric grain diagonal lines
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.05;
    
    for (let i = -height; i < width; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };
  
  // Apply weathering effects (new, game-worn, vintage)
  const applyWeatheringEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    weathering: string
  ) => {
    switch (weathering) {
      case 'game-worn':
        // Add some scuffs and wear marks
        ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = 5 + Math.random() * 15;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        break;
        
      case 'vintage':
        // Add yellowing/aging effect
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(255, 240, 200, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Add some fading
        ctx.globalCompositeOperation = 'overlay';
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(200, 200, 160, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add some random aging spots
        ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = 1 + Math.random() * 5;
          ctx.fillStyle = 'rgba(139, 69, 19, 0.05)';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'new':
      default:
        // New uniforms just have a slight sheen
        ctx.globalCompositeOperation = 'overlay';
        const newGradient = ctx.createLinearGradient(0, 0, width, height);
        newGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        newGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        newGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = newGradient;
        ctx.fillRect(0, 0, width, height);
        break;
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Apply lighting effect based on material properties
  const applyLightingEffect = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    material: MaterialSimulation
  ) => {
    // Apply reflections based on metalness/roughness
    const reflectionIntensity = material.metalness ? Math.min(0.5, material.metalness * 0.5) : 0.1;
    const roughness = material.roughness || 0.5;
    
    // Less roughness = sharper reflections
    const blurAmount = roughness * 20;
    
    // Create a diagonal highlight that mimics environmental lighting
    ctx.globalCompositeOperation = 'overlay';
    const x = width * 0.2;
    const y = height * 0.2;
    const radius = Math.max(width, height) * (1 - roughness * 0.5);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${reflectionIntensity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${reflectionIntensity * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // If it's a synthetic material, add a second highlight point
    if (material.type === 'synthetic') {
      const x2 = width * 0.8;
      const y2 = height * 0.8;
      const radius2 = Math.max(width, height) * 0.7;
      
      const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, radius2);
      gradient2.addColorStop(0, `rgba(255, 255, 255, ${reflectionIntensity * 0.7})`);
      gradient2.addColorStop(0.5, `rgba(255, 255, 255, ${reflectionIntensity * 0.2})`);
      gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  return (
    <div className={`material-simulator ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="material-canvas"
      />
      <div className={`material-overlay material-${material.type}`} />
    </div>
  );
};

export default MaterialSimulator;
