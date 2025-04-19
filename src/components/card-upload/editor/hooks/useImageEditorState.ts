
import { useRef, useState } from 'react';
import { useCropState } from '../../hooks/useCropState';
import { useEditor } from '../../hooks/useEditor';
import { useCropBoxOperations } from '../../hooks/useCropBoxOperations';
import { useImageHandling } from '../../hooks/useImageHandling';
import { MemorabiliaType } from '../../cardDetection';
import { EnhancedCropBoxProps } from '../../CropBox';

interface UseImageEditorStateProps {
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType) => void;
  currentFile: File | null;
  setShowEditor: (show: boolean) => void;
  onBatchProcessComplete?: (files: File[], urls: string[], types?: MemorabiliaType[]) => void;
  autoEnhance?: boolean;
  enabledMemorabiliaTypes?: MemorabiliaType[];
}

export const useImageEditorState = ({
  onCropComplete,
  currentFile,
  setShowEditor,
  onBatchProcessComplete,
  autoEnhance = true,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face', 'group', 'unknown']
}: UseImageEditorStateProps) => {
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
    editorImage: currentFile ? URL.createObjectURL(currentFile) : null,
    showEditor: true,
    setImageData,
    setCropBoxes,
    setDetectedCards,
    setSelectedCropIndex,
    canvasRef,
    editorImgRef,
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

  return {
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
  };
};
