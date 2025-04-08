import { useEffect, useState, useRef } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface UseCanvasManagerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef?: React.RefObject<HTMLImageElement>;
  selectedAreas: EnhancedCropBoxProps[];
}

export const useCanvasManager = ({
  canvasRef,
  editorImgRef,
  selectedAreas
}: UseCanvasManagerProps) => {
  // Basic state for canvas manipulation
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  
  // Canvas interaction states
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const { isMobile, optimizeInteractions } = useMobileOptimization();
  
  // Redraw the canvas with current state
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const img = editorImgRef?.current;
    if (!canvas || !img || !img.complete) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image with current settings
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    // Apply brightness and contrast
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    ctx.drawImage(
      img, 
      offset.x, 
      offset.y, 
      scaledWidth, 
      scaledHeight
    );
    
    ctx.filter = 'none';
    
    // Draw selection areas
    selectedAreas.forEach((area, index) => {
      // Apply scaling and offset to box coordinates
      const scaledBox = {
        x: area.x * scale + offset.x,
        y: area.y * scale + offset.y,
        width: area.width * scale,
        height: area.height * scale
      };
      
      // Draw box
      ctx.strokeStyle = area.color || '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledBox.x, scaledBox.y, scaledBox.width, scaledBox.height);
      
      // Draw semi-transparent fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(scaledBox.x, scaledBox.y, scaledBox.width, scaledBox.height);
      
      // Draw type label
      if (area.memorabiliaType) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(scaledBox.x, scaledBox.y - 20, 80, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(area.memorabiliaType, scaledBox.x + 5, scaledBox.y - 5);
      }
    });
  };
  
  // Setup canvas and draw content
  useEffect(() => {
    if (!canvasRef.current || !editorImgRef?.current || !editorImgRef.current.complete) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container while maintaining aspect ratio
    const containerWidth = canvas.clientWidth;
    const containerHeight = canvas.clientHeight;
    const img = editorImgRef.current;
    
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let canvasWidth, canvasHeight;
    if (imgAspectRatio > containerAspectRatio) {
      canvasWidth = containerWidth;
      canvasHeight = containerWidth / imgAspectRatio;
    } else {
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * imgAspectRatio;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Calculate scale factor between original image and displayed size
    const scaleX = canvasWidth / img.naturalWidth;
    const scaleY = canvasHeight / img.naturalHeight;
    setScale(Math.min(scaleX, scaleY));
    
    redrawCanvas();
  }, [canvasRef, editorImgRef, selectedAreas]);
  
  // Handle rotation
  const rotateImage = (direction: 'clockwise' | 'counterclockwise') => {
    const rotationAmount = direction === 'clockwise' ? 90 : -90;
    setRotation(prevRotation => (prevRotation + rotationAmount) % 360);
    
    // Would need to adjust canvas and redraw
    redrawCanvas();
  };
  
  // Handle image enhancement
  const enhanceImage = () => {
    // Enhance brightness and contrast slightly
    setBrightness(prev => Math.min(150, prev + 10));
    setContrast(prev => Math.min(150, prev + 10));
    
    redrawCanvas();
  };
  
  // Reset adjustments
  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setZoom(100);
    
    redrawCanvas();
  };
  
  // Handle pointer events
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault();
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      
      // Handle multi-touch for pinch zoom
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance.current = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        return;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Start drawing new box
    setIsDrawing(true);
    setStartPoint({ x, y });
  };
  
  // Handle mouse/touch move event
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      e.preventDefault();
      // Handle pinch zoom
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const zoomFactor = currentDistance / lastTouchDistance.current;
        handleZoom(zoomFactor);
        lastTouchDistance.current = currentDistance;
        return;
      }
      
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
  };
  
  // Handle mouse/touch up event
  const handlePointerUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  const handleZoom = (factor: number) => {
    const newScale = Math.max(0.1, Math.min(5, scale * factor));
    setScale(newScale);
    redrawCanvas();
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
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
    redrawCanvas,
    scale,
    setScale,
    offset,
    setOffset
  };
};
