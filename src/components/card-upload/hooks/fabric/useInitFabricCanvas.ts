
import { useEffect, useState } from 'react';
import { Canvas } from 'fabric';

export const useInitFabricCanvas = (
  fabricRef: React.RefObject<HTMLCanvasElement>,
) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  
  // Initialize the Fabric canvas
  useEffect(() => {
    if (!fabricRef.current) return;
    
    const canvasWidth = 600;
    const canvasHeight = 600;
    
    const fabricCanvas = new Canvas(fabricRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: false,
      preserveObjectStacking: true,
      backgroundColor: '#f1f5f9',
    });
    
    setCanvas(fabricCanvas);
    
    // Clean up on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, [fabricRef]);

  return canvas;
};
