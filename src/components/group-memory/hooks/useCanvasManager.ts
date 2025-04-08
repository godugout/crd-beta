
import { useEffect, useState, useRef, RefObject } from 'react';
import { EnhancedCropBoxProps } from '@/components/card-upload/cardDetection';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface UseCanvasManagerProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  imageRef: RefObject<HTMLImageElement>;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export const useCanvasManager = ({
  canvasRef,
  imageRef,
  cropBoxes,
  setCropBoxes,
  selectedIndex,
  setSelectedIndex
}: UseCanvasManagerProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const { isMobile, optimizeInteractions } = useMobileOptimization();
  
  // Setup canvas and draw content
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageRef.current.complete) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container while maintaining aspect ratio
    const containerWidth = canvas.clientWidth;
    const containerHeight = canvas.clientHeight;
    const img = imageRef.current;
    
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
  }, [canvasRef, imageRef, cropBoxes, selectedIndex]);
  
  // Redraw the canvas with current state
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image with current scale and offset
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    ctx.drawImage(
      img, 
      offset.x, 
      offset.y, 
      scaledWidth, 
      scaledHeight
    );
    
    // Draw crop boxes
    cropBoxes.forEach((box, index) => {
      const isSelected = index === selectedIndex;
      
      // Apply scaling and offset to box coordinates
      const scaledBox = {
        x: box.x * scale + offset.x,
        y: box.y * scale + offset.y,
        width: box.width * scale,
        height: box.height * scale
      };
      
      // Draw box
      ctx.strokeStyle = isSelected ? '#00AAFF' : box.color || '#FFFFFF';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.strokeRect(scaledBox.x, scaledBox.y, scaledBox.width, scaledBox.height);
      
      // Draw semi-transparent fill
      ctx.fillStyle = isSelected ? 'rgba(0, 170, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(scaledBox.x, scaledBox.y, scaledBox.width, scaledBox.height);
      
      // Draw handle points if selected
      if (isSelected) {
        drawHandles(ctx, scaledBox);
      }
      
      // Draw type label
      if (box.memorabiliaType) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(scaledBox.x, scaledBox.y - 20, 80, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(box.memorabiliaType, scaledBox.x + 5, scaledBox.y - 5);
      }
    });
  };
  
  // Draw handles for resizing
  const drawHandles = (ctx: CanvasRenderingContext2D, box: { x: number, y: number, width: number, height: number }) => {
    const handleSize = isMobile ? 12 : 8; // Larger handles for mobile
    const handlePositions = [
      { x: box.x, y: box.y },
      { x: box.x + box.width / 2, y: box.y },
      { x: box.x + box.width, y: box.y },
      { x: box.x + box.width, y: box.y + box.height / 2 },
      { x: box.x + box.width, y: box.y + box.height },
      { x: box.x + box.width / 2, y: box.y + box.height },
      { x: box.x, y: box.y + box.height },
      { x: box.x, y: box.y + box.height / 2 }
    ];
    
    ctx.fillStyle = '#00AAFF';
    handlePositions.forEach(pos => {
      ctx.fillRect(
        pos.x - handleSize / 2, 
        pos.y - handleSize / 2, 
        handleSize, 
        handleSize
      );
    });
  };
  
  // Handle mouse/touch down event
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
    
    // Check if clicking on existing box
    for (let i = cropBoxes.length - 1; i >= 0; i--) {
      const box = cropBoxes[i];
      const scaledBox = {
        x: box.x * scale + offset.x,
        y: box.y * scale + offset.y,
        width: box.width * scale,
        height: box.height * scale
      };
      
      if (
        x >= scaledBox.x && 
        x <= scaledBox.x + scaledBox.width && 
        y >= scaledBox.y && 
        y <= scaledBox.y + scaledBox.height
      ) {
        setSelectedIndex(i);
        setIsDragging(true);
        setStartPoint({ x, y });
        return;
      }
    }
    
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
    
    if (isDrawing) {
      // Create or update temporary box
      const newBox: EnhancedCropBoxProps = {
        id: cropBoxes.length + 1,
        x: Math.min(startPoint.x, x) - offset.x,
        y: Math.min(startPoint.y, y) - offset.y,
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
        rotation: 0,
        color: '#00AAFF',
        confidence: 1.0,
        memorabiliaType: 'unknown'
      };
      
      // Adjust coordinates to account for scale and offset
      newBox.x = (newBox.x - offset.x) / scale;
      newBox.y = (newBox.y - offset.y) / scale;
      newBox.width = newBox.width / scale;
      newBox.height = newBox.height / scale;
      
      const updatedBoxes = [...cropBoxes];
      
      if (selectedIndex === cropBoxes.length) {
        updatedBoxes.push(newBox);
      } else {
        updatedBoxes[selectedIndex] = newBox;
      }
      
      setCropBoxes(updatedBoxes);
    } else if (isDragging && selectedIndex >= 0) {
      // Move existing box
      const dx = (x - startPoint.x) / scale;
      const dy = (y - startPoint.y) / scale;
      
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) { // Avoid tiny movements
        const updatedBoxes = cropBoxes.map((box, i) => {
          if (i === selectedIndex) {
            return {
              ...box,
              x: box.x + dx,
              y: box.y + dy
            };
          }
          return box;
        });
        
        setCropBoxes(updatedBoxes);
        setStartPoint({ x, y });
      }
    }
  };
  
  // Handle mouse/touch up event
  const handlePointerUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
    lastTouchDistance.current = null;
  };
  
  // Handle zoom events
  const handleZoom = (factor: number) => {
    const newScale = Math.max(0.1, Math.min(5, scale * factor));
    setScale(newScale);
    redrawCanvas();
  };
  
  // Add new crop box
  const addCropBox = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Calculate center position for new box
    const centerX = (canvas.width / 2 - offset.x) / scale;
    const centerY = (canvas.height / 2 - offset.y) / scale;
    
    // Create box with reasonable size (1/4 of image size)
    const boxWidth = img.naturalWidth / 4;
    const boxHeight = img.naturalHeight / 4;
    
    const newBox: EnhancedCropBoxProps = {
      id: cropBoxes.length + 1,
      x: centerX - boxWidth / 2,
      y: centerY - boxHeight / 2,
      width: boxWidth,
      height: boxHeight,
      rotation: 0,
      color: '#00AAFF',
      confidence: 1.0,
      memorabiliaType: 'unknown'
    };
    
    const updatedBoxes = [...cropBoxes, newBox];
    setCropBoxes(updatedBoxes);
    setSelectedIndex(updatedBoxes.length - 1);
  };
  
  // Remove selected crop box
  const removeSelectedCropBox = () => {
    if (selectedIndex >= 0) {
      const updatedBoxes = cropBoxes.filter((_, index) => index !== selectedIndex);
      setCropBoxes(updatedBoxes);
      setSelectedIndex(Math.min(selectedIndex, updatedBoxes.length - 1));
    }
  };
  
  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleZoom,
    addCropBox,
    removeSelectedCropBox,
    redrawCanvas,
    scale,
    setScale,
    offset,
    setOffset
  };
};
