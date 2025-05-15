
import React, { useEffect, useRef } from 'react';

interface CardCanvasProps {
  template?: any;
  onReady?: (canvas: HTMLCanvasElement) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ template = {}, onReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set default styles in case template properties are missing
    const cardStyle = template.cardStyle || {};
    const textStyle = template.textStyle || {};
    
    // Draw card background
    ctx.fillStyle = cardStyle.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw border if needed
    if (cardStyle.borderWidth && cardStyle.borderColor) {
      ctx.strokeStyle = cardStyle.borderColor;
      ctx.lineWidth = parseInt(cardStyle.borderWidth);
      ctx.strokeRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Call onReady callback if provided
    if (onReady && canvasRef.current) {
      onReady(canvasRef.current);
    }
  }, [template, onReady]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={420} 
      className="w-full h-full object-contain border rounded shadow-sm"
    />
  );
};

export default CardCanvas;
