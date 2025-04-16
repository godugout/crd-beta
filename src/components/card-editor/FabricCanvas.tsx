
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface FabricCanvasProps {
  width?: number;
  height?: number;
  onReady?: (canvas: FabricCanvas) => void;
  className?: string;
}

const Canvas: React.FC<FabricCanvasProps> = ({
  width = 500,
  height = 700,
  onReady,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Initializing Fabric.js canvas");

    // Initialize Fabric canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    
    // Execute onReady callback if provided
    if (onReady) {
      onReady(canvas);
    }

    // Clean up function
    return () => {
      console.log("Disposing Fabric.js canvas");
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [width, height, onReady]);

  return (
    <div className={`fabric-canvas-container ${className}`}>
      <canvas ref={canvasRef} className="border rounded-md shadow-md" />
    </div>
  );
};

export default Canvas;
