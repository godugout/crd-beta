
import { useEffect, useState } from 'react';
import { Canvas, Image as FabricImage } from 'fabric';
import { toast } from 'sonner';
import { ImageData } from '../useCropState';

interface UseBackgroundImageProps {
  canvas: Canvas | null;
  editorImgRef: React.RefObject<HTMLImageElement>;
  imageData: ImageData;
  addNewCropBox: () => void;
  cropBoxesLength: number;
}

export const useBackgroundImage = ({
  canvas, 
  editorImgRef,
  imageData,
  addNewCropBox,
  cropBoxesLength
}: UseBackgroundImageProps) => {
  const [backgroundImage, setBackgroundImage] = useState<FabricImage | null>(null);

  // Load and handle background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (!canvas || !editorImgRef.current || !editorImgRef.current.src) return;
      
      try {
        // First, remove existing background image
        if (backgroundImage) {
          canvas.remove(backgroundImage);
        }
        
        // Create new Fabric image
        // In Fabric.js v6, the second parameter should be an object containing various options
        // The correct property for the callback in v6 is 'onLoad', not 'callback'
        FabricImage.fromURL(editorImgRef.current.src, {
          onLoad: (fabricImage) => {
            if (!canvas) return;
            
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
            const imgWidth = fabricImage.width || 0;
            const imgHeight = fabricImage.height || 0;
            
            const scale = Math.min(
              canvasWidth / imgWidth,
              canvasHeight / imgHeight
            );
            
            fabricImage.scale(scale);
            
            // Add to canvas and set as background
            canvas.add(fabricImage);
            
            // Move to back
            fabricImage.moveToBack();
            
            setBackgroundImage(fabricImage);
            
            // Create initial crop box if none exists
            if (cropBoxesLength === 0) {
              addNewCropBox();
            }
            
            canvas.renderAll();
          }
        });
        
      } catch (error) {
        console.error('Failed to load image:', error);
        toast.error('Failed to load image');
      }
    };
    
    loadBackgroundImage();
  }, [canvas, editorImgRef.current?.src, imageData.rotation, backgroundImage, addNewCropBox, cropBoxesLength]);

  return backgroundImage;
};
