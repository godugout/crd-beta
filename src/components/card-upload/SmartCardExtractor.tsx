
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Crop, Download, RotateCcw, Move, Square } from 'lucide-react';
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
  const [isHovering, setIsHovering] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    
    if (!img || !container) return;
    
    // Calculate optimal scale to fill container while maintaining aspect ratio
    const containerWidth = container.clientWidth - 64;
    const containerHeight = container.clientHeight - 64;
    
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    const scale = Math.min(scaleX, scaleY) * 0.85;
    setImageScale(scale);
    
    // Center the image
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    const offsetX = (containerWidth - scaledWidth) / 2 + 32;
    const offsetY = (containerHeight - scaledHeight) / 2 + 32;
    setImageOffset({ x: offsetX, y: offsetY });
    
    // Set initial crop area using smart detection
    const detectedBounds = detectCardBounds(img);
    setCropArea(detectedBounds);
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const img = imageRef.current;
    if (!img) return { x: 0, y: 0 };
    
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / imageScale;
    const y = (e.clientY - rect.top) / imageScale;
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
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
      const newX = dragStart.cropX + deltaX;
      const newY = dragStart.cropY + deltaY;
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const aspectRatio = 2.5 / 3.5;
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;
      let newX = cropArea.x;
      let newY = cropArea.y;
      
      switch (isResizing) {
        case 'se':
          newWidth = Math.max(50, cropArea.width + deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 'sw':
          newWidth = Math.max(50, cropArea.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = cropArea.x + cropArea.width - newWidth;
          break;
        case 'ne':
          newWidth = Math.max(50, cropArea.width + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = cropArea.y + cropArea.height - newHeight;
          break;
        case 'nw':
          newWidth = Math.max(50, cropArea.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = cropArea.x + cropArea.width - newWidth;
          newY = cropArea.y + cropArea.height - newHeight;
          break;
      }
      
      setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
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
      const naturalCrop = {
        x: Math.max(0, cropArea.x),
        y: Math.max(0, cropArea.y),
        width: Math.min(cropArea.width, imageRef.current.naturalWidth - cropArea.x),
        height: Math.min(cropArea.height, imageRef.current.naturalHeight - cropArea.y)
      };
      
      applyCropToCanvas(imageRef.current, naturalCrop, canvasRef.current);
      
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
      
      const file = new File([blob], 'extracted-card.png', { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
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
      setCropArea(detectedBounds);
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
    border: '3px solid #3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    cursor: isDragging ? 'move' : 'grab',
    pointerEvents: 'auto' as const,
    borderRadius: '4px',
    boxShadow: isHovering ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.3)',
    transition: 'box-shadow 0.2s ease'
  };

  const handleStyle = 'absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg cursor-pointer hover:bg-blue-600 hover:scale-110 transition-all duration-200 flex items-center justify-center';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[98vh] p-0 overflow-hidden bg-[#0a0a0a] border-white/20">
        <DialogHeader className="p-6 border-b border-white/20 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Crop className="w-6 h-6" />
            Smart Card Extractor
          </DialogTitle>
          <p className="text-gray-300 text-sm">Crop your card image with precision. Drag to move, use corners to resize.</p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(98vh-8rem)] overflow-hidden">
          {/* Main extraction area */}
          <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-gray-900 rounded-xl border border-white/10">
            <div 
              className="flex-1 relative overflow-hidden bg-gray-800" 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: isResizing ? 'crosshair' : 'default' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Card to extract"
                  className="absolute max-w-none"
                  style={{ 
                    transformOrigin: 'top left',
                    transform: `scale(${imageScale})`,
                    left: `${imageOffset.x}px`,
                    top: `${imageOffset.y}px`
                  }}
                  onLoad={handleImageLoad}
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div
                  style={cropStyle}
                  onMouseDown={(e) => handleMouseDown(e)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Corner resize handles */}
                  <div
                    className={`${handleStyle} -top-2.5 -left-2.5`}
                    onMouseDown={(e) => handleMouseDown(e, 'nw')}
                    title="Resize from top-left"
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div
                    className={`${handleStyle} -top-2.5 -right-2.5`}
                    onMouseDown={(e) => handleMouseDown(e, 'ne')}
                    title="Resize from top-right"
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div
                    className={`${handleStyle} -bottom-2.5 -left-2.5`}
                    onMouseDown={(e) => handleMouseDown(e, 'sw')}
                    title="Resize from bottom-left"
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div
                    className={`${handleStyle} -bottom-2.5 -right-2.5`}
                    onMouseDown={(e) => handleMouseDown(e, 'se')}
                    title="Resize from bottom-right"
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Center move indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-medium bg-blue-500/90 px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1 shadow-lg">
                    <Move className="w-3 h-3" />
                    Drag to move
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status bar */}
            <div className="bg-gray-800 border-t border-white/10 px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span>Crop: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px</span>
                <span>Ratio: {(cropArea.width / cropArea.height).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Square className="w-3 h-3" />
                Card aspect ratio maintained
              </div>
            </div>
          </div>
          
          {/* Controls sidebar */}
          <div className="flex flex-col space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Crop className="w-5 h-5 text-blue-400" />
                Crop Controls
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCrop}
                  className="w-full bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Auto-detect Card
                </Button>
                
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="bg-black/20 p-3 rounded border border-white/10">
                    <p className="font-medium mb-2">How to use:</p>
                    <ul className="text-xs space-y-1 text-gray-400">
                      <li>• Drag the blue box to move</li>
                      <li>• Drag corner circles to resize</li>
                      <li>• Maintains card aspect ratio</li>
                      <li>• Hover for better visibility</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                    <p className="text-blue-200 font-medium">Current Selection</p>
                    <p className="text-xs text-blue-300">
                      {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixels
                    </p>
                    <p className="text-xs text-blue-300">
                      Position: ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Extract button */}
            <div className="mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-3 text-lg shadow-lg" 
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
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default SmartCardExtractor;
