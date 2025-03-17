
import { CropBoxProps } from '../../CropBox';

export const createNewCropBox = (
  x: number, 
  y: number, 
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  setSelectedCropIndex: (index: number) => void,
  setIsDragging: (isDragging: boolean) => void,
  editorImgRef: React.RefObject<HTMLImageElement>
) => {
  if (editorImgRef.current) {
    const newWidth = 150;
    const newHeight = newWidth * (3.5 / 2.5);
    
    const newBox: CropBoxProps = {
      x: x - newWidth / 2,
      y: y - newHeight / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0
    };
    
    const newBoxes = [...cropBoxes, newBox];
    setCropBoxes(newBoxes);
    setSelectedCropIndex(newBoxes.length - 1);
    setIsDragging(true);
    return { x, y };
  }
  return { x, y };
};

export const updateCursorStyle = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBoxes: CropBoxProps[],
  selectedCropIndex: number,
  isDragging: boolean,
  isResizing: string | null,
  isRotating: boolean,
  isRotationHandle: (x: number, y: number, box: CropBoxProps) => boolean,
  getResizeHandle: (e: React.MouseEvent<HTMLCanvasElement>, box: CropBoxProps, handleSize?: number) => string | null,
  isPointInRotatedRect: (x: number, y: number, box: CropBoxProps) => boolean
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (isDragging) {
    canvas.style.cursor = 'grabbing';
    return;
  }
  
  if (isResizing) {
    // Use appropriate resize cursors based on which handle is being used
    switch (isResizing) {
      case 'tl': case 'br':
        canvas.style.cursor = 'nwse-resize';
        break;
      case 'tr': case 'bl':
        canvas.style.cursor = 'nesw-resize';
        break;
    }
    return;
  }
  
  if (isRotating) {
    canvas.style.cursor = 'grabbing';
    return;
  }
  
  // Not actively dragging/resizing - just update cursor based on position
  let cursorStyle = 'default';
  
  if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
    const selectedBox = cropBoxes[selectedCropIndex];
    
    if (isRotationHandle(x, y, selectedBox)) {
      cursorStyle = 'grab';
    } else {
      // Check resize handles first (higher priority than move)
      const resizeHandle = getResizeHandle(e, selectedBox);
      if (resizeHandle) {
        switch (resizeHandle) {
          case 'tl': case 'br':
            cursorStyle = 'nwse-resize';
            break;
          case 'tr': case 'bl':
            cursorStyle = 'nesw-resize';
            break;
        }
      } else if (isPointInRotatedRect(x, y, selectedBox)) {
        cursorStyle = 'move';
      }
    }
  } else {
    // If no selection, check if hovering over any box
    for (const box of cropBoxes) {
      if (isPointInRotatedRect(x, y, box)) {
        cursorStyle = 'move';
        break;
      }
    }
  }
  
  canvas.style.cursor = cursorStyle;
};
