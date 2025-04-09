
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Info } from "lucide-react";
import { useCropState } from '../hooks/useCropState';
import { useEditor } from '../hooks/useEditor';
import { useCropBoxOperations } from '../hooks/useCropBoxOperations';
import { useImageHandling } from '../hooks/useImageHandling';
import { MemorabiliaType } from '../cardDetection';
import EditorContent from '../components/EditorContent';
import CardTypeSelector from '../components/CardTypeSelector';
import { toast } from "sonner";
import { storageOperations } from '@/lib/supabase/storage';

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
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face'],
  autoEnhance = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  
  const [currentTab, setCurrentTab] = useState('crop');
  const [isExtractingSaving, setIsExtractingSaving] = useState(false);
  
  // Card selection state
  const { imageData, setImageData, cropBoxes, setCropBoxes, detectedCards, setDetectedCards } = useCropState();
  
  // Card extraction and staging
  const { stagedCards, stageSelectedCrop, selectStagedCard } = useEditor({
    onCropComplete,
    currentFile,
    setShowEditor,
    autoEnhance,
  });
  
  // Selection state
  const [selectedCropIndex, setSelectedCropIndex] = useState(-1);
  
  // Crop box operations (rotate, resize, etc)
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
  
  // Image handling operations
  const { 
    rotateImage, 
    detectItems, 
    isLoading, 
    detectionRunning 
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
    enabledMemorabiliaTypes: ['card'] // Force card detection
  });
  
  // Update image data when editor image changes
  useEffect(() => {
    if (editorImage && showEditor) {
      setImageData({ url: editorImage, width: 0, height: 0 });
    }
  }, [editorImage, showEditor]);
  
  // Auto-run detection when image loads
  useEffect(() => {
    if (showEditor && editorImage && !detectionRunning && cropBoxes.length === 0) {
      const img = editorImgRef.current;
      if (img && img.complete) {
        detectItems();
      }
    }
  }, [showEditor, editorImage, editorImgRef.current?.complete]);
  
  // Handle memorabilia type change
  const handleMemorabiliaTypeChange = (index: number, type: MemorabiliaType) => {
    if (index >= 0 && index < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[index] = {
        ...newBoxes[index],
        memorabiliaType: type
      };
      setCropBoxes(newBoxes);
    }
  };
  
  // Extract and save card to catalog
  const handleExtractAndSaveCard = async () => {
    if (!currentFile || selectedCropIndex < 0) {
      toast.error("Please select an area to extract");
      return;
    }
    
    setIsExtractingSaving(true);
    
    try {
      // Extract the card
      const selectedBox = cropBoxes[selectedCropIndex];
      const result = await stageSelectedCrop(
        selectedBox, 
        canvasRef, 
        editorImgRef, 
        selectedBox.memorabiliaType, 
        false
      );
      
      if (!result) {
        toast.error("Failed to extract card");
        return;
      }
      
      // Save the extracted card to the catalog
      const saveResult = await storageOperations.saveExtractedCard(
        result.file,
        {
          title: "Extracted Card",
          tags: ["baseball", "card", "extracted"],
          cardType: selectedBox.memorabiliaType || 'card',
        }
      );
      
      if (saveResult.error) {
        toast.error("Card extracted but couldn't be saved to catalog");
      } else {
        toast.success("Card extracted and saved to your catalog");
        
        // Pass both the file and the saved URL to the callback
        onCropComplete(
          result.file, 
          result.url, 
          selectedBox.memorabiliaType
        );
        
        setShowEditor(false);
      }
    } catch (error) {
      console.error("Error extracting card:", error);
      toast.error("Failed to extract card");
    } finally {
      setIsExtractingSaving(false);
    }
  };

  return (
    <Dialog open={showEditor} onOpenChange={setShowEditor}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Card Extractor</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-h-[calc(90vh-8rem)] overflow-auto">
          <div className="md:col-span-3 h-[50vh] md:h-auto">
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
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Card Detection</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={detectItems}
                  disabled={detectionRunning}
                  className="w-full"
                >
                  {detectionRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    "Auto Detect Card"
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={maximizeCrop}
                  disabled={selectedCropIndex < 0}
                  className="w-full"
                >
                  Fit to Card Dimensions
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 flex items-start">
                  <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  Card dimensions will automatically use the standard 2.5:3.5 ratio
                </p>
              </div>
            </div>
            
            {selectedCropIndex >= 0 && cropBoxes[selectedCropIndex] && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Card Type</h3>
                <CardTypeSelector
                  selected={cropBoxes[selectedCropIndex].memorabiliaType || 'card'}
                  onSelect={(type) => handleMemorabiliaTypeChange(selectedCropIndex, type as MemorabiliaType)}
                  types={['card', 'autograph']}
                />
              </div>
            )}
            
            <div className="mt-auto">
              <Button 
                className="w-full" 
                onClick={handleExtractAndSaveCard}
                disabled={selectedCropIndex < 0 || isExtractingSaving}
              >
                {isExtractingSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  "Extract & Save Card"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditorDialog;
