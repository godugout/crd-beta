import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { detectCardsInImage, MemorabiliaType, EnhancedCropBoxProps } from '../cardDetection';
import { StagedCardProps } from '../hooks/useEditor';
import { ExtendedCanvas, asExtendedCanvas } from '@/types/extendedCanvas';

interface ImageEditorDialogProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType, metadata?: any) => void;
  batchProcessingMode?: boolean;
  onBatchProcessComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  autoEnhance?: boolean;
}

const ImageEditorDialog: React.FC<ImageEditorDialogProps> = ({
  showEditor,
  setShowEditor,
  editorImage,
  currentFile,
  onCropComplete,
  batchProcessingMode = false,
  onBatchProcessComplete,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph'],
  autoEnhance = true
}) => {
  const [activeTab, setActiveTab] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedAreas, setDetectedAreas] = useState<EnhancedCropBoxProps[]>([]);
  const [selectedBox, setSelectedBox] = useState<EnhancedCropBoxProps | null>(null);
  const [stagedCards, setStagedCards] = useState<StagedCardProps[]>([]);
  const [selectedType, setSelectedType] = useState<MemorabiliaType>('card');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reset state when editor is opened
  useEffect(() => {
    if (showEditor) {
      setActiveTab('auto');
      setDetectedAreas([]);
      setSelectedBox(null);
      setStagedCards([]);
    }
  }, [showEditor]);
  
  // Run detection when image is loaded
  useEffect(() => {
    if (showEditor && editorImage && editorImgRef.current) {
      const img = editorImgRef.current;
      
      if (img.complete) {
        runDetection();
      } else {
        img.onload = runDetection;
      }
    }
  }, [showEditor, editorImage]);
  
  const runDetection = async () => {
    if (!editorImgRef.current) return;
    
    setIsLoading(true);
    try {
      const detections = await detectCardsInImage({
        imageElement: editorImgRef.current,
        debugMode: true,
        canvas: debugCanvasRef.current,
        enabledTypes: enabledMemorabiliaTypes,
        minimumConfidence: 0.7
      });
      
      setDetectedAreas(detections);
      
      // Auto-select the first detection with highest confidence
      if (detections.length > 0) {
        const bestDetection = [...detections].sort((a, b) => 
          (b.confidence || 0) - (a.confidence || 0)
        )[0];
        setSelectedBox(bestDetection);
      }
    } catch (error) {
      console.error('Detection error:', error);
      toast.error('Failed to detect items in image');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBoxSelect = (box: EnhancedCropBoxProps) => {
    setSelectedBox(box);
  };
  
  const handleCropComplete = async () => {
    if (!selectedBox || !currentFile || !editorImgRef.current || !cropCanvasRef.current) {
      toast.error('Please select an area to crop');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a temporary canvas for the crop
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      // Set canvas dimensions to crop box size
      tempCanvas.width = selectedBox.width;
      tempCanvas.height = selectedBox.height;
      
      // Draw cropped region to canvas
      ctx.drawImage(
        editorImgRef.current,
        selectedBox.x, selectedBox.y, selectedBox.width, selectedBox.height,
        0, 0, selectedBox.width, selectedBox.height
      );
      
      // Convert to blob and create a file
      const blob = await new Promise<Blob>((resolve) => 
        tempCanvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.95)
      );
      
      const file = new File(
        [blob], 
        `cropped-${currentFile.name || 'image'}.jpg`, 
        { type: 'image/jpeg' }
      );
      
      const url = URL.createObjectURL(blob);
      
      // Create extended canvas with file and url properties
      const extendedCanvas = asExtendedCanvas(tempCanvas);
      extendedCanvas.file = file;
      extendedCanvas.url = url;
      extendedCanvas.metadata = {
        type: selectedType || selectedBox.memorabiliaType,
        confidence: selectedBox.confidence,
        dimensions: {
          width: selectedBox.width,
          height: selectedBox.height,
          aspectRatio: selectedBox.width / selectedBox.height
        }
      };
      
      // Pass the cropped image back to the parent component
      onCropComplete(
        file, 
        url, 
        selectedType || selectedBox.memorabiliaType,
        extendedCanvas.metadata
      );
      
      setShowEditor(false);
    } catch (error) {
      console.error('Crop error:', error);
      toast.error('Failed to crop image');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBatchProcess = async () => {
    if (!batchProcessingMode || !onBatchProcessComplete || detectedAreas.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const files: File[] = [];
      const urls: string[] = [];
      const types: MemorabiliaType[] = [];
      
      // Process each detected area
      for (const box of detectedAreas) {
        if (!currentFile || !editorImgRef.current) continue;
        
        // Create a temporary canvas for the crop
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        
        if (!ctx) continue;
        
        // Set canvas dimensions to crop box size
        tempCanvas.width = box.width;
        tempCanvas.height = box.height;
        
        // Draw cropped region to canvas
        ctx.drawImage(
          editorImgRef.current,
          box.x, box.y, box.width, box.height,
          0, 0, box.width, box.height
        );
        
        // Convert to blob and create a file
        const blob = await new Promise<Blob>((resolve) => 
          tempCanvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.95)
        );
        
        const file = new File(
          [blob], 
          `batch-${files.length}-${currentFile.name || 'image'}.jpg`, 
          { type: 'image/jpeg' }
        );
        
        const url = URL.createObjectURL(blob);
        
        files.push(file);
        urls.push(url);
        types.push(box.memorabiliaType || 'card');
      }
      
      if (files.length > 0) {
        onBatchProcessComplete(files, urls, types);
        setShowEditor(false);
      } else {
        toast.error('No valid items to process');
      }
    } catch (error) {
      console.error('Batch processing error:', error);
      toast.error('Failed to process images in batch');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderDetectionOverlay = () => {
    if (detectedAreas.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          {isLoading ? 'Detecting items...' : 'No items detected'}
        </div>
      );
    }
    
    return (
      <div className="absolute inset-0">
        {detectedAreas.map((box, index) => (
          <div
            key={index}
            className={`absolute border-2 ${
              selectedBox && selectedBox.id === box.id
                ? 'border-blue-500'
                : 'border-yellow-300'
            } cursor-pointer`}
            style={{
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              transform: box.rotation ? `rotate(${box.rotation}deg)` : undefined
            }}
            onClick={() => handleBoxSelect(box)}
          >
            <div className="absolute -top-6 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {box.memorabiliaType || 'Unknown'} ({Math.round((box.confidence || 0) * 100)}%)
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Dialog open={showEditor} onOpenChange={setShowEditor}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="auto">Auto-Detect</TabsTrigger>
            <TabsTrigger value="manual">Manual Selection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto" className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden" style={{ height: '60vh' }}>
              {/* Original image with detection overlay */}
              <div className="relative w-full h-full overflow-auto">
                {editorImage && (
                  <img
                    ref={editorImgRef}
                    src={editorImage}
                    alt="Editor"
                    className="max-w-none"
                  />
                )}
                {renderDetectionOverlay()}
              </div>
              
              {/* Debug canvas (hidden) */}
              <canvas
                ref={debugCanvasRef}
                className="hidden"
              />
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Item Type:</span>
                {enabledMemorabiliaTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowEditor(false)}
                >
                  Cancel
                </Button>
                
                <div className="space-x-2">
                  {batchProcessingMode && (
                    <Button
                      onClick={handleBatchProcess}
                      disabled={isLoading || detectedAreas.length === 0}
                    >
                      Process All ({detectedAreas.length})
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleCropComplete}
                    disabled={isLoading || !selectedBox}
                  >
                    {isLoading ? 'Processing...' : 'Crop Selected'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden" style={{ height: '60vh' }}>
              {/* Manual crop interface */}
              <div className="relative w-full h-full overflow-auto">
                {editorImage && (
                  <img
                    src={editorImage}
                    alt="Manual Crop"
                    className="max-w-none"
                  />
                )}
                {/* Manual crop overlay would go here */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  Manual crop functionality not implemented
                </div>
              </div>
              
              <canvas
                ref={cropCanvasRef}
                className="hidden"
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </Button>
              
              <Button
                onClick={() => toast.info('Manual crop not implemented')}
                disabled={true}
              >
                Apply Crop
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditorDialog;
