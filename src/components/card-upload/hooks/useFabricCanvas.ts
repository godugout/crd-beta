
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { EnhancedCropBoxProps } from '../CropBox';
import { MemorabiliaType } from '../cardDetection';
import { ImageData } from './useCropState';
import { useEventHandlers } from './fabric/useEventHandlers';
import { useBackgroundImage } from './fabric/useBackgroundImage';
import { useCropRectangles } from './fabric/useCropRectangles';
import { useCreateCropBox } from './fabric/useCreateCropBox';

interface UseFabricCanvasProps {
  fabricRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
  batchMode?: boolean;
  batchSelections?: number[];
  onToggleBatchSelection?: (index: number) => void;
  onMemorabiliaTypeChange?: (index: number, type: MemorabiliaType) => void;
}

export const useFabricCanvas = ({
  fabricRef,
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef,
  batchMode = false,
  batchSelections = [],
  onToggleBatchSelection,
  onMemorabiliaTypeChange
}: UseFabricCanvasProps) => {
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  
  // Initialize the Fabric canvas
  useEffect(() => {
    if (!fabricRef.current) return;
    
    // Create canvas instance
    const canvas = new fabric.Canvas(fabricRef.current, {
      width: fabricRef.current.parentElement?.clientWidth || 800,
      height: fabricRef.current.parentElement?.clientHeight || 600,
      selection: false, // Disable group selection
    });
    
    canvasInstance.current = canvas;
    
    // Cleanup function
    return () => {
      canvas.dispose();
      canvasInstance.current = null;
    };
  }, [fabricRef]);
  
  // Set up event handlers
  const { initializeEvents } = useEventHandlers({
    canvas: canvasInstance.current,
    setCropBoxes,
    setSelectedCropIndex
  });
  
  // Initialize event handlers
  useEffect(() => {
    if (!canvasInstance.current) return;
    
    const cleanup = initializeEvents();
    
    return cleanup;
  }, [canvasInstance.current, initializeEvents]);
  
  // Handle background image
  const { backgroundImageRef } = useBackgroundImage({
    canvas: canvasInstance.current,
    editorImgRef,
    imageData,
    setCropBoxes,
    cropBoxes,
    setSelectedCropIndex
  });
  
  // Handle crop rectangles
  const { removeCropBox, updateCropBoxType } = useCropRectangles({
    canvas: canvasInstance.current,
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    batchMode,
    batchSelections,
    onToggleBatchSelection,
    onMemorabiliaTypeChange
  });
  
  // Handle creating new crop boxes
  const { addNewCropBox } = useCreateCropBox({
    canvas: canvasInstance.current,
    setCropBoxes,
    setSelectedCropIndex,
    cropBoxes
  });
  
  return { 
    addNewCropBox, 
    removeCropBox, 
    updateCropBoxType,
    canvasInstance: canvasInstance.current 
  };
};
