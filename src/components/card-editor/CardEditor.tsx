
import React, { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import Canvas from './FabricCanvas';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CardEditorProps {
  initialImage?: string;
  onSave?: (canvas: fabric.Canvas) => void;
}

const CardEditor: React.FC<CardEditorProps> = ({
  initialImage,
  onSave,
}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize canvas with image if provided
  const handleCanvasReady = useCallback((fabricCanvas: fabric.Canvas) => {
    console.log("Canvas is ready");
    setCanvas(fabricCanvas);
    
    if (initialImage) {
      setLoading(true);
      
      fabric.Image.fromURL(initialImage)
        .then((img) => {
          // Scale image to fit canvas
          const canvasWidth = fabricCanvas.getWidth();
          const canvasHeight = fabricCanvas.getHeight();
          
          const scale = Math.min(
            (canvasWidth - 40) / img.width!,
            (canvasHeight - 40) / img.height!
          );
          
          img.scale(scale);
          
          // Center image on canvas
          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
          });
          
          fabricCanvas.add(img);
          fabricCanvas.renderAll();
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading image:", err);
          toast.error("Failed to load image");
          setLoading(false);
        });
    }
  }, [initialImage]);

  // Add text to canvas
  const addText = useCallback(() => {
    if (!canvas) return;
    
    const text = new fabric.Text('Double click to edit', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    toast.success("Text added - double click to edit");
  }, [canvas]);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    setLoading(true);
    reader.onload = (event) => {
      if (!event.target?.result) return;
      
      // Clear existing objects
      canvas.clear();
      
      fabric.Image.fromURL(event.target.result.toString())
        .then((img) => {
          // Scale image to fit canvas
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();
          
          const scale = Math.min(
            (canvasWidth - 40) / img.width!,
            (canvasHeight - 40) / img.height!
          );
          
          img.scale(scale);
          
          // Center image on canvas
          img.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
          });
          
          canvas.add(img);
          canvas.renderAll();
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading image:", err);
          toast.error("Failed to load image");
          setLoading(false);
        });
    };
    
    reader.readAsDataURL(file);
  }, [canvas]);

  // Save canvas
  const handleSave = useCallback(() => {
    if (!canvas || !onSave) return;
    
    try {
      onSave(canvas);
      toast.success("Card saved successfully");
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast.error("Failed to save card");
    }
  }, [canvas, onSave]);

  return (
    <div className="card-editor">
      <div className="toolbar flex gap-2 mb-4">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={loading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button variant="outline" disabled={loading} asChild>
            <span>Upload Image</span>
          </Button>
        </label>
        
        <Button
          variant="outline"
          onClick={addText}
          disabled={!canvas || loading}
        >
          Add Text
        </Button>
        
        {onSave && (
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!canvas || loading}
          >
            Save Card
          </Button>
        )}
      </div>
      
      <div className="canvas-container relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
        <Canvas 
          width={500} 
          height={700} 
          onReady={handleCanvasReady}
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default CardEditor;
