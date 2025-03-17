
import React, { useEffect, useRef } from 'react';
import { Point } from './hooks/useSignatureCanvas';

interface InkPressureVisualizerProps {
  points: Point[];
}

const InkPressureVisualizer: React.FC<InkPressureVisualizerProps> = ({ points }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Render the pressure visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up for visualization
    const width = canvas.width;
    const height = canvas.height;
    const maxPoints = 300; // Limit the number of points to display
    
    // Get a subset of points if we have too many
    const displayPoints = points.length <= maxPoints 
      ? points 
      : points.filter((_, i) => i % Math.ceil(points.length / maxPoints) === 0);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Draw visualization
    if (displayPoints.length > 1) {
      // Draw pressure graph
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.7)';
      ctx.lineWidth = 2;
      
      const step = width / (displayPoints.length - 1);
      
      displayPoints.forEach((point, i) => {
        const x = i * step;
        const y = height - (point.pressure * height);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Fill area under the graph
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
      ctx.fill();
      
      // Draw markers for strokes
      let lastStrokeIndex = 0;
      displayPoints.forEach((point, i) => {
        if (i > 0 && displayPoints[i - 1].timestamp + 100 < point.timestamp) {
          const x = i * step;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Label the stroke
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.font = '10px Arial';
          ctx.fillText(`Stroke ${++lastStrokeIndex}`, x + 2, 10);
        }
      });
    }
  }, [points]);
  
  if (points.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-[150px]">
        <p className="text-sm text-gray-400">Sign to see pressure analysis</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium mb-2">Pressure Analysis</h3>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="w-full"
      />
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Start</span>
        <span>Pressure Variation</span>
        <span>End</span>
      </div>
    </div>
  );
};

export default InkPressureVisualizer;
