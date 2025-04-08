
import React from 'react';
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
import EditorContent from './EditorContent';
import BatchProcessingPanel from '../components/BatchProcessingPanel';
import ExtractionPanel from '../components/ExtractionPanel';
import { MemorabiliaType } from '../cardDetection';
import { useImageEditorState } from './hooks/useImageEditorState';

interface ImageEditorDialogProps {
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

const ImageEditorDialog: React.FC<ImageEditorDialogProps> = ({
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
  const {
    canvasRef,
    editorImgRef,
    cropBoxes,
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    imageData,
    batchSelections,
    setBatchSelections,
    detectedCards,
    setDetectedCards,
    stagedCards,
    stageSelectedCrop,
    selectStagedCard,
    removeStagedCard,
    handleMemorabiliaTypeChange,
    handleStageSelectedCrop,
    handleBatchProcess,
    rotateImage,
    rotateClockwise,
    rotateCounterClockwise,
    addNewCropBox,
    removeCropBox,
    maximizeCrop
  } = useImageEditorState({
    onCropComplete,
    currentFile,
    setShowEditor,
    onBatchProcessComplete,
    autoEnhance,
    enabledMemorabiliaTypes
  });

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
              onRotateImage={() => rotateImage('clockwise')}
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

export default ImageEditorDialog;
