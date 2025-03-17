import { useState, useEffect } from 'react';
import { CropBoxProps } from '../../CropBox';
import { DragState } from './types';

export const useResizing = (
  cropBoxes: CropBoxProps[],
  setCropBoxes: React.Dispatch<React.SetStateAction<CropBoxProps[]>>,
  selectedCropIndex: number
) => {
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [initialBox, setInitialBox] = useState<CropBoxProps | null>(null);
  const [shift, setShift] = useState(false);
  
  // Track keyboard modifiers for enhanced resizing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShift(true);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShift(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStartResizing = (handle: string) => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      // Store the initial box state when starting to resize
      setInitialBox({...cropBoxes[selectedCropIndex]});
      setIsResizing(handle);
    }
  };

  const handleResizing = (x: number, y: number, dragStart: DragState) => {
    if (selectedCropIndex < 0 || !isResizing || !initialBox) {
      return dragStart;
    }
    
    const selectedBox = {...cropBoxes[selectedCropIndex]};
    
    // Calculate deltas from initial mouse position
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    // Fixed aspect ratio (2.5:3.5)
    const aspectRatio = 2.5 / 3.5;
    
    // New dimensions variables
    let newWidth = selectedBox.width;
    let newHeight = selectedBox.height;
    let newX = selectedBox.x;
    let newY = selectedBox.y;
    
    // Base resize increments on initial box dimensions and mouse movement
    const resizeMultiplier = shift ? 0.5 : 1; // Hold shift for more precise control
    
    switch (isResizing) {
      case 'tl': // Top-left corner
        // Determine dominant axis for aspect ratio preservation
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Width dominant
          newWidth = Math.max(100, initialBox.width - deltaX * resizeMultiplier);
          newHeight = newWidth / aspectRatio;
        } else {
          // Height dominant
          newHeight = Math.max(140, initialBox.height - deltaY * resizeMultiplier);
          newWidth = newHeight * aspectRatio;
        }
        // Adjust position to maintain the bottom-right corner fixed
        newX = initialBox.x + initialBox.width - newWidth;
        newY = initialBox.y + initialBox.height - newHeight;
        break;
        
      case 'tr': // Top-right corner
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newWidth = Math.max(100, initialBox.width + deltaX * resizeMultiplier);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.max(140, initialBox.height - deltaY * resizeMultiplier);
          newWidth = newHeight * aspectRatio;
        }
        // Keep left edge fixed, adjust Y to maintain bottom edge
        newX = initialBox.x;
        newY = initialBox.y + initialBox.height - newHeight;
        break;
        
      case 'bl': // Bottom-left corner
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newWidth = Math.max(100, initialBox.width - deltaX * resizeMultiplier);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.max(140, initialBox.height + deltaY * resizeMultiplier);
          newWidth = newHeight * aspectRatio;
        }
        // Keep top and right edges fixed
        newX = initialBox.x + initialBox.width - newWidth;
        newY = initialBox.y;
        break;
        
      case 'br': // Bottom-right corner
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newWidth = Math.max(100, initialBox.width + deltaX * resizeMultiplier);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.max(140, initialBox.height + deltaY * resizeMultiplier);
          newWidth = newHeight * aspectRatio;
        }
        // Keep top-left corner fixed
        newX = initialBox.x;
        newY = initialBox.y;
        break;
    }
    
    // Apply changes
    const newBoxes = [...cropBoxes];
    newBoxes[selectedCropIndex] = {
      ...selectedBox,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    };
    
    setCropBoxes(newBoxes);
    return { x, y }; // Return current mouse position for drag start update
  };

  const handleStopResizing = () => {
    setIsResizing(null);
    setInitialBox(null);
  };

  return {
    isResizing,
    setIsResizing: handleStartResizing,
    handleResizing,
    handleStopResizing,
    isShiftPressed: shift
  };
};
