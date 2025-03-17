
import React, { useRef } from 'react';
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
import EditorSidebar from './EditorSidebar';
import EditorContent from './components/EditorContent';

interface ImageEditorProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  showEditor,
  setShowEditor,
  editorImage,
  currentFile,
  onCropComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  
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
    editorImgRef
  });

  // Handler to extract the selected crop
  const handleStageSelectedCrop = async () => {
    const selectedBox = cropBoxes[selectedCropIndex];
    await stageSelectedCrop(selectedBox, canvasRef, editorImgRef);
  };

  return (
    <Dialog open={showEditor} onOpenChange={setShowEditor}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Card Image Editor</DialogTitle>
          <DialogDescription>
            Adjust crop areas to extract trading cards from your image (standard ratio 2.5:3.5)
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
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={25}>
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
