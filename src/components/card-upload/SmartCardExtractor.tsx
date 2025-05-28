
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Crop, Download, RotateCcw } from 'lucide-react';
import { toast } from "sonner";
import { detectCardBounds, calculateOptimalScale, applyCropToCanvas, CropArea } from './utils/smartCardDetection';

interface SmartCardExtractorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (file: File, url: string) => void;
}

const SmartCardExtractor: React.FC<SmartCardExtractorProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSave
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 280 });
  const [imageScale, setImageScale] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    
    if (!img || !container) return;
    
    // Calculate optimal scale and centering
    const containerWidth = container.clientWidth - 32; // Account for padding
    const containerHeight = container.clientHeight - 32;
    
    const scale = calculateOptimalScale(
      img.naturalWidth,
      img.naturalHeight,
      containerWidth,
      containerHeight
    );
    setImageScale(scale);
    
    // Calculate image offset to center it
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    const offsetX = (containerWidth - scaledWidth) / 2;
    const offsetY = (containerHeight - scaledHeight) / 2;
    setImageOffset({ x: offsetX, y: offsetY });
    
    // Detect initial card bounds - make them larger
    const detectedBounds = detectCardBounds(img);
    // Increase size by 20% for better initial coverage
    const enlargedBounds = {
      x: Math.max(0, detectedBounds.x - detectedBounds.width * 0.1),
      y: Math.max(0, detectedBounds.y - detectedBounds.height * 0.1),
      width: Math.min(detectedBounds.width * 1.2, img.naturalWidth),
      height: Math.min(detectedBounds.height * 1.2, img.naturalHeight)
    };
    setCropArea(enlargedBounds);
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const img = imageRef.current;
    if (!img) return { x: 0, y: 0 };
    
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left - imageOffset.x) / imageScale;
    const y = (e.clientY - rect.top - imageOffset.y) / imageScale;
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    const { x, y } = getMousePosition(e);
    
    if (handle) {
      setIsResizing(handle);
      setDragStart({ x, y, cropX: cropArea.x, cropY: cropArea.y });
    } else {
      // Check if click is inside crop area for dragging
      if (x >= cropArea.x && x <= cropArea.x + cropArea.width &&
          y >= cropArea.y && y <= cropArea.y + cropArea.height) {
        setIsDragging(true);
        setDragStart({ x, y, cropX: cropArea.x, cropY: cropArea.y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing || !imageRef.current) return;
    
    const { x, y } = getMousePosition(e);
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    if (isDragging) {
      // Move the entire crop area
      const newX = Math.max(0, Math.min(dragStart.cropX + deltaX, imageRef.current.naturalWidth - cropArea.width));
      const newY = Math.max(0, Math.min(dragStart.cropY + deltaY, imageRef.current.naturalHeight - cropArea.height));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      // Resize the crop area while maintaining aspect ratio
      const aspectRatio = 2.5 / 3.5; // Standard card ratio
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;
      let newX = cropArea.x;
      let newY = cropArea.y;
      
      switch (isResizing) {
        case 'se': // Bottom-right
          newWidth = Math.max(100, cropArea.width + deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 'sw': // Bottom-left
          newWidth = Math.max(100, cropArea.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = cropArea.x + cropArea.width - newWidth;
          break;
        case 'ne': // Top-right
          newWidth = Math.max(100, cropArea.width + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = cropArea.y + cropArea.height - newHeight;
          break;
        case 'nw': // Top-left
          newWidth = Math.max(100, cropArea.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = cropArea.x + cropArea.width - newWidth;
          newY = cropArea.y + cropArea.height - newHeight;
          break;
      }
      
      // Ensure crop area stays within image bounds
      if (newX >= 0 && newY >= 0 && 
          newX + newWidth <= imageRef.current.naturalWidth &&
          newY + newHeight <= imageRef.current.naturalHeight) {
        setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleExtractCard = async () => {
    if (!imageRef.current || !canvasRef.current) {
      toast.error('Image not loaded properly');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Apply crop to canvas using the exact crop area coordinates
      applyCropToCanvas(imageRef.current, cropArea, canvasRef.current);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          1.0
        );
      });
      
      // Create file and URL
      const file = new File([blob], 'extracted-card.png', { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      // Call the save callback
      onSave(file, url);
      
      toast.success('Card extracted successfully!');
      onClose();
    } catch (error) {
      console.error('Error extracting card:', error);
      toast.error('Failed to extract card');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCrop = () => {
    if (imageRef.current) {
      const detectedBounds = detectCardBounds(imageRef.current);
      // Increase size by 20% for better coverage
      const enlargedBounds = {
        x: Math.max(0, detectedBounds.x - detectedBounds.width * 0.1),
        y: Math.max(0, detectedBounds.y - detectedBounds.height * 0.1),
        width: Math.min(detectedBounds.width * 1.2, imageRef.current.naturalWidth),
        height: Math.min(detectedBounds.height * 1.2, imageRef.current.naturalHeight)
      };
      setCropArea(enlargedBounds);
    }
  };

  // Global mouse event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        const syntheticEvent = {
          clientX: e.clientX,
          clientY: e.clientY,
          preventDefault: () => {}
        } as React.MouseEvent;
        handleMouseMove(syntheticEvent);
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, dragStart, cropArea, imageScale, imageOffset]);

  const cropStyle = {
    position: 'absolute' as const,
    left: imageOffset.x + cropArea.x * imageScale,
    top: imageOffset.y + cropArea.y * imageScale,
    width: cropArea.width * imageScale,
    height: cropArea.height * imageScale,
    border: '2px solid #3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    cursor: isDragging ? 'move' : 'grab',
    pointerEvents: 'auto' as const
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-[#0a0a0a] border-white/20">
        <DialogHeader className="p-6 border-b border-white/20 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <DialogTitle className="text-2xl font-bold text-white">Smart Card Extractor</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(95vh-8rem)] overflow-hidden">
          {/* Main extraction area */}
          <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-gray-900 rounded-xl border border-white/10">
            <div 
              className="flex-1 relative overflow-hidden" 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: isResizing ? 'crosshair' : 'default' }}
            >
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Card to extract"
                    className="max-w-full max-h-full object-contain"
                    style={{ 
                      transform: `scale(${imageScale})`,
                      transformOrigin: 'top left'
                    }}
                    onLoad={handleImageLoad}
                    draggable={false}
                  />
                  
                  {/* Crop overlay */}
                  <div
                    style={cropStyle}
                    onMouseDown={(e) => handleMouseDown(e)}
                  >
                    {/* Resize handles */}
                    <div
                      className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'nw')}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'ne')}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'sw')}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'se')}
                    />
                    
                    {/* Drag instruction */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded pointer-events-none">
                      Drag to move • Resize with corners
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls sidebar */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Crop className="w-5 h-5 text-blue-400" />
                Extraction Controls
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCrop}
                  className="w-full bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Crop Area
                </Button>
                
                <div className="text-sm text-gray-300">
                  <p className="mb-2 font-medium">Crop Dimensions:</p>
                  <p>Width: {Math.round(cropArea.width)}px</p>
                  <p>Height: {Math.round(cropArea.height)}px</p>
                  <p>Ratio: {(cropArea.width / cropArea.height).toFixed(2)}</p>
                </div>
                
                <div className="text-xs text-gray-400 bg-black/20 p-2 rounded">
                  <p>• Drag the crop area to move</p>
                  <p>• Drag corners to resize</p>
                  <p>• Maintains card aspect ratio</p>
                </div>
              </div>
            </div>
            
            {/* Extract button */}
            <div className="mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-3 text-lg" 
                onClick={handleExtractCard}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Extract Card
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default SmartCardExtractor;
