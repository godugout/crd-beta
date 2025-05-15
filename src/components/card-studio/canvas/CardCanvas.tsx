
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/lib/types/cardTypes';
import { fabric } from 'fabric';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardCanvasProps {
  template?: any;
  onReady?: (canvas: HTMLCanvasElement) => void;
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ 
  template = {}, 
  onReady,
  cardData,
  onUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState(1);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize fabric canvas if it doesn't exist
    if (!fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 300,
        height: 420,
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: '#FFFFFF'
      });
      
      // Call onReady callback if provided
      if (onReady && canvasRef.current) {
        onReady(canvasRef.current);
      }
    }
    
    const canvas = fabricRef.current;
    const designMetadata = cardData.designMetadata || {};
    const cardStyle = designMetadata.cardStyle || {};
    const textStyle = designMetadata.textStyle || {};
    
    // Clear canvas
    canvas.clear();
    
    // Set background color
    canvas.backgroundColor = cardStyle.backgroundColor || '#FFFFFF';
    
    // Add background image if exists
    if (cardData.imageUrl) {
      fabric.Image.fromURL(cardData.imageUrl, (img) => {
        // Scale image to fit canvas
        const canvasWidth = canvas.width || 300;
        const canvasHeight = canvas.height || 420;
        
        const scale = Math.min(
          canvasWidth / (img.width || 1),
          canvasHeight / (img.height || 1)
        );
        
        img.scale(scale);
        
        // Center image
        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: 'center',
          originY: 'center',
          selectable: true
        });
        
        canvas.add(img);
        canvas.renderAll();
      });
    }
    
    // Add title text if exists
    if (cardData.title) {
      const titleText = new fabric.Text(cardData.title, {
        left: (canvas.width || 300) / 2,
        top: 30,
        fontSize: parseInt(textStyle.fontSize || '20'),
        fontFamily: textStyle.fontFamily || 'Arial',
        fontWeight: textStyle.titleWeight || 'bold',
        fill: textStyle.titleColor || '#000000',
        textAlign: (textStyle.titleAlignment as any) || 'center',
        originX: 'center',
        selectable: true
      });
      
      canvas.add(titleText);
    }
    
    // Add description if exists
    if (cardData.description) {
      const descriptionText = new fabric.Text(cardData.description, {
        left: (canvas.width || 300) / 2,
        top: (canvas.height || 420) - 50,
        fontSize: parseInt(textStyle.fontSize || '14'),
        fontFamily: textStyle.fontFamily || 'Arial',
        fill: textStyle.descriptionColor || '#333333',
        textAlign: 'center',
        originX: 'center',
        width: (canvas.width || 300) * 0.8,
        selectable: true
      });
      
      canvas.add(descriptionText);
    }
    
    // Add border if needed
    if (cardStyle.borderWidth && cardStyle.borderColor) {
      const border = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width || 300,
        height: canvas.height || 420,
        fill: 'transparent',
        stroke: cardStyle.borderColor,
        strokeWidth: cardStyle.borderWidth,
        selectable: false
      });
      
      canvas.add(border);
    }
    
    canvas.renderAll();
    
    // Set up event listeners for object modifications
    canvas.on('object:modified', (e) => {
      // Handle object modification here
      // For example, update text content if a text object was modified
      if (e.target instanceof fabric.Text) {
        const text = e.target.text;
        if (e.target === titleText) {
          onUpdate({ title: text });
        } else if (e.target === descriptionText) {
          onUpdate({ description: text });
        }
      }
    });
    
    // Clean up function
    return () => {
      canvas.off('object:modified');
    };
  }, [cardData, onReady, onUpdate]);
  
  // Zoom functions
  const handleZoomIn = () => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom(zoom + 0.1);
    setZoom(zoom + 0.1);
  };
  
  const handleZoomOut = () => {
    if (!fabricRef.current) return;
    if (zoom > 0.2) {
      fabricRef.current.setZoom(zoom - 0.1);
      setZoom(zoom - 0.1);
    }
  };
  
  return (
    <div className="card-canvas-container relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain border rounded shadow-sm"
      />
      
      <div className="absolute bottom-2 right-2 flex gap-1">
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardCanvas;
