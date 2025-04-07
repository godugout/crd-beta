
import { useCallback } from 'react';
import { CropBoxProps, getResizeHandle, isPointInRotatedRect } from '../../CropBox';

interface MouseEventProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[];
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  startPos: { x: number, y: number } | null;
  setStartPos: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
  currentPos: { x: number, y: number } | null;
  setCurrentPos: React.Dispatch<React.SetStateAction<{ x: number, y: number } | null>>;
  dragMode: string;
  setDragMode: React.Dispatch<React.SetStateAction<string>>;
  resizeHandle: string | null;
  setResizeHandle: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create crop box function (replacement for imported one)
const createNewCropBox = (
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  cropBoxesLength: number
): CropBoxProps => {
  return {
    id: cropBoxesLength + 1,
    x,
    y,
    width,
    height,
    color: '#FF0000',
    rotation: 0,
    memorabiliaType: 'unknown',
    confidence: 0.5
  };
};

// Update cursor style function (replacement for imported one)
const updateCursorStyle = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  resizeHandle: string | null,
  dragMode: string
) => {
  if (!canvasRef.current) return;
  
  if (dragMode === 'move') {
    canvasRef.current.style.cursor = 'move';
  } else if (resizeHandle) {
    switch (resizeHandle) {
      case 'n':
      case 's':
        canvasRef.current.style.cursor = 'ns-resize';
        break;
      case 'e':
      case 'w':
        canvasRef.current.style.cursor = 'ew-resize';
        break;
      case 'ne':
      case 'sw':
        canvasRef.current.style.cursor = 'nesw-resize';
        break;
      case 'nw':
      case 'se':
        canvasRef.current.style.cursor = 'nwse-resize';
        break;
      default:
        canvasRef.current.style.cursor = 'default';
    }
  } else {
    canvasRef.current.style.cursor = 'default';
  }
};

export const useMouseEvents = ({
  canvasRef,
  cropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  setCropBoxes,
  isDrawing,
  setIsDrawing,
  startPos,
  setStartPos,
  currentPos,
  setCurrentPos,
  dragMode,
  setDragMode,
  resizeHandle,
  setResizeHandle
}: MouseEventProps) => {
  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    
    // Check if clicking on an existing crop box
    let found = false;
    cropBoxes.forEach((box, index) => {
      if (isPointInRotatedRect(x, y, box)) {
        setSelectedCropIndex(index);
        
        // Check if we're on a resize handle
        const handle = getResizeHandle(e, box);
        if (handle) {
          setDragMode('resize');
          setResizeHandle(handle);
        } else {
          setDragMode('move');
        }
        
        found = true;
      }
    });
    
    if (!found) {
      setSelectedCropIndex(-1);
      setIsDrawing(true);
      setDragMode('draw');
    }
  }, [canvasRef, cropBoxes, setSelectedCropIndex, setStartPos, setCurrentPos, setIsDrawing, setDragMode, setResizeHandle]);
  
  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPos({ x, y });
    
    // Update cursor style based on position
    if (!startPos) {
      const hoveredBoxIndex = cropBoxes.findIndex(box => isPointInRotatedRect(x, y, box));
      
      if (hoveredBoxIndex !== -1) {
        const hoverResizeHandle = getResizeHandle(e, cropBoxes[hoveredBoxIndex]);
        if (hoverResizeHandle) {
          updateCursorStyle(canvasRef, hoverResizeHandle, '');
        } else {
          canvasRef.current.style.cursor = 'move';
        }
      } else {
        canvasRef.current.style.cursor = 'default';
      }
    }
    
  }, [canvasRef, startPos, cropBoxes, setCurrentPos]);
  
  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!startPos || !currentPos || !canvasRef.current) {
      setIsDrawing(false);
      setDragMode('');
      setStartPos(null);
      setCurrentPos(null);
      setResizeHandle(null);
      return;
    }
    
    if (isDrawing) {
      // Calculate the width and height
      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);
      
      // Only create a box if it has meaningful dimensions
      if (width > 10 && height > 10) {
        // Determine top-left corner
        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        
        // Create and add the new crop box
        const newBox = createNewCropBox(x, y, width, height, cropBoxes.length);
        setCropBoxes(prev => [...prev, newBox]);
        setSelectedCropIndex(cropBoxes.length);
      }
    }
    
    // Reset state
    setIsDrawing(false);
    setDragMode('');
    setStartPos(null);
    setCurrentPos(null);
    setResizeHandle(null);
    
  }, [startPos, currentPos, canvasRef, isDrawing, cropBoxes, setCropBoxes, setSelectedCropIndex, setIsDrawing, setDragMode, setStartPos, setCurrentPos, setResizeHandle]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
