
import React, { useRef, useState, useEffect } from 'react';
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
  XCircle,
  ImageIcon,
  SlidersHorizontal
} from 'lucide-react';
import { useCropState } from './hooks/useCropState';
import { useEditor } from './hooks/useEditor';
import { useCropBoxOperations } from './hooks/useCropBoxOperations';
import { useImageHandling } from './hooks/useImageHandling';
import EditorSidebar from './EditorSidebar';
import EditorContent from './components/EditorContent';
import { MemorabiliaType } from './cardDetection';
import MemorabiliaTypeIndicator from './MemorabiliaTypeIndicator';
import MemorabiliaTypeSelector from './MemorabiliaTypeSelector';

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
              onRotateImage={rotateImage}
              onMaximizeCrop={maximizeCrop}
              onAddCropBox={addNewCropBox}
              onRemoveCropBox={removeCropBox}
              onRotateClockwise={rotateClockwise}
              onRotateCounterClockwise={rotateCounterClockwise}
              onMemorabiliaTypeChange={handleMemorabiliaTypeChange}
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
                  <h3 className="text-lg font-medium mb-2">Detected People ({cropBoxes.length})</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {batchSelections.length > 0 
                      ? `${batchSelections.length} people selected` 
                      : "Select specific people or process all"}
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
                        <p className="font-medium">Person {index + 1}</p>
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
                    Process {batchSelections.length > 0 ? batchSelections.length : 'All'} People
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
              <div className="h-full flex flex-col p-4">
                {selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length && (
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-lg font-medium mb-2">Selected Item</h3>

                    <div className="mb-3">
                      <label className="text-sm text-gray-700 mb-1 block">Item Type</label>
                      <MemorabiliaTypeSelector
                        value={cropBoxes[selectedCropIndex].memorabiliaType || 'unknown'}
                        onChange={(type) => handleMemorabiliaTypeChange(selectedCropIndex, type)}
                        className="w-full"
                        enabledTypes={enabledMemorabiliaTypes}
                      />
                    </div>

                    {autoEnhance && (
                      <div className="bg-blue-50 rounded-md p-2 text-xs flex items-center">
                        <SlidersHorizontal className="h-4 w-4 text-blue-500 mr-2" />
                        <span>Auto-enhancement will optimize this {cropBoxes[selectedCropIndex].memorabiliaType || 'item'}</span>
                      </div>
                    )}

                    <Button
                      className="w-full mt-3"
                      onClick={handleStageSelectedCrop}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Extract Selected Item
                    </Button>
                  </div>
                )}

                {/* Staged Cards Section */}
                <div className="mb-3">
                  <h3 className="text-md font-medium mb-2">
                    Extracted Items ({stagedCards.length})
                  </h3>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  {stagedCards.length === 0 ? (
                    <div className="text-center p-6 text-gray-400 border-2 border-dashed rounded-md">
                      <p className="text-sm">
                        No items extracted yet. Select and extract items to preview them here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stagedCards.map((card) => (
                        <div key={card.id} className="relative bg-gray-50 border rounded-md overflow-hidden">
                          <img 
                            src={card.previewUrl} 
                            alt="Staged card" 
                            className="w-full h-36 object-contain"
                          />
                          
                          {card.cropBox.memorabiliaType && (
                            <div className="absolute top-1 left-1">
                              <MemorabiliaTypeIndicator 
                                type={card.cropBox.memorabiliaType} 
                                confidence={card.cropBox.confidence || 0.7}
                              />
                            </div>
                          )}
                          
                          <div className="absolute top-1 right-1">
                            <button 
                              onClick={() => removeStagedCard(card.id)}
                              className="p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <XCircle className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                          
                          <div className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={() => selectStagedCard(card.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Create Card
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex-none pt-4 border-t mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowEditor(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
