
import { useState, useEffect } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';

interface UseCanvasManagerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  selectedAreas: EnhancedCropBoxProps[];
}

export const useCanvasManager = ({ 
  canvasRef, 
  editorImgRef, 
  selectedAreas 
}: UseCanvasManagerProps) => {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  
  // Initialize canvas when the component mounts and image is loaded
  useEffect(() => {
    if (editorImgRef.current && canvasRef.current) {
      const img = editorImgRef.current;
      
      // Wait for image to load
      if (img.complete) {
        initializeCanvas();
      } else {
        img.onload = initializeCanvas;
      }
    }
  }, [editorImgRef.current?.src, rotation, zoom, brightness, contrast]);
  
  const initializeCanvas = () => {
    if (!editorImgRef.current || !canvasRef.current) return;
    
    const img = editorImgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const containerHeight = canvas.parentElement?.clientHeight || 600;
    
    // Calculate scaled dimensions based on container and zoom
    const scale = (zoom / 100);
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    // Set canvas size
    canvas.width = Math.min(containerWidth, scaledWidth);
    canvas.height = Math.min(containerHeight, scaledHeight);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    // Calculate position to center image
    const x = -scaledWidth / 2;
    const y = -scaledHeight / 2;
    
    // Draw the image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    // Restore context
    ctx.restore();
    
    // Draw selected areas
    drawSelectedAreas(ctx);
  };
  
  // Draw all selected areas on the canvas
  const drawSelectedAreas = (ctx: CanvasRenderingContext2D) => {
    if (!ctx || !canvasRef.current || !editorImgRef.current) return;
    
    const canvas = canvasRef.current;
    const scale = zoom / 100;
    
    selectedAreas.forEach((area, index) => {
      // Calculate scaled position and size
      const x = (area.x * scale) + (canvas.width / 2 - (editorImgRef.current!.naturalWidth * scale) / 2);
      const y = (area.y * scale) + (canvas.height / 2 - (editorImgRef.current!.naturalHeight * scale) / 2);
      const width = area.width * scale;
      const height = area.height * scale;
      
      // Draw rectangle
      ctx.save();
      ctx.strokeStyle = area.color || '#00FF00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x, y, width, height);
      
      // Add label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y - 20, 120, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText(`${area.memorabiliaType || 'Face'} #${index + 1}`, x + 5, y - 5);
      
      ctx.restore();
    });
  };
  
  // Rotate the image
  const rotateImage = (direction: 'clockwise' | 'counterclockwise') => {
    const delta = direction === 'clockwise' ? 90 : -90;
    setRotation(prev => (prev + delta) % 360);
  };
  
  // Enhance image
  const enhanceImage = () => {
    // For now, we'll just simulate enhancement by adjusting brightness and contrast
    setBrightness(brightness => Math.min(130, brightness + 10));
    setContrast(contrast => Math.min(120, contrast + 15));
    return true;
  };
  
  // Reset all adjustments
  const resetAdjustments = () => {
    setZoom(100);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    
    // Re-initialize the canvas
    setTimeout(initializeCanvas, 50);
  };
  
  return {
    zoom,
    setZoom,
    rotation,
    setRotation,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    enhanceImage,
    rotateImage,
    resetAdjustments,
    initializeCanvas
  };
};
