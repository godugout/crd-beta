
import React, { useEffect, useRef, useState } from 'react';
import { MaterialSimulation } from '@/hooks/card-effects/types';

interface MaterialSimulatorProps {
  material: MaterialSimulation;
  width?: number;
  height?: number;
  className?: string;
  onTextureLoad?: () => void;
}

/**
 * MaterialSimulator renders physically-based materials for cards
 * Uses WebGL to simulate different material properties like fabric textures
 */
const MaterialSimulator: React.FC<MaterialSimulatorProps> = ({
  material,
  width = 300,
  height = 420,
  className = '',
  onTextureLoad
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply base material color
    ctx.fillStyle = material.baseColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simulate material texture based on type
    switch(material.type) {
      case 'canvas':
        renderCanvasTexture(ctx, canvas.width, canvas.height);
        break;
      case 'metal':
        renderMetalTexture(ctx, canvas.width, canvas.height);
        break;
      case 'glossy':
        renderGlossyTexture(ctx, canvas.width, canvas.height);
        break;
      case 'matte':
        renderMatteTexture(ctx, canvas.width, canvas.height);
        break;
      case 'embossed':
        renderEmbossedTexture(ctx, canvas.width, canvas.height);
        break;
      case 'refractor':
        renderRefractorTexture(ctx, canvas.width, canvas.height, material.refractorProperties);
        break;
      case 'holographic':
        renderHolographicTexture(ctx, canvas.width, canvas.height, material.holographicProperties);
        break;
      default:
        // Default texture
        break;
    }

    setIsLoaded(true);
    if (onTextureLoad) onTextureLoad();
    
  }, [material, width, height, onTextureLoad]);

  // Canvas texture renderer (for sports jersey fabric)
  const renderCanvasTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a subtle canvas/fabric pattern
    ctx.globalAlpha = 0.3;
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        if ((x + y) % 6 === 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1.0;
    
    // Add subtle weave pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    for (let i = 0; i < height; i += 8) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  };

  // Metal texture renderer
  const renderMetalTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a gradient for metallic effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(220,220,220,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add metallic scratches
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = x1 + (Math.random() * 100 - 50);
      const y2 = y1 + (Math.random() * 100 - 50);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  // Glossy texture renderer
  const renderGlossyTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a glossy highlight
    const gradient = ctx.createRadialGradient(
      width * 0.3, height * 0.3, 10,
      width * 0.3, height * 0.3, width * 0.8
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Matte texture renderer
  const renderMatteTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create a subtle noise texture for matte finish
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const value = Math.random() * 10;
        ctx.fillStyle = `rgba(0,0,0,${value / 200})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  };

  // Embossed texture renderer
  const renderEmbossedTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simulate embossing with shadows and highlights
    for (let y = 10; y < height - 10; y += 20) {
      for (let x = 10; x < width - 10; x += 20) {
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x - 1, y - 1, 10, 10);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 1, y + 1, 10, 10);
      }
    }
  };

  // Refractor texture renderer
  const renderRefractorTexture = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    properties?: { intensity: number; speed: number; colors: string[]; angle?: number; }
  ) => {
    if (!properties) return;
    
    const { intensity = 0.5, colors = ['#ff0000', '#00ff00', '#0000ff'] } = properties;
    
    // Create rainbow gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = intensity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };

  // Holographic texture renderer
  const renderHolographicTexture = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    properties?: { 
      intensity: number; 
      pattern: 'linear' | 'circular' | 'angular' | 'geometric';
      colorMode: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
      customColors?: string[];
      sparklesEnabled: boolean;
      borderWidth: number;
    }
  ) => {
    if (!properties) return;
    
    const { 
      intensity = 0.8, 
      pattern = 'linear', 
      colorMode = 'rainbow',
      sparklesEnabled = true,
      borderWidth = 1
    } = properties;
    
    let colors: string[];
    
    // Determine colors based on colorMode
    switch (colorMode) {
      case 'blue-purple':
        colors = ['#0033cc', '#6600cc', '#cc00cc', '#6600cc', '#0033cc'];
        break;
      case 'gold-green':
        colors = ['#ffcc00', '#ccff00', '#00ffcc', '#ccff00', '#ffcc00'];
        break;
      case 'custom':
        colors = properties.customColors || ['#ff0080', '#00ffff', '#ffff00'];
        break;
      case 'rainbow':
      default:
        colors = ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0099ff', '#6633ff', '#ff0099', '#ff0000'];
    }
    
    // Apply pattern
    switch (pattern) {
      case 'circular':
        renderHolographicCircularPattern(ctx, width, height, colors, intensity);
        break;
      case 'angular':
        renderHolographicAngularPattern(ctx, width, height, colors, intensity);
        break;
      case 'geometric':
        renderHolographicGeometricPattern(ctx, width, height, colors, intensity);
        break;
      case 'linear':
      default:
        renderHolographicLinearPattern(ctx, width, height, colors, intensity);
    }
    
    // Add sparkles if enabled
    if (sparklesEnabled) {
      renderSparkles(ctx, width, height, intensity);
    }
    
    // Add border if width > 0
    if (borderWidth > 0) {
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
    }
  };

  // Helper functions for holographic patterns
  const renderHolographicLinearPattern = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: string[], 
    intensity: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = intensity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };

  const renderHolographicCircularPattern = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: string[], 
    intensity: number
  ) => {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 1.5
    );
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = intensity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
  };

  const renderHolographicAngularPattern = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: string[], 
    intensity: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height);
    
    for (let i = 0; i < 360; i += 15) {
      const angle = i * Math.PI / 180;
      const color = colors[Math.floor((i / 360) * colors.length)];
      
      ctx.globalAlpha = intensity * 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  };

  const renderHolographicGeometricPattern = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: string[], 
    intensity: number
  ) => {
    const size = 20;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        const colorIndex = Math.floor((x + y) / size) % colors.length;
        ctx.globalAlpha = intensity * 0.5;
        ctx.fillStyle = colors[colorIndex];
        if ((x + y) % (size * 2) === 0) {
          // Draw triangle
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x + size / 2, y + size);
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw diamond
          ctx.beginPath();
          ctx.moveTo(x + size / 2, y);
          ctx.lineTo(x + size, y + size / 2);
          ctx.lineTo(x + size / 2, y + size);
          ctx.lineTo(x, y + size / 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1.0;
  };

  const renderSparkles = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    intensity: number
  ) => {
    const numSparkles = Math.floor(width * height / 1000 * intensity);
    
    for (let i = 0; i < numSparkles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      className={`material-simulator ${className} ${isLoaded ? 'loaded' : 'loading'}`}
    />
  );
};

export default MaterialSimulator;
