
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
  
  if (!isDragging && !isResizing && !isRotating && selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
    let cursorStyle = 'default';
    
    const selectedBox = cropBoxes[selectedCropIndex];
    if (selectedBox && isRotationHandle(x, y, selectedBox)) {
      cursorStyle = 'grab';
    }
    
    cropBoxes.forEach((box) => {
      const resizeHandle = getResizeHandle(e, box);
      if (resizeHandle) {
        switch (resizeHandle) {
          case 'tl':
          case 'br':
            cursorStyle = 'nwse-resize';
            break;
          case 'tr':
          case 'bl':
            cursorStyle = 'nesw-resize';
            break;
        }
      } else if (isPointInRotatedRect(x, y, box)) {
        cursorStyle = 'move';
      }
    });
    
    canvas.style.cursor = cursorStyle;
  }
};
