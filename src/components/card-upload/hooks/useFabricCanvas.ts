
import { useEffect, useRef } from 'react';
import { Canvas, Rect, Image as FabricImage } from 'fabric';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';
import { ImageData } from './useCropState';

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
  const canvasInstance = useRef<Canvas | null>(null);
  const backgroundImage = useRef<FabricImage | null>(null);
  const cropRects = useRef<Rect[]>([]);
  
  // Initialize the Fabric canvas
  useEffect(() => {
    if (!fabricRef.current) return;
    
    // Create canvas instance
    const canvas = new Canvas(fabricRef.current, {
      width: fabricRef.current.parentElement?.clientWidth || 800,
      height: fabricRef.current.parentElement?.clientHeight || 600,
      selection: false, // Disable group selection
    });
    
    canvasInstance.current = canvas;
    
    // Set up canvas event handlers
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('selection:cleared', () => setSelectedCropIndex(-1));
    
    // Cleanup function
    return () => {
      canvas.off('object:modified');
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
      canvas.dispose();
      canvasInstance.current = null;
      backgroundImage.current = null;
    };
  }, [fabricRef]);
  
  // Handle selection of crop rectangles
  const handleSelectionCreated = (e: any) => {
    const selectedObject = e.selected?.[0];
    if (selectedObject && selectedObject.data?.cropBoxIndex !== undefined) {
      setSelectedCropIndex(selectedObject.data.cropBoxIndex);
    }
  };
  
  // Handle modification of crop rectangles
  const handleObjectModified = (e: any) => {
    if (!e.target || e.target.data?.cropBoxIndex === undefined) return;
    
    const index = e.target.data.cropBoxIndex;
    const rect = e.target;
    
    setCropBoxes(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          x: rect.left || 0,
          y: rect.top || 0,
          width: rect.width * (rect.scaleX || 1),
          height: rect.height * (rect.scaleY || 1),
          rotation: rect.angle || 0
        };
      }
      return updated;
    });
    
    // Reset scale after applying the new dimensions
    if (rect.scaleX !== 1 || rect.scaleY !== 1) {
      rect.set({
        width: rect.width * (rect.scaleX || 1),
        height: rect.height * (rect.scaleY || 1),
        scaleX: 1,
        scaleY: 1
      });
    }
  };
  
  // Load background image when image data changes
  useEffect(() => {
    if (!canvasInstance.current || !editorImgRef.current || !imageData.url) return;
    
    const canvas = canvasInstance.current;
    const img = editorImgRef.current;
    
    // Wait for image to load
    if (!img.complete) {
      img.onload = loadBackgroundImage;
    } else {
      loadBackgroundImage();
    }
    
    function loadBackgroundImage() {
      if (!canvas || !img) return;
      
      // Create Fabric image object from the HTML img
      FabricImage.fromURL(img.src, (fImg) => {
        // Remove existing background if any
        if (backgroundImage.current) {
          canvas.remove(backgroundImage.current);
        }
        
        // Set image as background
        canvas.setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
        
        fImg.set({
          selectable: false,
          evented: false,
          left: 0,
          top: 0
        });
        
        canvas.setBackgroundImage(fImg, canvas.renderAll.bind(canvas));
        backgroundImage.current = fImg;
        
        // Create crop boxes if none exist yet
        if (cropBoxes.length === 0) {
          const defaultBox: EnhancedCropBoxProps = {
            id: 1,
            x: img.naturalWidth * 0.15,
            y: img.naturalHeight * 0.15,
            width: img.naturalWidth * 0.7,
            height: img.naturalHeight * 0.7,
            memorabiliaType: 'card',
            color: '#00FF00'
          };
          
          setCropBoxes([defaultBox]);
          setSelectedCropIndex(0);
        }
        
        // Render the crop boxes
        renderCropBoxes();
      });
    }
  }, [imageData.url, editorImgRef, canvasInstance.current]);
  
  // Render crop boxes when they change
  useEffect(() => {
    renderCropBoxes();
  }, [cropBoxes, selectedCropIndex, batchSelections]);
  
  // Render the crop rectangles on the canvas
  const renderCropBoxes = () => {
    if (!canvasInstance.current) return;
    
    const canvas = canvasInstance.current;
    
    // Remove existing rectangles
    cropRects.current.forEach(rect => canvas.remove(rect));
    cropRects.current = [];
    
    // Create new rectangles for each crop box
    cropBoxes.forEach((box, index) => {
      const isSelected = index === selectedCropIndex;
      const isInBatch = batchSelections?.includes(index);
      
      const rect = new Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        angle: box.rotation || 0,
        fill: 'transparent',
        stroke: isInBatch ? '#4CAF50' : (isSelected ? '#FFCC00' : box.color || '#FF0000'),
        strokeWidth: isSelected ? 3 : 2,
        strokeDashArray: isSelected ? undefined : [5, 5],
        cornerColor: '#FFCC00',
        cornerSize: 12,
        cornerStyle: 'circle',
        transparentCorners: false,
        hasControls: isSelected,
        hasBorders: true,
        selectable: true,
        lockRotation: false,
        lockScalingFlip: true,
        padding: 5,
        cornerStrokeColor: '#FFCC00',
        borderScaleFactor: 1.3,
        borderOpacityWhenMoving: 0.8,
        borderColor: isSelected ? '#FFCC00' : (box.color || '#FF0000'),
      });
      
      // Store reference to the crop box index
      rect.data = { cropBoxIndex: index, memorabiliaType: box.memorabiliaType };
      
      canvas.add(rect);
      cropRects.current.push(rect);
      
      if (isSelected) {
        canvas.setActiveObject(rect);
      }
    });
    
    canvas.renderAll();
  };
  
  // Add a new crop box
  const addNewCropBox = () => {
    if (!canvasInstance.current || !backgroundImage.current) return;
    
    const canvas = canvasInstance.current;
    const bgImage = backgroundImage.current;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const newBox: EnhancedCropBoxProps = {
      id: Date.now(),
      x: canvasWidth * 0.25,
      y: canvasHeight * 0.25,
      width: canvasWidth * 0.5,
      height: canvasHeight * 0.5,
      rotation: 0,
      memorabiliaType: 'card',
      color: '#FF5722'
    };
    
    setCropBoxes(prev => [...prev, newBox]);
    setSelectedCropIndex(cropBoxes.length);
  };
  
  // Remove selected crop box
  const removeCropBox = () => {
    if (selectedCropIndex < 0 || selectedCropIndex >= cropBoxes.length) return;
    
    setCropBoxes(prev => prev.filter((_, i) => i !== selectedCropIndex));
    setSelectedCropIndex(-1);
  };
  
  // Update crop box type
  const updateCropBoxType = (index: number, type: MemorabiliaType) => {
    if (index < 0 || index >= cropBoxes.length) return;
    
    setCropBoxes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], memorabiliaType: type };
      return updated;
    });
    
    if (onMemorabiliaTypeChange) {
      onMemorabiliaTypeChange(index, type);
    }
  };
  
  return { 
    addNewCropBox, 
    removeCropBox, 
    updateCropBoxType,
    canvasInstance: canvasInstance.current 
  };
};
