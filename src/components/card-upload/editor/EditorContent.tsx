
import React from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';
import { ImageData } from '../hooks/useCropState';
import EditorCanvas from '../EditorCanvas';
import EditorToolbar from '../EditorToolbar';
import ImageRotateButton from '../components/ImageRotateButton';
import { Badge } from '@/components/ui/badge';
import MemorabiliaTypeIndicator from '../MemorabiliaTypeIndicator';

interface EditorContentProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  editorImgRef: React.RefObject<HTMLImageElement>;
  cropBoxes: EnhancedCropBoxProps[];
  setCropBoxes: React.Dispatch<React.SetStateAction<EnhancedCropBoxProps[]>>;
  selectedCropIndex: number;
  setSelectedCropIndex: (index: number) => void;
  imageData: ImageData;
  onRotateImage: () => void;
  onMaximizeCrop: () => void;
  onAddCropBox: () => void;
  onRemoveCropBox: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  onMemorabiliaTypeChange?: (index: number, type: MemorabiliaType) => void;
  editorImage?: string | null;
  batchMode?: boolean;
  batchSelections?: number[];
  onToggleBatchSelection?: (index: number) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  canvasRef,
  editorImgRef,
  cropBoxes,
  setCropBoxes,
  selectedCropIndex,
  setSelectedCropIndex,
  imageData,
  onRotateImage,
  onMaximizeCrop,
  onAddCropBox,
  onRemoveCropBox,
  onRotateClockwise,
  onRotateCounterClockwise,
  onMemorabiliaTypeChange,
  editorImage,
  batchMode = false,
  batchSelections = [],
  onToggleBatchSelection
}) => {
  return (
    <div className="relative border rounded-lg overflow-hidden bg-gray-100 h-full">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={editorImage || ''} 
        alt="Editor reference" 
        className="hidden"
      />
      
      <EditorCanvas
        canvasRef={canvasRef}
        cropBoxes={cropBoxes}
        setCropBoxes={setCropBoxes}
        selectedCropIndex={selectedCropIndex}
        setSelectedCropIndex={setSelectedCropIndex}
        imageData={imageData}
        editorImgRef={editorImgRef}
        batchMode={batchMode}
        batchSelections={batchSelections}
        onToggleBatchSelection={onToggleBatchSelection}
        onMemorabiliaTypeChange={onMemorabiliaTypeChange}
      />
      
      {batchMode && cropBoxes.length > 0 && (
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            {cropBoxes.length} items detected
          </Badge>
          {batchSelections && batchSelections.length > 0 && (
            <Badge className="bg-cardshow-blue">
              {batchSelections.length} selected
            </Badge>
          )}
        </div>
      )}
      
      {/* Show memorabilia type indicator for selected item */}
      {!batchMode && cropBoxes?.[selectedCropIndex] && (
        <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1">
          <MemorabiliaTypeIndicator
            type={cropBoxes[selectedCropIndex].memorabiliaType || 'unknown'}
            confidence={cropBoxes[selectedCropIndex].confidence || 0.7}
          />
        </div>
      )}
      
      <ImageRotateButton onRotate={onRotateImage} />
      
      <EditorToolbar 
        onMaximizeCrop={onMaximizeCrop}
        onAddCropBox={onAddCropBox}
        onRemoveCropBox={onRemoveCropBox}
        onRotateClockwise={onRotateClockwise}
        onRotateCounterClockwise={onRotateCounterClockwise}
        batchMode={batchMode}
      />
    </div>
  );
};

export default EditorContent;
