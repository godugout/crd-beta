
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  width: number;
  height: number;
  onReady?: (canvas: fabric.Canvas) => void;
  className?: string;
}

const Canvas: React.FC<CanvasProps> = ({
  width = 500,
  height = 700,
  onReady,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clean up any existing canvas instance
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.dispose();
    }
    
    try {
      // Create a new canvas instance with proper error handling
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });
      
      canvasInstanceRef.current = canvas;
      
      // Call onReady callback if provided
      if (onReady) {
        onReady(canvas);
      }
      
      // Log success for debugging
      console.log("Fabric canvas initialized successfully:", {
        width: canvas.getWidth(),
        height: canvas.getHeight()
      });
    } catch (error) {
      console.error("Failed to initialize Fabric canvas:", error);
    }

    // Clean up on unmount
    return () => {
      if (canvasInstanceRef.current) {
        try {
          canvasInstanceRef.current.dispose();
          canvasInstanceRef.current = null;
        } catch (error) {
          console.error("Error disposing canvas:", error);
        }
      }
    };
  }, [width, height, onReady]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      data-testid="fabric-canvas"
    />
  );
};

export default Canvas;
