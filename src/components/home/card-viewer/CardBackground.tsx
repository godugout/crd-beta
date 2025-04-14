
import React, { useEffect, useRef } from 'react';

interface CardBackgroundProps {
  activeEffects?: string[];
}

const CardBackground: React.FC<CardBackgroundProps> = ({ activeEffects = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Determine background style based on active effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Reset canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Choose background style based on active effects
    const hasRefractor = activeEffects.includes('Refractor');
    const hasHolographic = activeEffects.includes('Holographic');
    const hasGoldFoil = activeEffects.includes('Gold Foil');
    const hasVintage = activeEffects.includes('Vintage');
    
    // Create gradient background
    const gradient = hasGoldFoil 
      ? ctx.createRadialGradient(rect.width/2, rect.height/2, 0, rect.width/2, rect.height/2, rect.width)
      : ctx.createLinearGradient(0, 0, rect.width, rect.height);
    
    if (hasRefractor && hasHolographic) {
      // Vibrant dual-effect background
      gradient.addColorStop(0, 'rgba(30, 30, 50, 1)');
      gradient.addColorStop(0.4, 'rgba(20, 20, 40, 1)');
      gradient.addColorStop(0.6, 'rgba(15, 15, 35, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
    } else if (hasRefractor) {
      // Cool blue refractor background
      gradient.addColorStop(0, 'rgba(10, 20, 40, 1)');
      gradient.addColorStop(0.5, 'rgba(5, 10, 30, 1)');
      gradient.addColorStop(1, 'rgba(0, 5, 20, 1)');
    } else if (hasHolographic) {
      // Rainbow-tinted holographic background
      gradient.addColorStop(0, 'rgba(25, 15, 30, 1)');
      gradient.addColorStop(0.5, 'rgba(15, 10, 25, 1)');
      gradient.addColorStop(1, 'rgba(10, 5, 20, 1)');
    } else if (hasGoldFoil) {
      // Gold-tinted luxury background
      gradient.addColorStop(0, 'rgba(25, 20, 10, 1)');
      gradient.addColorStop(0.7, 'rgba(15, 10, 5, 1)');
      gradient.addColorStop(1, 'rgba(10, 5, 0, 1)');
    } else if (hasVintage) {
      // Sepia-toned vintage background
      gradient.addColorStop(0, 'rgba(30, 25, 20, 1)');
      gradient.addColorStop(0.5, 'rgba(20, 15, 10, 1)');
      gradient.addColorStop(1, 'rgba(15, 10, 5, 1)');
    } else {
      // Default dark background
      gradient.addColorStop(0, 'rgba(20, 20, 25, 1)');
      gradient.addColorStop(0.5, 'rgba(10, 10, 15, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 10, 1)');
    }
    
    // Apply gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Add particle effects
    if (hasRefractor || hasHolographic) {
      drawParticles(ctx, rect.width, rect.height, 
        hasRefractor ? 'blue' : hasHolographic ? 'rainbow' : 'white');
    }
    
    // Add ambient light glow
    drawAmbientGlow(ctx, rect.width, rect.height);
    
  }, [activeEffects]);
  
  const drawParticles = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    color: 'blue' | 'rainbow' | 'white' | 'gold' = 'white'
  ) => {
    const particleCount = 75;
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.6 + 0.2;
      
      let particleColor;
      
      switch (color) {
        case 'blue':
          particleColor = `rgba(100, 150, 255, ${opacity})`;
          break;
        case 'rainbow':
          const hue = Math.floor(Math.random() * 360);
          particleColor = `hsla(${hue}, 100%, 70%, ${opacity})`;
          break;
        case 'gold':
          const goldHue = 35 + Math.random() * 20;
          const goldSat = 80 + Math.random() * 20;
          particleColor = `hsla(${goldHue}, ${goldSat}%, 60%, ${opacity})`;
          break;
        default:
          particleColor = `rgba(255, 255, 255, ${opacity})`;
      }
      
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  const drawAmbientGlow = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Center glow
    const centerX = width / 2;
    const centerY = height / 2;
    
    const centerGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, height / 1.5
    );
    
    centerGlow.addColorStop(0, 'rgba(100, 100, 150, 0.15)');
    centerGlow.addColorStop(1, 'rgba(100, 100, 150, 0)');
    
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle light beams
    const beamCount = 3;
    for (let i = 0; i < beamCount; i++) {
      const rotation = (Math.PI * 2 / beamCount) * i;
      const x1 = centerX;
      const y1 = centerY;
      const distance = Math.sqrt(width * width + height * height) / 2;
      const x2 = centerX + Math.cos(rotation) * distance;
      const y2 = centerY + Math.sin(rotation) * distance;
      
      const beamGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      beamGradient.addColorStop(0, 'rgba(150, 150, 200, 0.1)');
      beamGradient.addColorStop(1, 'rgba(150, 150, 200, 0)');
      
      ctx.fillStyle = beamGradient;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.fillRect(-30, 0, 60, distance);
      ctx.restore();
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-50"></div>
    </div>
  );
};

export default CardBackground;
