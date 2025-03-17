
import React, { useState, useRef, useEffect } from 'react';
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
import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { CropBoxProps } from './CropBox';
import { detectCardsInImage, applyCrop } from './cardDetection';
import EditorToolbar from './EditorToolbar';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import { useCropState } from './hooks/useCropState';

interface StagedCardProps {
  id: string;
  cropBox: CropBoxProps;
  previewUrl: string;
}

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
  const [stagedCards, setStagedCards] = useState<StagedCardProps[]>([]);
  
  // Use the custom hook for crop state management
  const {
    cropBoxes, 
    setCropBoxes,
    selectedCropIndex,
    setSelectedCropIndex,
    imageData,
    setImageData,
    detectedCards,
    setDetectedCards,
    imageIsLocked
  } = useCropState();

  // Initialize canvas and detect cards when image is loaded
  useEffect(() => {
    if (showEditor && editorImage && canvasRef.current && editorImgRef.current) {
      const img = editorImgRef.current;
      
      img.onload = () => {
        // Check if dimensions match standard card ratio (2.5:3.5)
        const ratio = img.width / img.height;
        const standardRatio = 2.5 / 3.5;
        const isStandardRatio = Math.abs(ratio - standardRatio) < 0.1;
        
        // Update image data
        setImageData({
          width: img.width,
          height: img.height,
          scale: 1,
          rotation: 0
        });
        
        // Clear staged cards
        setStagedCards([]);
        
        // Detect cards in the image
        const detected = detectCardsInImage(img, isStandardRatio, canvasRef.current);
        setDetectedCards(detected);
        setCropBoxes(detected.length > 0 ? [detected[0]] : [{
          x: 50,
          y: 50,
          width: 150,
          height: 210, // 3.5/2.5 ratio
          rotation: 0
        }]);
        setSelectedCropIndex(0);
      };
    }
  }, [showEditor, editorImage, setDetectedCards, setCropBoxes, setImageData, setSelectedCropIndex]);

  const stageSelectedCrop = async () => {
    const selectedBox = cropBoxes[selectedCropIndex];
    const result = await applyCrop(selectedBox, canvasRef.current, currentFile, editorImgRef.current);
    
    if (result) {
      // Add to staging area instead of completing immediately
      const newStagedCard: StagedCardProps = {
        id: `card-${Date.now()}`,
        cropBox: {...selectedBox},
        previewUrl: result.url
      };
      
      setStagedCards(prev => [...prev, newStagedCard]);
      toast.success("Card added to staging area");
    }
  };

  const selectStagedCard = (cardId: string) => {
    const stagedCard = stagedCards.find(card => card.id === cardId);
    if (stagedCard) {
      onCropComplete(new File([currentFile!], currentFile!.name), stagedCard.previewUrl);
      setShowEditor(false);
    }
  };

  const removeStagedCard = (cardId: string) => {
    setStagedCards(prev => prev.filter(card => card.id !== cardId));
  };

  const rotateImage = () => {
    setImageData(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const rotateClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: (newBoxes[selectedCropIndex].rotation + 15) % 360
      };
      setCropBoxes(newBoxes);
    }
  };

  const rotateCounterClockwise = () => {
    if (selectedCropIndex >= 0 && selectedCropIndex < cropBoxes.length) {
      const newBoxes = [...cropBoxes];
      newBoxes[selectedCropIndex] = {
        ...newBoxes[selectedCropIndex],
        rotation: (newBoxes[selectedCropIndex].rotation - 15 + 360) % 360
      };
      setCropBoxes(newBoxes);
    }
  };

  const addNewCropBox = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Create a new crop box with proper card ratio
    const newWidth = canvas.width * 0.3;
    const newHeight = newWidth * (3.5 / 2.5);
    
    const newBox: CropBoxProps = {
      x: (canvas.width - newWidth) / 2,
      y: (canvas.height - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      rotation: 0
    };
    
    const newBoxes = [...cropBoxes, newBox];
    setCropBoxes(newBoxes);
    setSelectedCropIndex(newBoxes.length - 1);
  };

  const removeCropBox = () => {
    if (cropBoxes.length <= 1) {
      toast.error("At least one crop area is required");
      return;
    }
    
    const newBoxes = cropBoxes.filter((_, i) => i !== selectedCropIndex);
    setCropBoxes(newBoxes);
    
    // Update selected index
    if (selectedCropIndex >= newBoxes.length) {
      setSelectedCropIndex(newBoxes.length - 1);
    }
  };

  const maximizeCrop = () => {
    if (!canvasRef.current || !editorImgRef.current) return;
    
    const canvas = canvasRef.current;
    const img = editorImgRef.current;
    
    // Calculate the maximum possible crop area while maintaining the 2.5:3.5 aspect ratio
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const scale = Math.min(
      canvasWidth / img.naturalWidth,
      canvasHeight / img.naturalHeight
    );
    
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    const offsetX = (canvasWidth - scaledWidth) / 2;
    const offsetY = (canvasHeight - scaledHeight) / 2;
    
    // Calculate the maximum crop area within the image bounds
    let maxWidth, maxHeight;
    const cardRatio = 2.5 / 3.5;
    
    if (scaledWidth / scaledHeight > cardRatio) {
      // The image is wider than the card ratio
      maxHeight = scaledHeight;
      maxWidth = maxHeight * cardRatio;
    } else {
      // The image is taller than the card ratio
      maxWidth = scaledWidth;
      maxHeight = maxWidth / cardRatio;
    }
    
    // Update the selected crop box
    const newBoxes = [...cropBoxes];
    const currentBox = newBoxes[selectedCropIndex];
    
    newBoxes[selectedCropIndex] = {
      x: offsetX + (scaledWidth - maxWidth) / 2,
      y: offsetY + (scaledHeight - maxHeight) / 2,
      width: maxWidth,
      height: maxHeight,
      rotation: currentBox ? currentBox.rotation : 0
    };
    
    setCropBoxes(newBoxes);
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
            <div className="relative border rounded-lg overflow-hidden bg-gray-100 h-full">
              {/* Hidden image for reference */}
              <img 
                ref={editorImgRef}
                src={editorImage || ''} 
                alt="Editor reference" 
                className="hidden"
                onLoad={() => {
                  // Force canvas redraw when image loads
                  if (canvasRef.current && editorImgRef.current) {
                    const canvas = canvasRef.current;
                    canvas.width = 600;
                    canvas.height = 600;
                  }
                }}
              />
              <EditorCanvas
                canvasRef={canvasRef}
                cropBoxes={cropBoxes}
                setCropBoxes={setCropBoxes}
                selectedCropIndex={selectedCropIndex}
                setSelectedCropIndex={setSelectedCropIndex}
                imageData={imageData}
                editorImgRef={editorImgRef}
              />
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
                <button
                  onClick={rotateImage}
                  className="p-2 hover:bg-gray-100 rounded-md" 
                  title="Rotate image"
                >
                  <RotateCw className="h-5 w-5 text-cardshow-slate" />
                </button>
              </div>
              
              <EditorToolbar 
                onMaximizeCrop={maximizeCrop}
                onAddCropBox={addNewCropBox}
                onRemoveCropBox={removeCropBox}
                onRotateClockwise={rotateClockwise}
                onRotateCounterClockwise={rotateCounterClockwise}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={25}>
            <EditorSidebar 
              cropBoxes={cropBoxes}
              selectedCropIndex={selectedCropIndex}
              setSelectedCropIndex={setSelectedCropIndex}
              onExtractCard={stageSelectedCrop}
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
