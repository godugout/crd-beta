
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
    <div className="relative rounded-lg overflow-hidden bg-gray-900 h-full flex flex-col">
      {/* Hidden image for reference */}
      <img 
        ref={editorImgRef}
        src={editorImage || ''} 
        alt="Editor reference" 
        className="hidden"
        crossOrigin="anonymous"
      />
      
      <div className="flex-grow relative bg-black/50">
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
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            <Badge className="bg-blue-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
              {cropBoxes.length} items detected
            </Badge>
            {batchSelections && batchSelections.length > 0 && (
              <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                {batchSelections.length} selected
              </Badge>
            )}
          </div>
        )}
        
        {/* Show memorabilia type indicator for selected item */}
        {!batchMode && cropBoxes?.[selectedCropIndex] && (
          <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <MemorabiliaTypeIndicator
              type={cropBoxes[selectedCropIndex].memorabiliaType || 'unknown'}
              confidence={cropBoxes[selectedCropIndex].confidence || 0.7}
            />
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-2 flex gap-1 border border-white/20">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onRotateImage}
            title="Rotate Image 90°"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20" 
            onClick={onMaximizeCrop}
            title="Fit to Card Dimensions (2.5:3.5 ratio)"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-t border-white/10 p-3 flex flex-wrap justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddCropBox}
            title="Add Crop Box"
            className="h-8 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
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
            className="h-8 bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
            onClick={onRotateCounterClockwise}
            title="Rotate Selection Counter-Clockwise"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
            onClick={onRotateClockwise}
            title="Rotate Selection Clockwise"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-800/60 border-t border-white/10 p-2 flex justify-center">
        <div className="flex items-center text-xs text-gray-300">
          <Info className="h-3 w-3 mr-1 text-blue-400" />
          <span>Drag corners to resize • Hold Shift for proportional scaling • Double-click to auto-fit card ratio</span>
        </div>
      </div>
    </div>
  );
};

export default EditorContent;
