
import React, { useEffect, useRef } from 'react';
import { drawCardShopBackground } from './background-utils/backgroundRenderer';

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
    
    // Setup canvas with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Initial draw
    drawCardShopBackground(ctx, rect.width, rect.height);
    
    // Handle window resize
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
