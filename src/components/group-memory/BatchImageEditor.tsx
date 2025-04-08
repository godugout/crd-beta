
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import EditorCanvas from './components/EditorCanvas';
import { useEditorState } from './hooks/useEditorState';
import { useCanvasManager } from './hooks/useCanvasManager';
import { useBatchImageProcessing } from './hooks/useBatchImageProcessing';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useConnectivity } from '@/hooks/useConnectivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdjustmentsPanel from './components/AdjustmentsPanel';
import DetectionPanel from './components/DetectionPanel';

interface BatchImageEditorProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  originalFile: File | null;
  onProcessComplete: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  detectionType?: 'group' | 'memorabilia' | 'mixed';
}

const BatchImageEditor: React.FC<BatchImageEditorProps> = ({
  open,
  onClose,
  imageUrl,
  originalFile,
  onProcessComplete,
  detectionType = 'group'
}) => {
  const isMobile = useIsMobile();
  const { isOnline } = useConnectivity();
  
  // Editor canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  
  // Editor state
  const {
    selectedAreas,
    setSelectedAreas,
    activePanel,
    setActivePanel,
    isDetecting,
    setIsDetecting,
    isProcessing,
    setIsProcessing
  } = useEditorState({ detectionType });
  
  // Canvas interaction handlers
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
    rotation,
    setRotation,
    rotateImage,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    enhanceImage,
    resetAdjustments
  } = useCanvasManager({
    canvasRef,
    editorImgRef,
    selectedAreas
  });
  
  // Batch processing
  const {
    detectObjects,
    processDetections,
    extractSelectedAreas,
    getPreviewUrls
  } = useBatchImageProcessing({
    canvasRef,
    editorImgRef,
    selectedAreas,
    detectionType,
    setSelectedAreas,
    setIsDetecting,
    setIsProcessing
  });
  
  // Run detection when image loads
  useEffect(() => {
    if (open && imageUrl && originalFile && canvasRef.current && editorImgRef.current) {
      // Wait for image to load before detecting
      const img = editorImgRef.current;
      if (img.complete) {
        detectObjects();
      } else {
        img.onload = () => detectObjects();
      }
    }
  }, [open, imageUrl, originalFile]);
  
  // Handle completion
  const handleComplete = async () => {
    if (!originalFile || !canvasRef.current) return;
    
    try {
      setIsProcessing(true);
      
      // Extract all selected areas
      const extractedFiles = await extractSelectedAreas();
      
      // Get preview URLs for extracted areas
      const extractedUrls = getPreviewUrls();
      
      // Get types for the extracted areas
      const extractedTypes = selectedAreas.map(area => area.memorabiliaType);
      
      // If offline and using offline storage, let the user know
      if (!isOnline) {
        console.log('Processing in offline mode');
      }
      
      onProcessComplete(extractedFiles, extractedUrls, extractedTypes);
    } catch (error) {
      console.error('Error completing batch processing:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };
  
  // This function will process a single area for preview
  const handleProcessSingleArea = async (index: number) => {
    if (!originalFile || !canvasRef.current) return;
    
    try {
      setIsProcessing(true);
      
      // Extract all selected areas
      const extractedFiles = await extractSelectedAreas([index]);
      const extractedUrls = getPreviewUrls([index]);
      const extractedTypes = [selectedAreas[index].memorabiliaType].filter(Boolean) as MemorabiliaType[];
      
      onProcessComplete(extractedFiles, extractedUrls, extractedTypes);
    } catch (error) {
      console.error('Error processing single area:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-[80vh]">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Batch Editor - {selectedAreas.length} areas detected
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={detectObjects}
                disabled={isDetecting}
              >
                {isDetecting ? "Detecting..." : "Re-detect"}
              </Button>
              <Tabs value={activePanel} onValueChange={setActivePanel}>
                <TabsList>
                  <TabsTrigger value="detect">Detection</TabsTrigger>
                  <TabsTrigger value="adjust">Adjustments</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-3/4 h-1/2 md:h-full p-4 flex flex-col">
              <EditorCanvas 
                canvasRef={canvasRef}
                editorImgRef={editorImgRef}
                imageUrl={imageUrl}
                selectedAreas={selectedAreas}
                isDetecting={isDetecting}
                isProcessing={isProcessing}
                handlePointerDown={handlePointerDown}
                handlePointerMove={handlePointerMove}
                handlePointerUp={handlePointerUp}
              />
              
              {/* Mobile toolbar for common operations */}
              {isMobile && (
                <div className="flex justify-between items-center mt-2 px-1 py-2 bg-gray-50 rounded-md">
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>-</Button>
                  <span className="text-xs">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>+</Button>
                  <Button variant="outline" size="sm" onClick={() => rotateImage('counterclockwise')}>↺</Button>
                  <Button variant="outline" size="sm" onClick={() => rotateImage('clockwise')}>↻</Button>
                  <Button variant="outline" size="sm" onClick={enhanceImage}>✨</Button>
                  <Button variant="outline" size="sm" onClick={resetAdjustments}>Reset</Button>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/4 h-1/2 md:h-full border-t md:border-t-0 md:border-l p-4 overflow-auto">
              <Tabs value={activePanel} className="w-full">
                <TabsContent value="detect" className="mt-0">
                  <DetectionPanel 
                    selectedAreas={selectedAreas}
                    onProcessArea={handleProcessSingleArea}
                  />
                </TabsContent>
                <TabsContent value="adjust" className="mt-0">
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleComplete} 
              disabled={selectedAreas.length === 0 || isProcessing}
            >
              {isProcessing 
                ? 'Processing...' 
                : `Process ${selectedAreas.length} Items`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchImageEditor;
