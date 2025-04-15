
import React, { useEffect, useRef } from 'react';

interface CardShopBackgroundProps {
  style: 'grid' | 'shop' | 'minimal';
}

const CardShopBackground: React.FC<CardShopBackgroundProps> = ({ style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw grid pattern on canvas
  useEffect(() => {
    if (!canvasRef.current || style !== 'grid') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid properties
    const gridSize = 40;
    const gridColor = 'rgba(150, 150, 170, 0.1)';
    const majorGridSize = gridSize * 5;
    const majorGridColor = 'rgba(150, 150, 170, 0.15)';
    
    // Draw minor grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw major grid lines
    ctx.strokeStyle = majorGridColor;
    ctx.lineWidth = 1;
    
    // Draw horizontal major lines
    for (let y = 0; y < canvas.height; y += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw vertical major lines
    for (let x = 0; x < canvas.width; x += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Redraw grid
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw minor grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Draw major grid lines
        ctx.strokeStyle = majorGridColor;
        ctx.lineWidth = 1;
        
        for (let y = 0; y < canvas.height; y += majorGridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        for (let x = 0; x < canvas.width; x += majorGridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [style]);
  
  if (style === 'grid') {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] to-[#252D40]"></div>
        <canvas ref={canvasRef} className="absolute inset-0"></canvas>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#1A1F2C]/80"></div>
      </>
    );
  }
  
  if (style === 'shop') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141824] to-[#0f131b]"></div>
        
        {/* Shop elements */}
        <div className="absolute inset-0 perspective-900 overflow-hidden opacity-60">
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0a0d14] to-[#141824] transform rotate-x-60 origin-bottom"></div>
          
          {/* Display shelf highlights */}
          <div className="absolute left-[10%] right-[10%] top-[30%] h-[1px] bg-[#3a4c6d] blur-[2px]"></div>
          <div className="absolute left-[10%] right-[10%] top-[45%] h-[1px] bg-[#3a4c6d] blur-[2px]"></div>
          <div className="absolute left-[10%] right-[10%] top-[60%] h-[1px] bg-[#3a4c6d] blur-[2px]"></div>
          
          {/* Vertical display dividers */}
          <div className="absolute left-[25%] top-[20%] bottom-[20%] w-[1px] bg-[#202b3d] blur-[1px]"></div>
          <div className="absolute left-[50%] top-[20%] bottom-[20%] w-[1px] bg-[#202b3d] blur-[1px]"></div>
          <div className="absolute left-[75%] top-[20%] bottom-[20%] w-[1px] bg-[#202b3d] blur-[1px]"></div>
          
          {/* Display reflection */}
          <div className="absolute top-[20%] left-[10%] right-[10%] h-[60%] bg-gradient-to-b from-[#0c111b]/40 to-transparent"></div>
        </div>
        
        {/* Shop lighting */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1E3A70]/10 via-transparent to-transparent" style={{ top: '-20%', left: '30%' }}></div>
        <div className="absolute inset-0 bg-gradient-radial from-[#1E3A70]/10 via-transparent to-transparent" style={{ top: '-20%', left: '70%' }}></div>
        <div className="absolute inset-0 bg-gradient-radial from-[#1E3A70]/15 via-transparent to-transparent" style={{ top: '-10%', left: '50%' }}></div>
      </div>
    );
  }
  
  // Minimal style (default)
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#121621] to-[#0d1017]"></div>
  );
};

export default CardShopBackground;
