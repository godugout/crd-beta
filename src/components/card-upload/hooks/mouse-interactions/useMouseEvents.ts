
import { useState } from 'react';
import { CropBoxProps } from '../../CropBox';
import { getResizeHandle, isPointInRotatedRect } from '../../CropBox';

interface MousePosition {
  x: number;
  y: number;
}

export const useMouseEvents = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number,
  setSelectedCropIndex: (index: number) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<MousePosition>({ x: 0, y: 0 });
  const [startBox, setStartBox] = useState<CropBoxProps | null>(null);

  // Mouse down handler - start dragging or resizing
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicked on a resize handle of the selected crop box
    if (selectedCropIndex >= 0) {
      const handle = getResizeHandle(x, y, cropBoxes[selectedCropIndex]);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setStartPos({ x, y });
        setStartBox({ ...cropBoxes[selectedCropIndex] });
        return;
      }
    }
    
    // Check if clicked inside any crop box
    let clickedBoxIndex = -1;
    for (let i = cropBoxes.length - 1; i >= 0; i--) {
      const box = cropBoxes[i];
      if (isPointInRotatedRect(
        x, y, 
        box.x, box.y, 
        box.width, box.height,
        box.rotation || 0
      )) {
        clickedBoxIndex = i;
        break;
      }
    }
    
    if (clickedBoxIndex >= 0) {
      setSelectedCropIndex(clickedBoxIndex);
      setIsDragging(true);
      setStartPos({ x, y });
      setStartBox({ ...cropBoxes[clickedBoxIndex] });
    } else {
      setSelectedCropIndex(-1);
    }
  };

  // Mouse move handler - handle dragging or resizing
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!canvasRef.current || (!isDragging && !isResizing) || !startBox) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const deltaX = x - startPos.x;
    const deltaY = y - startPos.y;
    
    if (isResizing && resizeHandle && selectedCropIndex >= 0) {
      // Handle resizing based on the resize handle
      const newBoxes = [...cropBoxes];
      const originalBox = { ...startBox };
      const newBox = { ...newBoxes[selectedCropIndex] };
      
      // Implement resizing logic based on which handle was grabbed
      switch (resizeHandle) {
        case 'tl': // top-left
          newBox.x = originalBox.x + deltaX;
          newBox.y = originalBox.y + deltaY;
          newBox.width = originalBox.width - deltaX;
          newBox.height = originalBox.height - deltaY;
          break;
        case 'tr': // top-right
          newBox.y = originalBox.y + deltaY;
          newBox.width = originalBox.width + deltaX;
          newBox.height = originalBox.height - deltaY;
          break;
        case 'bl': // bottom-left
          newBox.x = originalBox.x + deltaX;
          newBox.width = originalBox.width - deltaX;
          newBox.height = originalBox.height + deltaY;
          break;
        case 'br': // bottom-right
          newBox.width = originalBox.width + deltaX;
          newBox.height = originalBox.height + deltaY;
          break;
        case 't': // top
          newBox.y = originalBox.y + deltaY;
          newBox.height = originalBox.height - deltaY;
          break;
        case 'b': // bottom
          newBox.height = originalBox.height + deltaY;
          break;
        case 'l': // left
          newBox.x = originalBox.x + deltaX;
          newBox.width = originalBox.width - deltaX;
          break;
        case 'r': // right
          newBox.width = originalBox.width + deltaX;
          break;
      }
      
      // Ensure width and height are not negative
      if (newBox.width < 10) newBox.width = 10;
      if (newBox.height < 10) newBox.height = 10;
      
      newBoxes[selectedCropIndex] = newBox;
      setCropBoxes(newBoxes);
      
    } else if (isDragging && selectedCropIndex >= 0) {
      // Handle dragging
      const newBoxes = [...cropBoxes];
      const newBox = { ...newBoxes[selectedCropIndex] };
      
      newBox.x = startBox.x + deltaX;
      newBox.y = startBox.y + deltaY;
      
      newBoxes[selectedCropIndex] = newBox;
      setCropBoxes(newBoxes);
    }
  };

  // Mouse up handler - stop dragging or resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setStartBox(null);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
    isResizing
  };
};
