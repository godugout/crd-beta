
import { useEffect, useState, useRef } from 'react';
import { Canvas, Image as FabricImage } from 'fabric';
import { toast } from 'sonner';
import { ImageData } from '../useCropState';
import { EnhancedCropBoxProps } from '../../cardDetection';

interface UseBackgroundImageProps {
  canvas: Canvas | null;
  editorImgRef: React.RefObject<HTMLImageElement>;
  imageData: ImageData;
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  cropBoxes: EnhancedCropBoxProps[];
  setSelectedCropIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useBackgroundImage = ({
  canvas, 
  editorImgRef,
  imageData,
  setCropBoxes,
  cropBoxes,
  setSelectedCropIndex
}: UseBackgroundImageProps) => {
  const [backgroundImage, setBackgroundImage] = useState<FabricImage | null>(null);
  const backgroundImageRef = useRef<FabricImage | null>(null);

  // Load and handle background image
  useEffect(() => {
    if (!canvas || !editorImgRef.current || !imageData?.url) return;
    
    const img = editorImgRef.current;
    
    // Wait for image to load
    if (!img.complete) {
      img.onload = loadBackgroundImage;
    } else {
      loadBackgroundImage();
    }
    
    function loadBackgroundImage() {
      if (!canvas || !img) return;
      
      try {
        // Create Fabric image object from the HTML img
        // In Fabric.js v6, fromURL returns a Promise
        FabricImage.fromURL(img.src)
          .then((fImg) => {
            // Remove existing background if any
            if (backgroundImageRef.current) {
              canvas.remove(backgroundImageRef.current);
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
            
            // In Fabric.js v6, we need to add the image and make sure it's in the background
            canvas.add(fImg);
            
            // Move image to back in Fabric.js v6
            canvas._objects?.splice(canvas._objects.indexOf(fImg), 1);
            canvas._objects?.unshift(fImg);
            canvas.requestRenderAll();
            
            backgroundImageRef.current = fImg;
            setBackgroundImage(fImg);
            
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
            
            canvas.renderAll();
          });
      } catch (error) {
        console.error('Failed to load image:', error);
        toast.error('Failed to load image');
      }
    }
    
    // Cleanup function
    return () => {
      if (img) {
        img.onload = null;
      }
    };
  }, [canvas, editorImgRef, imageData?.url, setCropBoxes, cropBoxes.length, setSelectedCropIndex]);

  return {
    backgroundImage,
    backgroundImageRef
  };
};
