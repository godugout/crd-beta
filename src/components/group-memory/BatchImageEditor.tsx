
import React, { useRef, useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedCropBoxProps, MemorabiliaType } from '../card-upload/cardDetection';
import { toast } from 'sonner';

import { useBatchImageProcessing } from './hooks/useBatchImageProcessing';
import { useCanvasManager } from './hooks/useCanvasManager';
import DetectionPanel from './components/DetectionPanel';
import AdjustmentsPanel from './components/AdjustmentsPanel';
import EditorToolbar from './components/EditorToolbar';

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
  const [selectedAreas, setSelectedAreas] = useState<EnhancedCropBoxProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("detection");
  const [autoEnhance, setAutoEnhance] = useState<boolean>(true);

  // Use our custom hooks for processing and canvas management
  const {
    isDetecting,
    isProcessing,
    runDetection,
    processSelectedAreas
  } = useBatchImageProcessing({ onProcessComplete });
  
  const {
    zoom,
    setZoom,
    rotation,
    setRotation,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    enhanceImage,
    rotateImage,
    resetAdjustments
  } = useCanvasManager({
    canvasRef,
    editorImgRef,
    selectedAreas
  });
  
  // Run detection on the current image
  const handleRunDetection = async () => {
    if (!editorImgRef.current) return;
    const detectedItems = await runDetection(editorImgRef, detectionType);
    setSelectedAreas(detectedItems);
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
  
  // Remove an area by index
  const removeArea = (index: number) => {
    const updatedAreas = [...selectedAreas];
    updatedAreas.splice(index, 1);
    setSelectedAreas(updatedAreas);
  };
  
  // Handle image enhancement
  const handleEnhanceImage = () => {
    const success = enhanceImage();
    if (success) {
      toast.success("Image enhanced for stadium lighting conditions");
    }
  };
  
  // Process selected areas
  const handleProcessSelectedAreas = async () => {
    if (!originalFile) return;
    
    const result = await processSelectedAreas(
      selectedAreas,
      editorImgRef,
      originalFile,
      autoEnhance
    );
    
    if (result?.success) {
      onClose();
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
            <EditorToolbar
              zoom={zoom}
              onZoomIn={() => setZoom(z => Math.min(z + 10, 200))}
              onZoomOut={() => setZoom(z => Math.max(z - 10, 50))}
              onRotateClockwise={() => rotateImage('clockwise')}
              onRotateCounterClockwise={() => rotateImage('counterclockwise')}
              selectedTab={selectedTab}
              onRunDetection={handleRunDetection}
              onAddSelection={addSelectionArea}
              onEnhanceImage={handleEnhanceImage}
              onResetAdjustments={resetAdjustments}
              isDetecting={isDetecting}
              imageUrl={imageUrl}
            />
          </div>
          
          {/* Sidebar - 1/4 width */}
          <div className="bg-gray-50 p-4 rounded-md flex flex-col overflow-auto">
            {selectedTab === "detection" && (
              <DetectionPanel
                selectedAreas={selectedAreas}
                autoEnhance={autoEnhance}
                setAutoEnhance={setAutoEnhance}
                onRunDetection={handleRunDetection}
                onAddSelection={addSelectionArea}
                onProcessAreas={handleProcessSelectedAreas}
                onRemoveArea={removeArea}
                isDetecting={isDetecting}
                isProcessing={isProcessing}
              />
            )}
            
            {selectedTab === "adjustments" && (
              <AdjustmentsPanel
                brightness={brightness}
                setBrightness={setBrightness}
                contrast={contrast}
                setContrast={setContrast}
                rotation={rotation}
                setRotation={setRotation}
                onEnhanceImage={handleEnhanceImage}
                onResetAdjustments={resetAdjustments}
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleProcessSelectedAreas}
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
