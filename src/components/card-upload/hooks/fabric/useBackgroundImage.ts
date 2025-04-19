
import { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { EnhancedCropBoxProps } from '../../cardDetection';
import { ImageData } from '../useCropState';
import { createFabricImageFromUrl, logFabricInfo } from './fabricAdapter';

interface UseBackgroundImageProps {
  canvas: fabric.Canvas | null;
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
  const backgroundImageRef = useRef<fabric.Image | null>(null);
  
  // Load background image from the imageData or from the image reference
  const loadBackgroundImage = useCallback(async () => {
    if (!canvas || !editorImgRef.current) {
      console.log('Canvas or image reference not available yet');
      return;
    }
    
    const imgElement = editorImgRef.current;
    const imgUrl = imgElement.src;
    
    console.log('Loading background image from:', imgUrl);
    
    try {
      // Remove existing background image if any
      if (backgroundImageRef.current) {
        canvas.remove(backgroundImageRef.current);
      }
      
      // Create a fabric Image from the URL
      const img = await createFabricImageFromUrl(imgUrl, { crossOrigin: 'anonymous' });
      
      // Compute scale to fit the image inside the canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      
      // Scale to fit inside the canvas with padding
      const padding = 20;
      const scaleX = (canvasWidth - padding * 2) / img.width!;
      const scaleY = (canvasHeight - padding * 2) / img.height!;
      const scale = Math.min(scaleX, scaleY);
      
      // Set the image position and properties
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
        angle: imageData.rotation || 0
      });
      
      // Store the image in ref and add to canvas
      backgroundImageRef.current = img;
      canvas.add(img);
      
      // Send image to back
      img.sendToBack();
      
      // Render the canvas
      canvas.renderAll();
      
      console.log('Background image loaded successfully');
      logFabricInfo(canvas);
      
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  }, [canvas, editorImgRef, imageData]);
  
  // Load or update background image when image data or ref changes
  useEffect(() => {
    if (canvas && editorImgRef.current) {
      console.log('Loading background image due to dependencies change');
      loadBackgroundImage();
    }
  }, [canvas, editorImgRef.current, imageData, loadBackgroundImage]);
  
  return { backgroundImageRef, loadBackgroundImage };
};
