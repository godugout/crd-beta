
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useBatchImageProcessing } from './hooks/useBatchImageProcessing';
import EditorCanvas from './EditorCanvas';

interface BatchImageEditorProps {
  files: File[];
  onComplete?: (processedImages: any[]) => void;
}

const BatchImageEditor: React.FC<BatchImageEditorProps> = ({ files, onComplete }) => {
  const {
    isProcessing,
    processedImages,
    currentImageIndex,
    processImage,
    detectObjects,
    processDetections,
    extractSelectedAreas,
    getPreviewUrls
  } = useBatchImageProcessing();
  
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  
  // Process the first image when component mounts
  useEffect(() => {
    if (files.length > 0 && processedImages.length === 0) {
      setCurrentFile(files[0]);
      processCurrentFile(files[0]);
    }
  }, [files]);
  
  // Update the current image when the index changes
  useEffect(() => {
    if (processedImages[currentImageIndex]) {
      setCurrentImageUrl(processedImages[currentImageIndex].processedUrl);
    }
  }, [processedImages, currentImageIndex]);
  
  const processCurrentFile = async (file: File) => {
    const result = await processImage(file);
    if (result.success && result.data) {
      setCurrentImageUrl(result.data.processedUrl);
      
      // Set the image dimensions for canvas
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = result.data.processedUrl;
    }
  };
  
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isProcessing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartX(x);
    setStartY(y);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Clear the canvas and draw the new selection rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = 'rgba(0, 120, 255, 1)';
    ctx.lineWidth = 2;
    
    const width = x - startX;
    const height = y - startY;
    
    ctx.fillRect(startX, startY, width, height);
    ctx.strokeRect(startX, startY, width, height);
  };
  
  const handlePointerUp = () => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(false);
    
    // Add the selected area to our state
    const rect = canvas.getBoundingClientRect();
    
    // Only add the selection if it's big enough
    const minSize = 10; // Minimum size in pixels
    const width = Math.abs(rect.width);
    const height = Math.abs(rect.height);
    
    if (width > minSize && height > minSize) {
      setSelectedAreas([...selectedAreas, {
        x: Math.min(startX, rect.width),
        y: Math.min(startY, rect.height),
        width,
        height
      }]);
    }
    
    // Clear canvas after adding the selection
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const processNext = async () => {
    // Process any selected areas here
    // ...
    
    // Move to the next file
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < files.length) {
      setCurrentFile(files[nextIndex]);
      processCurrentFile(files[nextIndex]);
      setSelectedAreas([]);
    } else {
      // All files processed
      if (onComplete) {
        onComplete(processedImages);
      }
    }
  };
  
  const detectAndProcess = async () => {
    if (!currentImageUrl) return;
    
    try {
      const detections = await detectObjects(currentImageUrl);
      const processed = await processDetections(detections, currentImageUrl);
      
      // Update the processedImages with the detections
      const updatedProcessedImages = [...processedImages];
      updatedProcessedImages[currentImageIndex] = {
        ...updatedProcessedImages[currentImageIndex],
        detections: processed
      };
      
      // Here you would normally update your state with the processed detections
      console.log("Processed detections:", processed);
      
    } catch (error) {
      console.error("Error in detection and processing:", error);
    }
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Batch Image Editor</h2>
      
      <div className="mb-4">
        <p>
          Processing image {currentImageIndex + 1} of {files.length}: 
          <span className="font-medium ml-1">{currentFile?.name || ''}</span>
        </p>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <EditorCanvas 
          canvasRef={canvasRef}
          editorImgRef={editorImgRef}
          width={width}
          height={height}
          isDrawing={isDrawing}
          startX={startX}
          startY={startY}
          isProcessing={isProcessing}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          imageUrl={currentImageUrl}
          selectedAreas={selectedAreas}
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline"
          onClick={detectAndProcess}
          disabled={isProcessing || !currentImageUrl}
        >
          Auto-Detect Objects
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedAreas([]);
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, width, height);
              }
            }}
            disabled={isProcessing || selectedAreas.length === 0}
          >
            Clear Selections
          </Button>
          
          <Button
            onClick={processNext}
            disabled={isProcessing}
          >
            {currentImageIndex < files.length - 1 ? 'Next Image' : 'Finish'}
          </Button>
        </div>
      </div>
      
      {selectedAreas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Areas: {selectedAreas.length}</h3>
          <div className="grid grid-cols-6 gap-2">
            {selectedAreas.map((area, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500"
              >
                Area {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchImageEditor;
