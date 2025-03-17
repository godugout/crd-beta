
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
        // In Fabric.js v6, we need to use a promise-based approach
        FabricImage.fromURL(editorImgRef.current.src).then(fabricImage => {
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
          
          // Move to back - in Fabric.js v6, we need to send it to the back 
          // by manipulating the canvas objects array directly
          if (canvas._objects && canvas._objects.length > 0) {
            // Remove the image from its current position
            const index = canvas._objects.indexOf(fabricImage);
            if (index > -1) {
              canvas._objects.splice(index, 1);
            }
            
            // Insert it at the beginning of the array (back)
            canvas._objects.unshift(fabricImage);
          }
          
          setBackgroundImage(fabricImage);
          
          // Create initial crop box if none exists
          if (cropBoxesLength === 0) {
            addNewCropBox();
          }
          
          canvas.renderAll();
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
