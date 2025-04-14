
import React, { useEffect, useRef } from 'react';

interface CardShopBackgroundProps {
  className?: string;
}

const CardShopBackground: React.FC<CardShopBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    drawCardShopBackground(ctx, rect.width, rect.height);
    
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawCardShopBackground(ctx, rect.width, rect.height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const drawCardShopBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Soft, muted gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#F1F0FB');    // Soft Gray
    bgGradient.addColorStop(1, '#D3E4FD');    // Soft Blue
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Subtle ambient particles
    drawSoftParticles(ctx, width, height);
    
    // Soft light effects
    drawSoftLighting(ctx, width, height);
  };
  
  const drawSoftParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  
  const drawSoftLighting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lightGradient = ctx.createRadialGradient(
      width * 0.7, height * 0.3, 0,
      width * 0.7, height * 0.3, width * 0.5
    );
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
  };
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-30"></div>
    </div>
  );
};

export default CardShopBackground;
