
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
import { useCropState } from './hooks/useCropState';
import { useEditor } from './hooks/useEditor';
import { useCropBoxOperations } from './hooks/useCropBoxOperations';
import { useImageHandling } from './hooks/useImageHandling';
import EditorContent from './components/EditorContent';
import { MemorabiliaType } from './cardDetection';
import BatchProcessingPanel from './components/BatchProcessingPanel';
import ExtractionPanel from './components/ExtractionPanel';

interface ImageEditorProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType) => void;
  batchProcessingMode?: boolean;
  onBatchProcessComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  autoEnhance?: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  showEditor,
  setShowEditor,
  editorImage,
  currentFile,
  onCropComplete,
  batchProcessingMode = false,
  onBatchProcessComplete,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face', 'unknown'],
  autoEnhance = true
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
    setShowEditor,
    autoEnhance 
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
    batchProcessingMode,
    enabledMemorabiliaTypes
  });

  // Handle memorabilia type changes
  const handleMemorabiliaTypeChange = (index: number, type: MemorabiliaType) => {
    setCropBoxes(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          memorabiliaType: type
        };
      }
      return updated;
    });
  };

  // Handler to extract the selected crop
  const handleStageSelectedCrop = async () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const selectedBox = cropBoxes[selectedCropIndex];
      await stageSelectedCrop(
        selectedBox, 
        canvasRef, 
        editorImgRef, 
        selectedBox.memorabiliaType
      );
    }
  };

  // Process all selected crops for batch processing
  const handleBatchProcess = async () => {
    if (!onBatchProcessComplete) return;
    
    const files: File[] = [];
    const urls: string[] = [];
    const types: MemorabiliaType[] = [];
    
    // If no specific selections, use all detected cards
    const selectionsToProcess = batchSelections.length > 0 
      ? batchSelections 
      : cropBoxes.map((_, index) => index);
    
    // Process each selected crop
    for (const index of selectionsToProcess) {
      if (index >= 0 && index < cropBoxes.length) {
        const cropBox = cropBoxes[index];
        const memorabiliaType = cropBox.memorabiliaType || 'face';
        const result = await stageSelectedCrop(cropBox, canvasRef, editorImgRef, memorabiliaType, false);
        
        if (result && result.file && result.url) {
          files.push(result.file);
          urls.push(result.url);
          types.push(memorabiliaType);
        }
      }
    }
    
    if (files.length > 0) {
      onBatchProcessComplete(files, urls, types);
      setShowEditor(false);
    }
  };

  // Function for handling image rotation
  const handleRotateImage = () => {
    rotateImage('clockwise');
  };

  return (
    <Dialog open={showEditor} onOpenChange={setShowEditor}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {batchProcessingMode 
              ? 'Batch People Detection' 
              : 'Memorabilia Detector & Enhancer'}
          </DialogTitle>
          <DialogDescription>
            {batchProcessingMode 
              ? 'Select and adjust multiple detection areas to create individual cards from your image'
              : 'Adjust detection areas to extract and enhance memorabilia items from your image'
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
              onRotateImage={handleRotateImage}
              onMaximizeCrop={maximizeCrop}
              onAddCropBox={addNewCropBox}
              onRemoveCropBox={removeCropBox}
              onRotateClockwise={rotateClockwise}
              onRotateCounterClockwise={rotateCounterClockwise}
              onMemorabiliaTypeChange={handleMemorabiliaTypeChange}
              editorImage={editorImage}
              batchMode={batchProcessingMode}
              batchSelections={batchSelections}
              onToggleBatchSelection={(index) => {
                setBatchSelections(prev => {
                  if (prev.includes(index)) {
                    return prev.filter(i => i !== index);
                  } else {
                    return [...prev, index];
                  }
                });
              }}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={25}>
            {batchProcessingMode ? (
              <BatchProcessingPanel
                cropBoxes={cropBoxes}
                selectedCropIndex={selectedCropIndex}
                setSelectedCropIndex={setSelectedCropIndex}
                batchSelections={batchSelections}
                setBatchSelections={setBatchSelections}
                onBatchProcess={handleBatchProcess}
                onCancel={() => setShowEditor(false)}
              />
            ) : (
              <ExtractionPanel
                cropBoxes={cropBoxes}
                selectedCropIndex={selectedCropIndex}
                stagedCards={stagedCards}
                onMemorabiliaTypeChange={handleMemorabiliaTypeChange}
                onExtractSelected={handleStageSelectedCrop}
                onSelectStagedCard={selectStagedCard}
                onRemoveStagedCard={removeStagedCard}
                onCancel={() => setShowEditor(false)}
                enabledMemorabiliaTypes={enabledMemorabiliaTypes}
                autoEnhance={autoEnhance}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
