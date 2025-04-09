
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";
import { useCropState } from '../hooks/useCropState';
import { useEditor } from '../hooks/useEditor';
import { useCropBoxOperations } from '../hooks/useCropBoxOperations';
import { useImageHandling } from '../hooks/useImageHandling';
import { MemorabiliaType, detectText } from '../cardDetection';
import EditorContent from './EditorContent';
import CardTypeSelector from '../components/CardTypeSelector';
import { toast } from "sonner";
import { storageOperations } from '@/lib/supabase/storage';

interface ImageEditorDialogProps {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  editorImage: string | null;
  currentFile: File | null;
  onCropComplete: (file: File, url: string, memorabiliaType?: MemorabiliaType, metadata?: any) => void;
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
  
  const [isExtractingSaving, setIsExtractingSaving] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState<any>(null);
  
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
      setImageData({ 
        width: 0, 
        height: 0, 
        scale: 1,
        rotation: 0,
        url: editorImage 
      });
    }
  }, [editorImage, showEditor, setImageData]);
  
  // Auto-run detection when image loads
  useEffect(() => {
    if (showEditor && editorImage && !detectionRunning && cropBoxes.length === 0) {
      const img = editorImgRef.current;
      if (img && img.complete) {
        detectItems();
      }
    }
  }, [showEditor, editorImage, editorImgRef.current?.complete, detectionRunning, cropBoxes.length, detectItems]);
  
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
  
  // Extract text from image when a crop box is selected
  const extractCardMetadata = async () => {
    if (selectedCropIndex < 0 || !editorImgRef.current) return null;
    
    try {
      const selectedBox = cropBoxes[selectedCropIndex];
      const img = editorImgRef.current;
      
      // Create a temporary canvas to extract just the cropped area
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return null;
      
      tempCanvas.width = selectedBox.width;
      tempCanvas.height = selectedBox.height;
      
      ctx.drawImage(
        img,
        selectedBox.x, selectedBox.y, selectedBox.width, selectedBox.height,
        0, 0, selectedBox.width, selectedBox.height
      );
      
      // Extract text from the cropped area
      const textData = await detectText(tempCanvas);
      return textData;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
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
      
      // Extract metadata before cropping
      const metadata = await extractCardMetadata();
      setExtractedMetadata(metadata);
      
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
      
      // Prepare the card data with extracted metadata
      const cardData = {
        title: metadata?.title || "Extracted Card",
        tags: metadata?.tags || ["baseball", "card", "extracted"],
        cardType: selectedBox.memorabiliaType || 'card',
        text: metadata?.text,
        year: metadata?.year,
        player: metadata?.player,
        team: metadata?.team,
      };
      
      try {
        // First try to save to catalog if possible
        const saveResult = await storageOperations.saveExtractedCard(result.file, cardData);
        
        if (saveResult.error) {
          console.error("Error saving to catalog:", saveResult.error);
          // Continue with extraction even if catalog save fails
          toast.warning("Card extracted but couldn't be saved to catalog. Using local version.");
        } else {
          toast.success("Card extracted and saved to your catalog");
        }
      } catch (saveError) {
        console.error("Error saving to catalog:", saveError);
        // Continue with extraction even if catalog save fails
        toast.warning("Card extracted but couldn't be saved to catalog. Using local version.");
      }
      
      // Always pass extracted data to the callback to ensure the flow continues
      onCropComplete(
        result.file, 
        result.url, 
        selectedBox.memorabiliaType,
        metadata
      );
      
      setShowEditor(false);
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
          <DialogDescription className="text-sm text-muted-foreground">
            Detect and extract trading cards from your images
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-[calc(90vh-8rem)] overflow-hidden">
          <div className="md:col-span-3 h-[50vh] md:h-full overflow-hidden flex flex-col">
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
          
          <div className="flex flex-col space-y-4 overflow-auto">
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
              
              {selectedCropIndex >= 0 && cropBoxes[selectedCropIndex] && (
                <div className="mt-4 p-2 border border-gray-200 rounded bg-white">
                  <p className="text-xs font-medium">Detection Confidence</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(cropBoxes[selectedCropIndex].confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium">
                      {Math.round((cropBoxes[selectedCropIndex].confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              )}
              
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
