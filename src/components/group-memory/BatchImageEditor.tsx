
import React, { useRef } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemorabiliaType } from '../card-upload/cardDetection';

import { useBatchImageProcessing } from './hooks/useBatchImageProcessing';
import { useCanvasManager } from './hooks/useCanvasManager';
import { useEditorState } from './hooks/useEditorState';
import DetectionPanel from './components/DetectionPanel';
import AdjustmentsPanel from './components/AdjustmentsPanel';
import EditorToolbar from './components/EditorToolbar';
import EditorCanvas from './components/EditorCanvas';

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

  // Use our custom hooks for processing and canvas management
  const {
    isDetecting,
    isProcessing,
    runDetection,
    processSelectedAreas
  } = useBatchImageProcessing({ onProcessComplete });
  
  const {
    selectedAreas,
    setSelectedAreas,
    selectedTab,
    setSelectedTab,
    autoEnhance,
    setAutoEnhance,
    addSelectionArea,
    removeArea
  } = useEditorState({ isDetecting, isProcessing });
  
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
  
  // Handle adding a new selection area
  const handleAddSelectionArea = () => {
    addSelectionArea(canvasRef, editorImgRef);
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
            <EditorCanvas
              canvasRef={canvasRef}
              editorImgRef={editorImgRef}
              imageUrl={imageUrl}
              selectedAreas={selectedAreas}
              isDetecting={isDetecting}
              isProcessing={isProcessing}
            />
            
            {/* Bottom Toolbar */}
            <EditorToolbar
              zoom={zoom}
              onZoomIn={() => setZoom(z => Math.min(z + 10, 200))}
              onZoomOut={() => setZoom(z => Math.max(z - 10, 50))}
              onRotateClockwise={() => rotateImage('clockwise')}
              onRotateCounterClockwise={() => rotateImage('counterclockwise')}
              selectedTab={selectedTab}
              onRunDetection={handleRunDetection}
              onAddSelection={handleAddSelectionArea}
              onEnhanceImage={enhanceImage}
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
                onAddSelection={handleAddSelectionArea}
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
                onEnhanceImage={enhanceImage}
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
