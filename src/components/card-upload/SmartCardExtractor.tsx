
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Crop, Download, X } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageLoad = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    
    if (!img || !container) return;
    
    // Detect initial card bounds
    const detectedBounds = detectCardBounds(img);
    setCropArea(detectedBounds);
    
    // Calculate optimal scale
    const scale = calculateOptimalScale(
      img.width,
      img.height,
      container.clientWidth,
      container.clientHeight
    );
    setImageScale(scale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / imageScale;
    const y = (e.clientY - rect.top) / imageScale;
    
    setIsDragging(true);
    setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / imageScale;
    const y = (e.clientY - rect.top) / imageScale;
    
    const newX = Math.max(0, Math.min(x - dragStart.x, imageRef.current.width - cropArea.width));
    const newY = Math.max(0, Math.min(y - dragStart.y, imageRef.current.height - cropArea.height));
    
    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExtractCard = async () => {
    if (!imageRef.current || !canvasRef.current) {
      toast.error('Image not loaded properly');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Apply crop to canvas
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
      setCropArea(detectedBounds);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / imageScale;
        const y = (e.clientY - rect.top) / imageScale;
        
        const newX = Math.max(0, Math.min(x - dragStart.x, imageRef.current.width - cropArea.width));
        const newY = Math.max(0, Math.min(y - dragStart.y, imageRef.current.height - cropArea.height));
        
        setCropArea(prev => ({ ...prev, x: newX, y: newY }));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, cropArea, imageScale]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-[#0a0a0a] border-white/20">
        <DialogHeader className="p-6 border-b border-white/20 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <DialogTitle className="text-2xl font-bold text-white">Smart Card Extractor</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(95vh-8rem)] overflow-hidden">
          {/* Main extraction area */}
          <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-gray-900 rounded-xl border border-white/10">
            <div className="flex-1 relative overflow-hidden" ref={containerRef}>
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Card to extract"
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${imageScale})` }}
                    onLoad={handleImageLoad}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    draggable={false}
                  />
                  
                  {/* Crop overlay */}
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                    style={{
                      left: cropArea.x * imageScale,
                      top: cropArea.y * imageScale,
                      width: cropArea.width * imageScale,
                      height: cropArea.height * imageScale,
                      transform: 'translate(0, 0)'
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <div className="absolute inset-0 border border-white/50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      Drag to move
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
                  Reset Crop Area
                </Button>
                
                <div className="text-sm text-gray-300">
                  <p className="mb-2">Crop Dimensions:</p>
                  <p>Width: {Math.round(cropArea.width)}px</p>
                  <p>Height: {Math.round(cropArea.height)}px</p>
                  <p>Ratio: {(cropArea.width / cropArea.height).toFixed(2)}</p>
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
