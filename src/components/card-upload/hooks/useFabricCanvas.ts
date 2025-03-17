
import { useEffect, useState } from 'react';
import { Canvas, Rect, Image, loadSVGFromURL, loadImage } from 'fabric';
import { toast } from 'sonner';
import { CropBoxProps } from '../CropBox';
import { ImageData } from './useCropState';

interface UseFabricCanvasProps {
  fabricRef: React.RefObject<HTMLCanvasElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  editorImgRef: React.RefObject<HTMLImageElement>;
}

// Default trading card ratio (2.5:3.5)
const CARD_RATIO = 2.5 / 3.5;

export const useFabricCanvas = ({
  fabricRef,
  canvasRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  editorImgRef
}: UseFabricCanvasProps) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<Image | null>(null);
  const [cropRects, setCropRects] = useState<Rect[]>([]);
  
  // Initialize the Fabric canvas
  useEffect(() => {
    if (!fabricRef.current) return;
    
    const canvasWidth = 600;
    const canvasHeight = 600;
    
    const fabricCanvas = new Canvas(fabricRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      selection: false,
      preserveObjectStacking: true,
      backgroundColor: '#f1f5f9',
    });
    
    setCanvas(fabricCanvas);
    
    // Provide a reference to the original canvas ref
    if (canvasRef?.current) {
      canvasRef.current = fabricRef.current;
    }
    
    // Clean up on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, [fabricRef, canvasRef]);
  
  // Load and handle background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (!canvas || !editorImgRef.current || !editorImgRef.current.src) return;
      
      try {
        // First, remove existing background image
        if (backgroundImage) {
          canvas.remove(backgroundImage);
        }
        
        // Load the image from the editor image reference
        const img = await loadImage(editorImgRef.current.src);
        
        // Create a fabric Image object
        const fabricImage = new Image(img);
        
        // Calculate scaling to fit the canvas
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        
        // Apply image rotation
        fabricImage.set({
          originX: 'center',
          originY: 'center',
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          angle: imageData.rotation || 0,
          selectable: false,
          evented: false,
        });
        
        // Scale to fit the canvas
        const scale = Math.min(
          canvasWidth / img.width,
          canvasHeight / img.height
        );
        
        fabricImage.scale(scale);
        
        // Add to canvas and set as background
        canvas.add(fabricImage);
        fabricImage.sendToBack();
        setBackgroundImage(fabricImage);
        
        // Create initial crop box if none exists
        if (cropBoxes.length === 0) {
          addNewCropBox();
        }
        
        canvas.renderAll();
        
      } catch (error) {
        console.error('Failed to load image:', error);
        toast.error('Failed to load image');
      }
    };
    
    loadBackgroundImage();
  }, [canvas, editorImgRef.current?.src, imageData.rotation]);
  
  // Sync crop boxes with Fabric objects
  useEffect(() => {
    if (!canvas) return;
    
    // Remove existing crop rectangles
    cropRects.forEach(rect => {
      canvas.remove(rect);
    });
    
    const newRects = cropBoxes.map((box, index) => {
      // Create rectangle for each crop box
      const rect = new Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        angle: box.rotation,
        fill: 'rgba(37, 99, 235, 0.1)',
        stroke: index === selectedCropIndex ? '#2563eb' : 'rgba(37, 99, 235, 0.5)',
        strokeWidth: index === selectedCropIndex ? 2 : 1,
        strokeUniform: true,
        cornerColor: '#2563eb',
        cornerSize: 10,
        transparentCorners: false,
        lockRotation: false,
        hasRotatingPoint: true,
        centeredRotation: true,
        lockUniScaling: true,  // Maintain aspect ratio
        noScaleCache: false,
        objectCaching: true,
      });
      
      // Handle selection
      rect.on('selected', () => {
        setSelectedCropIndex(index);
      });
      
      // Handle moving and resizing
      rect.on('modified', () => {
        const updatedCropBoxes = [...cropBoxes];
        updatedCropBoxes[index] = {
          x: rect.left || 0,
          y: rect.top || 0,
          width: rect.getScaledWidth(),
          height: rect.getScaledHeight(),
          rotation: rect.angle || 0
        };
        setCropBoxes(updatedCropBoxes);
      });
      
      // Set selectable only for this crop box if it's the selected one
      rect.set({
        selectable: true,
      });
      
      canvas.add(rect);
      return rect;
    });
    
    setCropRects(newRects);
    
    // Set the selected crop box as the active object
    if (newRects[selectedCropIndex]) {
      canvas.setActiveObject(newRects[selectedCropIndex]);
    }
    
    canvas.renderAll();
    
  }, [canvas, cropBoxes, selectedCropIndex]);
  
  // Add a new crop box
  const addNewCropBox = () => {
    if (!canvas) return;
    
    // Calculate default dimensions based on card ratio
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const newWidth = canvasWidth * 0.3;
    const newHeight = newWidth / CARD_RATIO;
    
    const newBox: CropBoxProps = {
      x: (canvasWidth - newWidth) / 2,
      y: (canvasHeight - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0
    };
    
    setCropBoxes(prev => [...prev, newBox]);
    setSelectedCropIndex(cropBoxes.length);
  };
};
