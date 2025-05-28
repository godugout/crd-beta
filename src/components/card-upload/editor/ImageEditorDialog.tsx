import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Info, Tag, User, Calendar, Shirt, Maximize2, RotateCw, Plus, Trash2, Crop, Sparkles } from 'lucide-react';
import { useCropState } from '../hooks/useCropState';
import { useEditor } from '../hooks/useEditor';
import { useCropBoxOperations } from '../hooks/useCropBoxOperations';
import { useImageHandling } from '../hooks/useImageHandling';
import { MemorabiliaType, detectText } from '../cardDetection';
import EditorContent from './EditorContent';
import CardTypeSelector from '../components/CardTypeSelector';
import { toast } from "sonner";
import { storageOperations } from '@/lib/supabase/storage';
import { Badge } from '@/components/ui/badge';
import { EnhancedCropBoxProps } from '../CropBox';

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
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);
  
  const { imageData, setImageData, cropBoxes, setCropBoxes, detectedCards, setDetectedCards } = useCropState();
  
  const { stagedCards, stageSelectedCrop, selectStagedCard } = useEditor({
    onCropComplete,
    currentFile,
    setShowEditor,
    autoEnhance,
  });
  
  const [selectedCropIndex, setSelectedCropIndex] = useState(-1);
  
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
    enabledMemorabiliaTypes: ['card']
  });
  
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
  
  useEffect(() => {
    if (showEditor && editorImage && !detectionRunning && cropBoxes.length === 0) {
      const img = editorImgRef.current;
      if (img && img.complete) {
        detectItems();
      }
    }
  }, [showEditor, editorImage, editorImgRef.current?.complete, detectionRunning, cropBoxes.length, detectItems]);
  
  const handleMemorabiliaTypeChange = (index: number, type: MemorabiliaType) => {
    if (index >= 0 && index < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[index] = {
        ...newBoxes[index],
        memorabiliaType: type
      };
      setCropBoxes(newBoxes);
      
      setExtractedMetadata(null);
      extractCardMetadata();
    }
  };
  
  const extractCardMetadata = async () => {
    if (selectedCropIndex < 0 || !editorImgRef.current) return null;
    
    setIsExtractingMetadata(true);
    
    try {
      const selectedBox = cropBoxes[selectedCropIndex];
      const img = editorImgRef.current;
      
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
      
      const textData = await detectText(tempCanvas);
      setExtractedMetadata(textData);
      return textData;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    } finally {
      setIsExtractingMetadata(false);
    }
  };
  
  useEffect(() => {
    if (selectedCropIndex >= 0 && !extractedMetadata) {
      extractCardMetadata();
    }
  }, [selectedCropIndex]);
  
  const handleExtractAndSaveCard = async () => {
    if (!currentFile || selectedCropIndex < 0) {
      toast.error("Please select an area to extract");
      return;
    }
    
    setIsExtractingSaving(true);
    
    try {
      const selectedBox = cropBoxes[selectedCropIndex];
      
      const metadata = extractedMetadata || await extractCardMetadata();
      
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
      
      const cardData = {
        title: metadata?.title || "Extracted Card",
        tags: metadata?.tags || ["baseball", "card", "extracted"],
        cardType: selectedBox.memorabiliaType || 'card',
        text: metadata?.text,
        year: metadata?.year,
        player: metadata?.player,
        team: metadata?.team,
        position: metadata?.position,
        sport: metadata?.sport,
        manufacturer: metadata?.manufacturer,
        cardNumber: metadata?.cardNumber,
        setName: metadata?.setName,
        condition: metadata?.condition
      };
      
      try {
        const saveResult = await storageOperations.saveExtractedCard(result.file, cardData);
        
        if (saveResult.error) {
          console.error("Error saving to catalog:", saveResult.error);
          toast.warning("Card extracted but couldn't be saved to catalog. Using local version.");
        } else {
          toast.success("Card extracted and saved to your catalog");
        }
      } catch (saveError) {
        console.error("Error saving to catalog:", saveError);
        toast.warning("Card extracted but couldn't be saved to catalog. Using local version.");
      }
      
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
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-[#0a0a0a] border-white/20">
        <DialogHeader className="p-6 border-b border-white/20 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
          <DialogTitle className="text-2xl font-bold text-white">Card Extractor</DialogTitle>
          <DialogDescription className="text-gray-300">
            AI-powered card detection and extraction from your images
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(95vh-8rem)] overflow-hidden">
          <div className="lg:col-span-3 h-[50vh] lg:h-full overflow-hidden flex flex-col bg-gray-900 rounded-xl border border-white/10">
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
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Crop className="w-5 h-5 text-blue-400" />
                Detection Controls
              </h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={detectItems}
                  disabled={detectionRunning}
                  className="w-full bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                >
                  {detectionRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Detecting Cards...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Auto Detect Cards
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={maximizeCrop}
                  disabled={selectedCropIndex < 0}
                  className="w-full bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fit Card Ratio
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={extractCardMetadata}
                  disabled={selectedCropIndex < 0 || isExtractingMetadata}
                  className="w-full bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30"
                >
                  {isExtractingMetadata ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Reading Text...
                    </>
                  ) : (
                    <>
                      <Tag className="h-4 w-4 mr-2" />
                      Extract Text
                    </>
                  )}
                </Button>
              </div>
              
              {selectedCropIndex >= 0 && cropBoxes[selectedCropIndex] && (
                <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-lg">
                  <p className="text-sm font-medium text-white mb-2">Detection Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${((cropBoxes[selectedCropIndex].confidence || 0) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {Math.round((cropBoxes[selectedCropIndex].confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {selectedCropIndex >= 0 && cropBoxes[selectedCropIndex] && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Card Type</h3>
                <CardTypeSelector
                  selected={cropBoxes[selectedCropIndex].memorabiliaType || 'card'}
                  onSelect={(type) => handleMemorabiliaTypeChange(selectedCropIndex, type as MemorabiliaType)}
                  types={['card', 'autograph']}
                />
              </div>
            )}
            
            {extractedMetadata && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Detected Info
                  </span>
                  <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-200">
                    {Math.round((extractedMetadata?.confidence || 0) * 100)}% accurate
                  </Badge>
                </h3>
                
                <div className="space-y-3 text-sm">
                  {extractedMetadata.title && (
                    <div className="flex items-start gap-3 p-2 bg-black/20 rounded-lg">
                      <Tag className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Title</p>
                        <p className="text-gray-300">{extractedMetadata.title}</p>
                      </div>
                    </div>
                  )}
                  
                  {extractedMetadata.player && (
                    <div className="flex items-start gap-3 p-2 bg-black/20 rounded-lg">
                      <User className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Player</p>
                        <p className="text-gray-300">
                          {extractedMetadata.player}
                          {extractedMetadata.position ? ` • ${extractedMetadata.position}` : ''}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {extractedMetadata.team && (
                    <div className="flex items-start gap-3 p-2 bg-black/20 rounded-lg">
                      <Shirt className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Team</p>
                        <p className="text-gray-300">{extractedMetadata.team}</p>
                      </div>
                    </div>
                  )}
                  
                  {extractedMetadata.year && (
                    <div className="flex items-start gap-3 p-2 bg-black/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Details</p>
                        <p className="text-gray-300">
                          {extractedMetadata.year}
                          {extractedMetadata.manufacturer ? ` ${extractedMetadata.manufacturer}` : ''}
                          {extractedMetadata.cardNumber ? ` #${extractedMetadata.cardNumber}` : ''}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {extractedMetadata.tags && extractedMetadata.tags.length > 0 && (
                    <div className="pt-2">
                      <p className="text-white font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {extractedMetadata.tags.map((tag: string, i: number) => (
                          <Badge key={i} className="bg-gray-700/50 border-gray-600 text-gray-200 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-3 text-lg" 
                onClick={handleExtractAndSaveCard}
                disabled={selectedCropIndex < 0 || isExtractingSaving}
              >
                {isExtractingSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Extracting Card...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Extract & Save Card
                  </>
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
