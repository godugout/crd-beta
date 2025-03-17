
import { useEffect } from 'react';
import { CropBoxProps, drawCropBox } from '../CropBox';
import { ImageData } from './useCropState';

export const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cropBoxes: CropBoxProps[],
  editorImgRef: React.RefObject<HTMLImageElement>,
  imageData: ImageData,
  selectedCropIndex: number
) => {
  useEffect(() => {
    if (canvasRef.current && editorImgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        const img = editorImgRef.current;
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const scale = Math.min(
          canvasWidth / img.naturalWidth,
          canvasHeight / img.naturalHeight
        );
        
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.save();
        
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(imageData.rotation * Math.PI / 180);
        
        ctx.drawImage(
          img, 
          -scaledWidth / 2, 
          -scaledHeight / 2, 
          scaledWidth, 
          scaledHeight
        );
        
        ctx.restore();
        
        cropBoxes.forEach((box, index) => {
          drawCropBox(ctx, box, index === selectedCropIndex);
        });
      }
    }
  }, [canvasRef, cropBoxes, editorImgRef, imageData.rotation, selectedCropIndex]);
};
