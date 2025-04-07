
import { useEffect } from 'react';
import { Canvas, Rect } from 'fabric'; // Updated import
import { EnhancedCropBoxProps } from '../../CropBox';

// Type for fabric.js degree
type TDegree = number;

interface UseCropRectanglesProps {
  canvas: Canvas | null;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  batchMode?: boolean;
  batchSelections?: number[];
  onToggleBatchSelection?: (index: number) => void;
}

export const useCropRectangles = ({
  canvas,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  batchMode = false,
  batchSelections = [],
  onToggleBatchSelection
}: UseCropRectanglesProps) => {
  
  // Update or create crop rectangles when cropBoxes change
  useEffect(() => {
    if (!canvas) return;
    
    // Clear existing objects
    canvas.clear();
    
    // Create rectangles for each crop box
    cropBoxes.forEach((box, index) => {
      const rect = new Rect({
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        angle: box.rotation || 0,
        fill: 'transparent',
        stroke: index === selectedCropIndex ? '#FF0000' : box.color || '#00FF00',
        strokeWidth: index === selectedCropIndex ? 3 : 2,
        strokeDashArray: batchSelections?.includes(index) ? [5, 5] : undefined,
        objectCaching: false,
        transparentCorners: false,
        cornerColor: '#FF0000',
        cornerStrokeColor: '#FFFFFF',
        borderColor: '#FF0000',
        cornerSize: 12,
        padding: 10,
        cornerStyle: 'circle',
        hasRotatingPoint: true,
        data: { boxIndex: index }
      });
      
      // Add label if it has a memorabilia type
      if (box.memorabiliaType && box.memorabiliaType !== 'unknown') {
        const label = new window.fabric.Text(box.memorabiliaType.charAt(0).toUpperCase() + box.memorabiliaType.slice(1), {
          left: box.x + 10,
          top: box.y + 10,
          fontSize: 14,
          fill: box.color || '#00FF00',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 5,
          data: { boxIndex: index, isLabel: true }
        });
        canvas.add(label);
      }
      
      // Add selection checkbox for batch mode
      if (batchMode) {
        const checkboxSize = 20;
        const isSelected = batchSelections?.includes(index);
        
        const checkbox = new Rect({
          left: box.x + box.width - checkboxSize - 10,
          top: box.y + 10,
          width: checkboxSize,
          height: checkboxSize,
          fill: isSelected ? box.color || '#00FF00' : 'rgba(255,255,255,0.8)',
          stroke: box.color || '#00FF00',
          strokeWidth: 2,
          rx: 5,
          ry: 5,
          data: { boxIndex: index, isCheckbox: true }
        });
        
        if (isSelected) {
          const check = new window.fabric.Text('✓', {
            left: box.x + box.width - checkboxSize - 5,
            top: box.y + 10,
            fontSize: 16,
            fill: '#FFFFFF',
            data: { boxIndex: index, isCheckmark: true }
          });
          canvas.add(check);
        }
        
        canvas.add(checkbox);
      }
      
      // Event handlers for the rectangle
      rect.on('moving', function(e) {
        const target = e.target;
        const index = target.data?.boxIndex;
        if (index !== undefined) {
          setCropBoxes(prev => {
            const newBoxes = [...prev];
            newBoxes[index] = {
              ...newBoxes[index],
              x: target.left || 0,
              y: target.top || 0
            };
            return newBoxes;
          });
        }
      });
      
      rect.on('scaling', function(e) {
        const target = e.target;
        const index = target.data?.boxIndex;
        if (index !== undefined) {
          setCropBoxes(prev => {
            const newBoxes = [...prev];
            newBoxes[index] = {
              ...newBoxes[index],
              width: (target.width || 1) * (target.scaleX || 1),
              height: (target.height || 1) * (target.scaleY || 1)
            };
            return newBoxes;
          });
        }
      });
      
      rect.on('rotating', function(e) {
        const target = e.target;
        const index = target.data?.boxIndex;
        if (index !== undefined) {
          setCropBoxes(prev => {
            const newBoxes = [...prev];
            newBoxes[index] = {
              ...newBoxes[index],
              rotation: target.angle as TDegree
            };
            return newBoxes;
          });
        }
      });
      
      rect.on('selected', function(e) {
        const target = e.target;
        const index = target.data?.boxIndex;
        if (index !== undefined) {
          setSelectedCropIndex(index);
        }
      });
      
      canvas.add(rect);
    });
    
    // Handle mouse down on canvas to detect clicks on checkboxes
    canvas.on('mouse:down', function(opt) {
      if (opt.target && opt.target.data) {
        const { boxIndex, isCheckbox, isLabel } = opt.target.data;
        
        if (isCheckbox && boxIndex !== undefined && onToggleBatchSelection) {
          onToggleBatchSelection(boxIndex);
        } else if (!isLabel && boxIndex !== undefined) {
          setSelectedCropIndex(boxIndex);
        }
      }
    });
    
    canvas.renderAll();
  }, [canvas, cropBoxes, selectedCropIndex, batchMode, batchSelections]);
  
  return {};
};
