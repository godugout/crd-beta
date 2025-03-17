
import { useEffect } from 'react';
import { ImageData } from './useCropState';

// This hook is simplified as Fabric.js now handles most of the rendering
export const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  imageData: ImageData,
  editorImgRef: React.RefObject<HTMLImageElement>
) => {
  // Use this hook for any canvas-related side effects that aren't handled by Fabric
  useEffect(() => {
    // Most rendering is now handled by the fabric canvas
    // This hook is kept for compatibility and future extensions
    
    // No direct canvas manipulation needed
  }, [canvasRef, imageData, editorImgRef]);
};
