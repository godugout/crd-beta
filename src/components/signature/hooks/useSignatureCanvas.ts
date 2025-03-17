
import { useState, useEffect, useRef } from 'react';

export interface Point {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export const useSignatureCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState(0);
  const [pathData, setPathData] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const prevPoint = useRef<Point | null>(null);
  
  // Calculate duration of the signature
  const duration = startTime && endTime ? endTime - startTime : 0;
  
  useEffect(() => {
    // Initialize canvas when component mounts
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas context for signature
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000333';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);
  
  // Generate SVG path data from points
  useEffect(() => {
    if (points.length === 0) {
      setPathData(null);
      return;
    }
    
    let path = '';
    let currentStroke: Point[] = [];
    
    points.forEach((point, index) => {
      // Check if this is a new stroke
      if (index > 0 && points[index - 1].timestamp + 100 < point.timestamp) {
        // End the current stroke
        if (currentStroke.length > 0) {
          // Process the complete stroke
          currentStroke = [];
        }
        
        // Start a new stroke
        path += ` M${point.x},${point.y}`;
      } else if (index === 0 || currentStroke.length === 0) {
        // First point of a stroke
        path += ` M${point.x},${point.y}`;
      } else {
        // Continue the stroke
        path += ` L${point.x},${point.y}`;
      }
      
      currentStroke.push(point);
    });
    
    setPathData(path);
  }, [points]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    
    // Clear if this is a new signature
    if (points.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setIsDrawing(true);
    setStrokes(prev => prev + 1);
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    // Get pressure from pointer event if available, otherwise use default
    let pressure = 0.5;
    if ('pressure' in e.nativeEvent) {
      pressure = (e.nativeEvent as any).pressure || 0.5;
    }
    
    const newPoint: Point = {
      x,
      y,
      pressure,
      timestamp: Date.now()
    };
    
    prevPoint.current = newPoint;
    setPoints(prev => [...prev, newPoint]);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    
    // Get pressure from pointer event if available, otherwise use default
    let pressure = 0.5;
    if ('pressure' in e.nativeEvent) {
      pressure = (e.nativeEvent as any).pressure || 0.5;
    }
    
    // Simulate pressure variation based on speed if no pressure is detected
    if (pressure === 0.5 && prevPoint.current) {
      const dx = x - prevPoint.current.x;
      const dy = y - prevPoint.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / (Date.now() - prevPoint.current.timestamp);
      
      // Slower movement = more pressure
      pressure = Math.max(0.2, Math.min(1.0, 1.0 - speed * 10));
    }
    
    // Vary line width based on pressure
    ctx.lineWidth = 1 + pressure * 3;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    const newPoint: Point = {
      x,
      y,
      pressure,
      timestamp: Date.now()
    };
    
    prevPoint.current = newPoint;
    setPoints(prev => [...prev, newPoint]);
  };
  
  const endDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
    setEndTime(Date.now());
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    setStrokes(0);
    setPathData(null);
    setStartTime(null);
    setEndTime(null);
    prevPoint.current = null;
  };
  
  return {
    isDrawing,
    points,
    strokes,
    clearSignature,
    pathData,
    duration,
    startDrawing,
    draw,
    endDrawing
  };
};
