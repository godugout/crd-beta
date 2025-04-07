
import React, { useRef, useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle 
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { 
  Check,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useCropState } from './hooks/useCropState';
import { useEditor } from './hooks/useEditor';
import { useCropBoxOperations } from './hooks/useCropBoxOperations';
import { useImageHandling } from './hooks/useImageHandling';
import EditorSidebar from './EditorSidebar';
import EditorContent from './components/EditorContent';

interface ImageEditorProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string) => void;
  batchProcessingMode?: boolean;
  onBatchProcessComplete?: (files: File[], urls: string[]) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  showEditor,
  setShowEditor,
  editorImage,
  currentFile,
  onCropComplete,
  batchProcessingMode = false,
  onBatchProcessComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  const [batchSelections, setBatchSelections] = useState<number[]>([]);
  
  // Use our custom hooks for state management
  const {
    cropBoxes, 
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    imageData,
    setImageData,
    detectedCards,
    setDetectedCards
  } = useCropState();

  const {
    stagedCards,
    stageSelectedCrop,
    selectStagedCard,
    removeStagedCard
  } = useEditor({ 
    onCropComplete, 
    currentFile, 
    setShowEditor 
  });

  const {
    rotateClockwise,
    rotateCounterClockwise,
    addNewCropBox,
    removeCropBox,
    maximizeCrop
  } = useCropBoxOperations({
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    canvasRef
  });

  const {
    rotateImage
  } = useImageHandling({
    editorImage,
    showEditor,
    setImageData,
    setCropBoxes,
    setDetectedCards,
    setSelectedCropIndex,
    canvasRef,
    editorImgRef,
    batchProcessingMode
  });

  // Handler to extract the selected crop
  const handleStageSelectedCrop = async () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = cropBoxes[selectedCropIndex];
      await stageSelectedCrop(selectedBox, canvasRef, editorImgRef);
    }
  };

  // Toggle selection for batch processing
  const toggleBatchSelection = (index: number) => {
    setBatchSelections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Process all selected crops for batch processing
  const handleBatchProcess = async () => {
    if (!onBatchProcessComplete) return;
    
    const files: File[] = [];
    const urls: string[] = [];
    
    // If no specific selections, use all detected cards
    const selectionsToProcess = batchSelections.length > 0 
      ? batchSelections 
      : cropBoxes.map((_, index) => index);
    
    // Process each selected crop
    for (const index of selectionsToProcess) {
      if (index >= 0 && index < cropBoxes.length) {
        const cropBox = cropBoxes[index];
        const result = await stageSelectedCrop(cropBox, canvasRef, editorImgRef, false);
        
        if (result && result.file && result.url) {
          files.push(result.file);
          urls.push(result.url);
        }
      }
    }
    
    if (files.length > 0) {
      onBatchProcessComplete(files, urls);
      setShowEditor(false);
    }
  };

  return (
    <Dialog open={showEditor} onOpenChange={setShowEditor}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{batchProcessingMode ? 'Batch Card Detection' : 'Card Image Editor'}</DialogTitle>
          <DialogDescription>
            {batchProcessingMode 
              ? 'Select and adjust multiple detection areas to create individual cards from your image'
              : 'Adjust crop areas to extract trading cards from your image (standard ratio 2.5:3.5)'
            }
          </DialogDescription>
        </DialogHeader>
        
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          <ResizablePanel defaultSize={75}>
            <EditorContent
              canvasRef={canvasRef}
              editorImgRef={editorImgRef}
              cropBoxes={cropBoxes}
              setCropBoxes={setCropBoxes}
              selectedCropIndex={selectedCropIndex}
              setSelectedCropIndex={setSelectedCropIndex}
              imageData={imageData}
              onRotateImage={rotateImage}
              onMaximizeCrop={maximizeCrop}
              onAddCropBox={addNewCropBox}
              onRemoveCropBox={removeCropBox}
              onRotateClockwise={rotateClockwise}
              onRotateCounterClockwise={rotateCounterClockwise}
              editorImage={editorImage}
              batchMode={batchProcessingMode}
              batchSelections={batchSelections}
              onToggleBatchSelection={toggleBatchSelection}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={25}>
            {batchProcessingMode ? (
              <div className="h-full flex flex-col p-4">
                <div className="flex-none mb-4 pb-4 border-b">
                  <h3 className="text-lg font-medium mb-2">Detected Items ({cropBoxes.length})</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {batchSelections.length > 0 
                      ? `${batchSelections.length} items selected` 
                      : "Select specific items or process all"}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setBatchSelections(cropBoxes.map((_, i) => i))}
                      variant="outline"
                      className="text-xs"
                      size="sm"
                    >
                      Select All
                    </Button>
                    <Button 
                      onClick={() => setBatchSelections([])}
                      variant="outline"
                      className="text-xs"
                      size="sm"
                      disabled={batchSelections.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              
                <div className="flex-grow overflow-y-auto">
                  {cropBoxes.map((cropBox, index) => (
                    <div 
                      key={`crop-${index}`}
                      className={`flex items-center p-2 mb-2 rounded ${
                        selectedCropIndex === index 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCropIndex(index)}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 cursor-pointer ${
                          batchSelections.includes(index) 
                            ? 'bg-cardshow-blue text-white' 
                            : 'border-2 border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBatchSelection(index);
                        }}
                      >
                        {batchSelections.includes(index) && <Check className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">Item {index + 1}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(cropBox.width)} x {Math.round(cropBox.height)} px
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex-none pt-4 border-t mt-4">
                  <Button 
                    onClick={handleBatchProcess} 
                    className="w-full mb-2"
                  >
                    Process {batchSelections.length > 0 ? batchSelections.length : 'All'} Items
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowEditor(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <EditorSidebar 
                cropBoxes={cropBoxes}
                selectedCropIndex={selectedCropIndex}
                setSelectedCropIndex={setSelectedCropIndex}
                onExtractCard={handleStageSelectedCrop}
                onCancel={() => setShowEditor(false)}
                stagedCards={stagedCards}
                onSelectStagedCard={selectStagedCard}
                onRemoveStagedCard={removeStagedCard}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
