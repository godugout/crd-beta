
import { useState, useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

interface CanvasControlsOptions {
  fabricRef: React.RefObject<fabric.Canvas | null>;
  minZoom?: number;
  maxZoom?: number;
  zoomSensitivity?: number;
  panSensitivity?: number;
}

export const useCanvasControls = ({
  fabricRef,
  minZoom = 0.1,
  maxZoom = 5,
  zoomSensitivity = 0.001,
  panSensitivity = 1
}: CanvasControlsOptions) => {
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const canvas = fabricRef.current;
    if (!canvas) return;

    const delta = e.deltaY;
    let newZoom = canvas.getZoom() * Math.pow(0.999, delta);
    
    // Clamp zoom
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Zoom to mouse position
    const point = new fabric.Point(e.offsetX, e.offsetY);
    canvas.zoomToPoint(point, newZoom);
    
    setZoom(newZoom);
    canvas.renderAll();
  }, [fabricRef, minZoom, maxZoom]);

  // Handle keyboard events for space + drag panning
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault();
      setIsSpacePressed(true);
      
      const canvas = fabricRef.current;
      if (canvas) {
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        canvas.renderAll();
      }
    }
  }, [fabricRef, isSpacePressed]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsSpacePressed(false);
      setIsPanning(false);
      
      const canvas = fabricRef.current;
      if (canvas) {
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.renderAll();
      }
    }
  }, [fabricRef]);

  // Handle panning
  const handleMouseDown = useCallback((e: fabric.TPointerEvent) => {
    const canvas = fabricRef.current;
    if (!canvas || !isSpacePressed) return;

    setIsPanning(true);
    canvas.selection = false;
    canvas.defaultCursor = 'grabbing';
    
    const pointer = canvas.getPointer(e.e);
    lastPosRef.current = { x: pointer.x, y: pointer.y };
    
    canvas.renderAll();
  }, [fabricRef, isSpacePressed]);

  const handleMouseMove = useCallback((e: fabric.TPointerEvent) => {
    const canvas = fabricRef.current;
    if (!canvas || !isPanning || !isSpacePressed) return;

    const pointer = canvas.getPointer(e.e);
    const vpt = canvas.viewportTransform;
    
    if (vpt) {
      vpt[4] += (pointer.x - lastPosRef.current.x) * panSensitivity;
      vpt[5] += (pointer.y - lastPosRef.current.y) * panSensitivity;
      
      canvas.setViewportTransform(vpt);
      canvas.renderAll();
    }
    
    lastPosRef.current = { x: pointer.x, y: pointer.y };
  }, [fabricRef, isPanning, isSpacePressed, panSensitivity]);

  const handleMouseUp = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    setIsPanning(false);
    canvas.selection = true;
    
    if (isSpacePressed) {
      canvas.defaultCursor = 'grab';
    } else {
      canvas.defaultCursor = 'default';
    }
    
    canvas.renderAll();
  }, [fabricRef, isSpacePressed]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const newZoom = Math.min(maxZoom, canvas.getZoom() * 1.2);
    const center = canvas.getCenterPoint();
    canvas.zoomToPoint(center, newZoom);
    setZoom(newZoom);
    canvas.renderAll();
  }, [fabricRef, maxZoom]);

  const zoomOut = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const newZoom = Math.max(minZoom, canvas.getZoom() * 0.8);
    const center = canvas.getCenterPoint();
    canvas.zoomToPoint(center, newZoom);
    setZoom(newZoom);
    canvas.renderAll();
  }, [fabricRef, minZoom]);

  const zoomToFit = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const newZoom = 1;
    canvas.setZoom(newZoom);
    setZoom(newZoom);
    canvas.renderAll();
  }, [fabricRef]);

  const resetView = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.setZoom(1);
    setZoom(1);
    canvas.renderAll();
  }, [fabricRef]);

  // Setup event listeners
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Add canvas event listeners
    canvas.on('mouse:wheel', handleWheel);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.off('mouse:wheel', handleWheel);
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [fabricRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);

  return {
    zoom,
    isPanning,
    isSpacePressed,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetView,
    setZoom
  };
};
