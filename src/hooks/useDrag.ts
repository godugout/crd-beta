
import { useState, useEffect, useCallback } from 'react';

interface UseDragOptions {
  onDragStart?: (e: MouseEvent | TouchEvent, id?: string) => void;
  onDrag?: (e: MouseEvent | TouchEvent, id?: string, deltaX?: number, deltaY?: number) => void;
  onDragEnd?: (e: MouseEvent | TouchEvent, id?: string) => void;
}

export const useDrag = (options: UseDragOptions = {}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentElement, setCurrentElement] = useState<string | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);

  // Handle mouse down event to start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, id?: string) => {
    // Only handle left mouse button
    if (e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setCurrentElement(id || null);
    setStartPosition({ x: e.clientX, y: e.clientY });
    
    if (options.onDragStart) {
      options.onDragStart(e.nativeEvent, id);
    }
  }, [options]);
  
  // Handle touch start event for mobile drag support
  const handleTouchStart = useCallback((e: React.TouchEvent, id?: string) => {
    e.stopPropagation();
    
    const touch = e.touches[0];
    setIsDragging(true);
    setCurrentElement(id || null);
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    
    if (options.onDragStart) {
      options.onDragStart(e.nativeEvent, id);
    }
  }, [options]);
  
  // Track mouse movement during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !startPosition) return;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    if (options.onDrag) {
      options.onDrag(e, currentElement || undefined, deltaX, deltaY);
    }
  }, [isDragging, currentElement, startPosition, options]);
  
  // Track touch movement during drag
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !startPosition) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosition.x;
    const deltaY = touch.clientY - startPosition.y;
    
    if (options.onDrag) {
      options.onDrag(e, currentElement || undefined, deltaX, deltaY);
    }
  }, [isDragging, currentElement, startPosition, options]);
  
  // End dragging on mouse up
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    if (options.onDragEnd) {
      options.onDragEnd(e, currentElement || undefined);
    }
    
    setIsDragging(false);
    setCurrentElement(null);
    setStartPosition(null);
  }, [isDragging, currentElement, options]);
  
  // End dragging on touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    if (options.onDragEnd) {
      options.onDragEnd(e, currentElement || undefined);
    }
    
    setIsDragging(false);
    setCurrentElement(null);
    setStartPosition(null);
  }, [isDragging, currentElement, options]);
  
  // Set up event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    isDragging,
    currentElement,
    handleMouseDown,
    handleTouchStart
  };
};
