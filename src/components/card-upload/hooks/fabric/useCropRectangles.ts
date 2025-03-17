
import { useEffect, useState } from 'react';
import { Canvas, Rect } from 'fabric';
import { CropBoxProps } from '../../CropBox';

interface UseCropRectanglesProps {
  canvas: Canvas | null;
  cropBoxes: CropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
}

export const useCropRectangles = ({
  canvas,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex
}: UseCropRectanglesProps) => {
  const [cropRects, setCropRects] = useState<Rect[]>([]);

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
    
  }, [canvas, cropBoxes, selectedCropIndex, setCropBoxes, setSelectedCropIndex]);

  return cropRects;
};
