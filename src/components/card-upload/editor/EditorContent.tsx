
import React from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '../cardDetection';
import { ImageData } from '../hooks/useCropState';
import EditorCanvas from '../EditorCanvas';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Maximize2,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="relative border rounded-lg overflow-hidden bg-gray-100 h-full flex flex-col">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={editorImage || ''} 
        alt="Editor reference" 
        className="hidden"
        crossOrigin="anonymous"
      />
      
      <div className="flex-grow relative">
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
              <Badge className="bg-blue-500 text-white">
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
        
        <div className="absolute bottom-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-lg p-1 space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onRotateImage}
            title="Rotate Image 90°"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8" 
            onClick={onMaximizeCrop}
            title="Fit to Card Dimensions"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-muted/30 border-t p-2 flex flex-wrap justify-between gap-2">
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddCropBox}
            title="Add Crop Box"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Box
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRemoveCropBox}
            disabled={selectedCropIndex < 0}
            title="Remove Selected Crop Box"
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onClick={onRotateCounterClockwise}
            title="Rotate Selection Counter-Clockwise"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onClick={onRotateClockwise}
            title="Rotate Selection Clockwise"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/10 border-t p-2 flex justify-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>Drag corners to resize • Hold Shift for proportional scaling</span>
        </div>
      </div>
    </div>
  );
};

export default EditorContent;
