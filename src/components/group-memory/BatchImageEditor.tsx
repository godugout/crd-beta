
import React, { useRef, useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crop, RotateCcw, RotateCw, ZoomIn, ZoomOut, Users, 
  Layers, Maximize2, Sunset, Sun
} from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedCropBoxProps, MemorabiliaType } from '../card-upload/cardDetection';

interface BatchImageEditorProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  originalFile: File | null;
  onProcessComplete: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  detectionType: 'face' | 'memorabilia' | 'mixed' | 'group';
}

const BatchImageEditor: React.FC<BatchImageEditorProps> = ({
  open,
  onClose,
  imageUrl,
  originalFile,
  onProcessComplete,
  detectionType = 'face'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [autoEnhance, setAutoEnhance] = useState<boolean>(true);
  const [selectedAreas, setSelectedAreas] = useState<EnhancedCropBoxProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("detection");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  // Initialize canvas when the component mounts and image is loaded
  useEffect(() => {
    if (open && imageUrl && editorImgRef.current && canvasRef.current) {
      const img = editorImgRef.current;
      const canvas = canvasRef.current;
      
      // Wait for image to load
      if (img.complete) {
        initializeCanvas();
      } else {
        img.onload = initializeCanvas;
      }
    }
  }, [open, imageUrl, rotation, zoom, brightness, contrast]);
  
  const initializeCanvas = () => {
    if (!editorImgRef.current || !canvasRef.current) return;
    
    const img = editorImgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const containerHeight = canvas.parentElement?.clientHeight || 600;
    
    // Calculate scaled dimensions based on container and zoom
    const scale = (zoom / 100);
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    // Set canvas size
    canvas.width = Math.min(containerWidth, scaledWidth);
    canvas.height = Math.min(containerHeight, scaledHeight);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    // Calculate position to center image
    const x = -scaledWidth / 2;
    const y = -scaledHeight / 2;
    
    // Draw the image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    // Restore context
    ctx.restore();
    
    // Draw selected areas
    drawSelectedAreas(ctx);
  };
  
  // Draw all selected areas on the canvas
  const drawSelectedAreas = (ctx: CanvasRenderingContext2D) => {
    if (!ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scale = zoom / 100;
    
    selectedAreas.forEach((area, index) => {
      // Calculate scaled position and size
      const x = (area.x * scale) + (canvas.width / 2 - (editorImgRef.current!.naturalWidth * scale) / 2);
      const y = (area.y * scale) + (canvas.height / 2 - (editorImgRef.current!.naturalHeight * scale) / 2);
      const width = area.width * scale;
      const height = area.height * scale;
      
      // Draw rectangle
      ctx.save();
      ctx.strokeStyle = area.color || '#00FF00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x, y, width, height);
      
      // Add label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y - 20, 120, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText(`${area.memorabiliaType || 'Face'} #${index + 1}`, x + 5, y - 5);
      
      ctx.restore();
    });
  };
  
  // Run detection on the current image
  const runDetection = async () => {
    if (!editorImgRef.current) return;
    
    setIsDetecting(true);
    toast.info("Detecting items in image...");
    
    try {
      // Determine detection types based on the selected mode
      const detectionTypes: MemorabiliaType[] = 
        detectionType === 'face' || detectionType === 'group' ? ['face'] :
        detectionType === 'memorabilia' ? ['card', 'ticket', 'program', 'autograph'] :
        ['face', 'card', 'ticket', 'program', 'autograph'];
      
      // This is where we would call the actual detection API
      // For now, simulate detection with some reasonable boxes
      const detectedItems: EnhancedCropBoxProps[] = [];
      
      const img = editorImgRef.current;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      // Simulate face detection with grid arrangement
      if (detectionTypes.includes('face')) {
        const faceCount = Math.floor(Math.random() * 6) + 2; // 2-7 faces
        const gridColumns = Math.ceil(Math.sqrt(faceCount));
        const cellWidth = imgWidth / gridColumns;
        const cellHeight = imgHeight / gridColumns;
        
        for (let i = 0; i < faceCount; i++) {
          const row = Math.floor(i / gridColumns);
          const col = i % gridColumns;
          
          // Add some randomness to position within cell
          const offsetX = cellWidth * 0.1 * (Math.random() - 0.5);
          const offsetY = cellHeight * 0.1 * (Math.random() - 0.5);
          
          // Face size is proportional to cell but with some variation
          const faceWidth = cellWidth * (0.7 + Math.random() * 0.2);
          const faceHeight = faceWidth * 1.3; // approx face proportions
          
          detectedItems.push({
            id: detectedItems.length + 1,
            x: col * cellWidth + offsetX + cellWidth * 0.15,
            y: row * cellHeight + offsetY + cellHeight * 0.1,
            width: faceWidth,
            height: faceHeight,
            rotation: Math.random() * 10 - 5, // slight random rotation
            color: '#FF5733',
            memorabiliaType: 'face',
            confidence: 0.75 + (Math.random() * 0.2)
          });
        }
      }
      
      // Simulate memorabilia detection if selected
      if (detectionTypes.some(type => ['card', 'ticket', 'program', 'autograph'].includes(type))) {
        // Place a card in the center lower part
        detectedItems.push({
          id: detectedItems.length + 1,
          x: imgWidth * 0.3,
          y: imgHeight * 0.6,
          width: imgWidth * 0.4,
          height: imgWidth * 0.4 * 1.4, // Card aspect ratio
          rotation: 0,
          color: '#33FF57',
          memorabiliaType: 'card',
          confidence: 0.9
        });
        
        // Add a ticket
        if (detectionTypes.includes('ticket')) {
          detectedItems.push({
            id: detectedItems.length + 1,
            x: imgWidth * 0.1,
            y: imgHeight * 0.3,
            width: imgWidth * 0.3,
            height: imgWidth * 0.15,
            rotation: 3,
            color: '#3357FF',
            memorabiliaType: 'ticket',
            confidence: 0.85
          });
        }
      }
      
      // Set the detected areas
      setSelectedAreas(detectedItems);
      toast.success(`Detected ${detectedItems.length} items in image`);
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Error detecting items in image");
    } finally {
      setIsDetecting(false);
    }
  };
  
  // Apply image enhancements
  const enhanceImage = () => {
    if (!canvasRef.current || !editorImgRef.current) return;
    
    // For now, we'll just simulate enhancement by adjusting brightness and contrast
    setBrightness(brightness => Math.min(130, brightness + 10));
    setContrast(contrast => Math.min(120, contrast + 15));
    
    toast.success("Image enhanced for stadium lighting conditions");
  };
  
  // Process selected areas
  const processSelectedAreas = async () => {
    if (!canvasRef.current || !editorImgRef.current || !originalFile) {
      toast.error("Missing image data");
      return;
    }
    
    if (selectedAreas.length === 0) {
      toast.error("No areas selected for processing");
      return;
    }
    
    setIsProcessing(true);
    toast.info(`Processing ${selectedAreas.length} selected areas...`);
    
    try {
      const processedFiles: File[] = [];
      const processedUrls: string[] = [];
      const types: MemorabiliaType[] = [];
      
      // Create a temporary canvas for processing each area
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error("Could not create temporary canvas");
      
      // Process each selected area
      for (const area of selectedAreas) {
        // Set dimensions for extracted area
        tempCanvas.width = area.width;
        tempCanvas.height = area.height;
        
        // Clear canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the selected portion of the image
        tempCtx.drawImage(
          editorImgRef.current,
          area.x, area.y, area.width, area.height,
          0, 0, area.width, area.height
        );
        
        // If auto-enhance is enabled, apply enhancement based on type
        if (autoEnhance) {
          // Simplified enhancement for demo - in production this would be more sophisticated
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          const data = imageData.data;
          
          // Basic enhancement by type
          if (area.memorabiliaType === 'face') {
            // Brighten slightly and warm the tones for faces (stadium lighting correction)
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * 1.1);      // Red (warm)
              data[i+1] = Math.min(255, data[i+1] * 1.05); // Green
              data[i+2] = Math.min(255, data[i+2] * 1.0);  // Blue
            }
          } else {
            // Increase contrast for memorabilia
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));
              data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.2 + 128));
              data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.2 + 128));
            }
          }
          
          tempCtx.putImageData(imageData, 0, 0);
        }
        
        // Convert to file
        const blob = await new Promise<Blob>((resolve) => 
          tempCanvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.92)
        );
        
        // Create file name based on type
        const fileType = area.memorabiliaType || 'image';
        const fileName = `${fileType}_${Date.now()}_${Math.round(Math.random() * 1000)}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        
        // Add to processed results
        processedFiles.push(file);
        processedUrls.push(url);
        types.push(area.memorabiliaType || 'face');
      }
      
      // Call the complete handler with processed images
      onProcessComplete(processedFiles, processedUrls, types);
      
      // Close the editor
      onClose();
      
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Error processing selected areas");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add a new selection area
  const addSelectionArea = () => {
    if (!canvasRef.current || !editorImgRef.current) return;
    
    const canvas = canvasRef.current;
    const img = editorImgRef.current;
    
    // Create a new area in the center
    const newArea: EnhancedCropBoxProps = {
      id: selectedAreas.length + 1,
      x: img.naturalWidth / 2 - 100,
      y: img.naturalHeight / 2 - 100,
      width: 200,
      height: 200,
      rotation: 0,
      color: '#00AAFF',
      memorabiliaType: 'face',
      confidence: 0.5
    };
    
    setSelectedAreas([...selectedAreas, newArea]);
  };
  
  // Reset all adjustments
  const resetAdjustments = () => {
    setZoom(100);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    
    // Re-initialize the canvas
    setTimeout(initializeCanvas, 50);
  };
  
  // Rotate the image
  const rotateImage = (direction: 'clockwise' | 'counterclockwise') => {
    const delta = direction === 'clockwise' ? 90 : -90;
    setRotation(prev => (prev + delta) % 360);
  };
  
  // Filter properties based on the zoom level
  const getZoomButtonProps = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      return {
        onClick: () => setZoom(prev => Math.min(prev + 10, 200)),
        disabled: zoom >= 200
      };
    } else {
      return {
        onClick: () => setZoom(prev => Math.max(prev - 10, 50)),
        disabled: zoom <= 50
      };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {detectionType === 'face' || detectionType === 'group' ? 'Group Photo Processor' : 
             detectionType === 'memorabilia' ? 'Memorabilia Detector' : 
             'Photo Content Detection'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow overflow-hidden">
          {/* Main Editor Area - 3/4 width */}
          <div className="md:col-span-3 flex flex-col overflow-hidden">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-2">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="detection">Detection</TabsTrigger>
                <TabsTrigger value="adjustments">Image Adjustments</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Canvas Container */}
            <div className="relative flex-grow border rounded-md overflow-hidden bg-gray-100">
              {/* Hidden image for reference */}
              <img 
                ref={editorImgRef}
                src={imageUrl || ''}
                alt="Editor reference"
                className="hidden"
              />
              
              {/* Canvas for interactive editing */}
              <canvas 
                ref={canvasRef}
                className="w-full h-full"
              />
              
              {/* Loading overlay */}
              {(isDetecting || isProcessing) && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>{isDetecting ? "Detecting..." : "Processing..."}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Toolbar */}
            <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => rotateImage('counterclockwise')}
                >
                  <RotateCcw size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => rotateImage('clockwise')}
                >
                  <RotateCw size={18} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  {...getZoomButtonProps('out')}
                >
                  <ZoomOut size={18} />
                </Button>
                <span className="mx-1 text-sm">{zoom}%</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  {...getZoomButtonProps('in')}
                >
                  <ZoomIn size={18} />
                </Button>
              </div>
              
              <div>
                {selectedTab === "detection" && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={runDetection}
                      disabled={isDetecting || !imageUrl}
                    >
                      <Users size={18} className="mr-1" />
                      Run Detection
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={addSelectionArea}
                    >
                      <Crop size={18} className="mr-1" />
                      Add Selection
                    </Button>
                  </div>
                )}
                {selectedTab === "adjustments" && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={enhanceImage}
                      disabled={!imageUrl}
                    >
                      <Sun size={18} className="mr-1" />
                      Enhance
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetAdjustments}
                    >
                      <Layers size={18} className="mr-1" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/4 width */}
          <div className="bg-gray-50 p-4 rounded-md flex flex-col overflow-auto">
            {selectedTab === "detection" && (
              <>
                <h3 className="font-medium mb-3 flex items-center justify-between">
                  <span>Detected Areas</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                    {selectedAreas.length}
                  </span>
                </h3>
                
                <div className="overflow-auto flex-grow">
                  {selectedAreas.length > 0 ? (
                    <div className="space-y-3">
                      {selectedAreas.map((area, index) => (
                        <div 
                          key={index}
                          className="p-2 bg-white rounded-md border shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{area.memorabiliaType || 'Face'} #{index + 1}</span>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => {
                                  const updatedAreas = [...selectedAreas];
                                  updatedAreas.splice(index, 1);
                                  setSelectedAreas(updatedAreas);
                                }}
                              >
                                <span className="sr-only">Remove</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(area.width)} x {Math.round(area.height)} px
                          </div>
                          <div className="text-xs text-gray-500">
                            Confidence: {Math.round(area.confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Layers className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>No areas detected</p>
                      <p className="text-xs">Click "Run Detection" to find faces and items</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Toggle
                    pressed={autoEnhance}
                    onPressedChange={setAutoEnhance}
                    className="w-full justify-between px-3 mb-4"
                  >
                    <div className="flex items-center">
                      <Sunset size={16} className="mr-2" />
                      Stadium Light Enhancement
                    </div>
                  </Toggle>
                  
                  <Button 
                    className="w-full" 
                    disabled={selectedAreas.length === 0 || isProcessing}
                    onClick={processSelectedAreas}
                  >
                    <Maximize2 size={18} className="mr-2" />
                    Process {selectedAreas.length} Selected Areas
                  </Button>
                </div>
              </>
            )}
            
            {selectedTab === "adjustments" && (
              <>
                <h3 className="font-medium mb-4">Image Adjustments</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <Slider 
                      value={[brightness]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) => setBrightness(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <Slider 
                      value={[contrast]}
                      min={50}
                      max={150}
                      step={1}
                      onValueChange={(value) => setContrast(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rotation</span>
                      <span>{rotation}°</span>
                    </div>
                    <Slider 
                      value={[rotation]}
                      min={-180}
                      max={180}
                      step={1}
                      onValueChange={(value) => setRotation(value[0])}
                    />
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Button 
                    onClick={enhanceImage}
                    className="w-full"
                    variant="outline"
                  >
                    <Sun size={18} className="mr-2" />
                    Auto-Enhance for Stadium Lighting
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={processSelectedAreas}
            disabled={selectedAreas.length === 0 || isProcessing}
          >
            Process Selected ({selectedAreas.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchImageEditor;
