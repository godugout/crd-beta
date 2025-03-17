import { useState, useRef, useEffect } from 'react';
import { Canvas, Rect, util } from 'fabric';
import { DetectedCard } from '../types';
import { toast } from 'sonner';

export const useCardCanvas = () => {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // State
  const [manualTraces, setManualTraces] = useState<DetectedCard[]>([]);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);
  const [activeTool, setActiveTool] = useState<'select' | 'trace'>('select');

  // Initialize fabric.js canvas when an image is loaded
  const initializeCanvas = (img: HTMLImageElement, canvas: Canvas) => {
    const maxDimension = 800;
    const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    
    // Set canvas dimensions
    canvas.setWidth(width);
    canvas.setHeight(height);
    setDisplayWidth(width);
    setDisplayHeight(height);
    
    // Create a fabric image object
    util.loadImage(img.src)
      .then(fabricImg => {
        canvas.backgroundImage = fabricImg;
        canvas.backgroundImage.scaleX = width / img.naturalWidth;
        canvas.backgroundImage.scaleY = height / img.naturalHeight;
        canvas.renderAll();
      });
    
    // Configure canvas for tracing
    setupCanvasForTracing(canvas);
  };
  
  // Configure canvas for card tracing
  const setupCanvasForTracing = (canvas: Canvas) => {
    // Set default options
    canvas.selection = false;
    
    // Handle object added
    canvas.on('object:added', (e) => {
      if (!e.target) return;
      
      // Apply constraints for card shape
      if (e.target.type === 'rect') {
        const rect = e.target;
        // Force a 2.5:3.5 ratio for trading cards
        const currentWidth = rect.width || 0;
        rect.set('height', currentWidth * (3.5 / 2.5));
        rect.set({
          fill: 'rgba(0, 0, 255, 0.2)',
          stroke: 'blue',
          strokeWidth: 2,
          transparentCorners: false,
          cornerColor: 'blue',
          cornerStrokeColor: 'white',
          borderColor: 'blue',
          cornerSize: 8,
          padding: 5,
          cornerStyle: 'circle',
          borderDashArray: [3, 3]
        });
      }
      
      canvas.renderAll();
      updateManualTraces(canvas);
    });
    
    // Update traces when objects are modified
    canvas.on('object:modified', () => {
      updateManualTraces(canvas);
    });
  };
  
  // Update manual traces from canvas objects
  const updateManualTraces = (canvas: Canvas) => {
    const traces: DetectedCard[] = [];
    
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'rect') {
        const rect = obj;
        traces.push({
          x: rect.left || 0,
          y: rect.top || 0,
          width: rect.width || 0,
          height: rect.height || 0,
          rotation: rect.angle || 0
        });
      }
    });
    
    setManualTraces(traces);
  };
  
  // Add a new card trace rectangle
  const handleAddTrace = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const width = 150;
    const height = width * (3.5 / 2.5);
    
    const rect = new Rect({
      left: canvas.width! / 2 - width / 2,
      top: canvas.height! / 2 - height / 2,
      width: width,
      height: height,
      fill: 'rgba(0, 0, 255, 0.2)',
      stroke: 'blue',
      strokeWidth: 2,
      transparentCorners: false,
      cornerColor: 'blue',
      cornerStrokeColor: 'white',
      borderColor: 'blue',
      cornerSize: 8,
      padding: 5,
      cornerStyle: 'circle',
      borderDashArray: [3, 3]
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    updateManualTraces(canvas);
  };
  
  // Clear all traced objects
  const handleClearTraces = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.getObjects().forEach(obj => canvas.remove(obj));
    canvas.renderAll();
    
    setManualTraces([]);
  };

  // Initialize the canvas with an image
  const createCanvas = (imgElement: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    // If a canvas already exists, dispose of it
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    const canvas = new Canvas(canvasRef.current);
    fabricCanvasRef.current = canvas;
    
    // Load the image
    if (imgElement) {
      // Wait for the image to load
      if (imgElement.complete) {
        initializeCanvas(imgElement, canvas);
      } else {
        imgElement.onload = () => initializeCanvas(imgElement, canvas);
      }
    }
  };

  return {
    canvasRef,
    fabricCanvasRef,
    manualTraces,
    displayWidth,
    displayHeight,
    activeTool,
    setActiveTool,
    createCanvas,
    handleAddTrace,
    handleClearTraces
  };
};
