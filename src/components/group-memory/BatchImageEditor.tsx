
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';
import EditorCanvas from './components/EditorCanvas';
import EditorToolbar from './components/EditorToolbar';
import DetectionPanel from './components/DetectionPanel';
import AdjustmentsPanel from './components/AdjustmentsPanel';
import { useBatchImageProcessing } from './hooks/useBatchImageProcessing';
import { useEditorState } from './hooks/useEditorState';
import { useCanvasManager } from './hooks/useCanvasManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useConnectivity } from '@/hooks/useConnectivity';

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
    isDetecting,
    isProcessing,
    selectedAreas,
    setSelectedAreas,
    activePanel,
    setActivePanel
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
    setIsDetecting: (value) => useEditorState.getState().setIsDetecting(value),
    setIsProcessing: (value) => useEditorState.getState().setIsProcessing(value)
  });
  
  // Run detection when image loads
  useEffect(() => {
    if (open && imageUrl && originalFile && canvasRef.current && editorImgRef.current) {
      // Wait for image to load before detecting
      const img = editorImgRef.current;
      if (img.complete) {
        detectObjects();
      } else {
        img.onload = detectObjects;
      }
    }
  }, [open, imageUrl, originalFile]);
  
  // Handle completion
  const handleComplete = async () => {
    if (!originalFile || !canvasRef.current) return;
    
    try {
      useEditorState.getState().setIsProcessing(true);
      
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
      useEditorState.getState().setIsProcessing(false);
      onClose();
    }
  };
  
  // This function will process a single area for preview
  const handleProcessSingleArea = async (index: number) => {
    if (!originalFile || !canvasRef.current) return;
    
    try {
      useEditorState.getState().setIsProcessing(true);
      
      // Extract all selected areas
      const extractedFiles = await extractSelectedAreas([index]);
      const extractedUrls = getPreviewUrls([index]);
      const extractedTypes = [selectedAreas[index].memorabiliaType].filter(Boolean) as MemorabiliaType[];
      
      onProcessComplete(extractedFiles, extractedUrls, extractedTypes);
    } catch (error) {
      console.error('Error processing single area:', error);
    } finally {
      useEditorState.getState().setIsProcessing(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-[80vh]">
          <EditorToolbar 
            hasAreas={selectedAreas.length > 0}
            onComplete={handleComplete}
            onClose={onClose}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            onAutoDetect={detectObjects}
            isDetecting={isDetecting}
            isProcessing={isProcessing}
          />
          
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
              {activePanel === 'detect' ? (
                <DetectionPanel 
                  selectedAreas={selectedAreas}
                  setSelectedAreas={setSelectedAreas}
                  onProcessArea={handleProcessSingleArea}
                />
              ) : (
                <AdjustmentsPanel 
                  zoom={zoom}
                  setZoom={setZoom}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  rotation={rotation}
                  setRotation={setRotation}
                  onRotate={rotateImage}
                  brightness={brightness}
                  setBrightness={setBrightness}
                  contrast={contrast}
                  setContrast={setContrast}
                  onEnhance={enhanceImage}
                  onReset={resetAdjustments}
                />
              )}
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
