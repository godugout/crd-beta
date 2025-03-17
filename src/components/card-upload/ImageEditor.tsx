
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
import { CropBoxProps, getResizeHandle, drawCropBox } from './CropBox';
import { detectCardsInImage, applyCrop } from './cardDetection';
import EditorToolbar from './EditorToolbar';
import EditorSidebar from './EditorSidebar';
import { toast } from 'sonner';
import { RotateCw } from 'lucide-react';

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
  const [cropBoxes, setCropBoxes] = useState<CropBoxProps[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageData, setImageData] = useState<{ 
    width: number, 
    height: number, 
    scale: number,
    rotation: number 
  }>({ width: 0, height: 0, scale: 1, rotation: 0 });
  const [detectedCards, setDetectedCards] = useState<CropBoxProps[]>([]);
  const [stagedCards, setStagedCards] = useState<StagedCardProps[]>([]);
  
  // Lock the main image by default
  const [imageIsLocked, setImageIsLocked] = useState(true);

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
          height: 210 // 3.5/2.5 ratio
        }]);
        setSelectedCropIndex(0);
      };
    }
  }, [showEditor, editorImage]);

  // Draw the editor with crop boxes
  useEffect(() => {
    if (showEditor && editorImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        const img = editorImgRef.current;
        
        // Calculate scaling to fit image in canvas
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const scale = Math.min(
          canvasWidth / img.naturalWidth,
          canvasHeight / img.naturalHeight
        );
        
        // Update image data with current scale
        setImageData(prev => ({
          ...prev,
          scale: scale
        }));
        
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw background
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Save context for image rotation
        ctx.save();
        
        // Center rotation
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(imageData.rotation * Math.PI / 180);
        
        // Draw image (centered)
        ctx.drawImage(
          img, 
          -scaledWidth / 2, 
          -scaledHeight / 2, 
          scaledWidth, 
          scaledHeight
        );
        
        // Restore context to draw crop boxes without rotation
        ctx.restore();
        
        // Draw all crop boxes
        cropBoxes.forEach((box, index) => {
          drawCropBox(ctx, box, index === selectedCropIndex);
        });
      }
    }
  }, [showEditor, editorImage, cropBoxes, selectedCropIndex, imageData.rotation]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on a selected box's resize handle
    const selectedBox = cropBoxes[selectedCropIndex];
    const resizeHandle = getResizeHandle(e, selectedBox);
    
    if (resizeHandle) {
      setIsResizing(resizeHandle);
      setDragStart({ x, y });
      return;
    }
    
    // Check if clicking for rotation (near top-center of selected crop box)
    if (selectedBox) {
      const rotateHandleX = selectedBox.x + selectedBox.width / 2;
      const rotateHandleY = selectedBox.y - 20;
      const rotateHandleRadius = 12;
      
      if (
        Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius
      ) {
        setIsRotating(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // Check if clicking inside an existing crop box
    for (let i = 0; i < cropBoxes.length; i++) {
      const box = cropBoxes[i];
      
      if (
        x >= box.x && 
        x <= box.x + box.width && 
        y >= box.y && 
        y <= box.y + box.height
      ) {
        // Select this box
        setSelectedCropIndex(i);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // If clicked outside all boxes and there's an image loaded, create a new crop box
    if (editorImage) {
      // Create a new crop box with proper card ratio
      const newWidth = 150;
      const newHeight = newWidth * (3.5 / 2.5);
      
      const newBox: CropBoxProps = {
        x: x - newWidth / 2,
        y: y - newHeight / 2,
        width: newWidth,
        height: newHeight
      };
      
      const newBoxes = [...cropBoxes, newBox];
      setCropBoxes(newBoxes);
      setSelectedCropIndex(newBoxes.length - 1);
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update cursor style based on position
    if (!isDragging && !isResizing && !isRotating) {
      let cursorStyle = 'default';
      
      // Check for rotation handle
      const selectedBox = cropBoxes[selectedCropIndex];
      if (selectedBox) {
        const rotateHandleX = selectedBox.x + selectedBox.width / 2;
        const rotateHandleY = selectedBox.y - 20;
        const rotateHandleRadius = 12;
        
        if (
          Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= rotateHandleRadius
        ) {
          cursorStyle = 'grab';
        }
      }
      
      // If over an existing box or resize handle
      cropBoxes.forEach((box) => {
        const resizeHandle = getResizeHandle(e, box);
        if (resizeHandle) {
          switch (resizeHandle) {
            case 'tl':
            case 'br':
              cursorStyle = 'nwse-resize';
              break;
            case 'tr':
            case 'bl':
              cursorStyle = 'nesw-resize';
              break;
          }
        } else if (
          x >= box.x && 
          x <= box.x + box.width && 
          y >= box.y && 
          y <= box.y + box.height
        ) {
          cursorStyle = 'move';
        }
      });
      
      canvas.style.cursor = cursorStyle;
    }
    
    if (isRotating) {
      const selectedBox = cropBoxes[selectedCropIndex];
      const boxCenterX = selectedBox.x + selectedBox.width / 2;
      const boxCenterY = selectedBox.y + selectedBox.height / 2;
      
      // Calculate angle based on mouse position relative to box center
      const startAngle = Math.atan2(dragStart.y - boxCenterY, dragStart.x - boxCenterX);
      const currentAngle = Math.atan2(y - boxCenterY, x - boxCenterX);
      
      // Convert from radians to degrees
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      
      // Rotate the cropbox (not implemented yet, would need to add rotation property to CropBoxProps)
      // For now, just update the dragStart
      setDragStart({ x, y });
      
    } else if (isResizing) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      const newBoxes = [...cropBoxes];
      const box = { ...newBoxes[selectedCropIndex] };
      
      // Lock aspect ratio to 2.5:3.5
      const aspectRatio = 2.5 / 3.5;
      
      switch (isResizing) {
        case 'tl': // Top-left
          const newWidthTL = box.width - deltaX;
          const newHeightTL = newWidthTL / aspectRatio;
          
          box.x = box.x + box.width - newWidthTL;
          box.y = box.y + box.height - newHeightTL;
          box.width = newWidthTL;
          box.height = newHeightTL;
          break;
        
        case 'tr': // Top-right
          const newWidthTR = box.width + deltaX;
          const newHeightTR = newWidthTR / aspectRatio;
          
          box.y = box.y + box.height - newHeightTR;
          box.width = newWidthTR;
          box.height = newHeightTR;
          break;
        
        case 'bl': // Bottom-left
          const newWidthBL = box.width - deltaX;
          const newHeightBL = newWidthBL / aspectRatio;
          
          box.x = box.x + box.width - newWidthBL;
          box.width = newWidthBL;
          box.height = newHeightBL;
          break;
        
        case 'br': // Bottom-right
          const newWidthBR = box.width + deltaX;
          const newHeightBR = newWidthBR / aspectRatio;
          
          box.width = newWidthBR;
          box.height = newHeightBR;
          break;
      }
      
      // Enforce minimum size
      const minSize = 100;
      if (box.width < minSize) {
        const scale = minSize / box.width;
        box.width = minSize;
        box.height *= scale;
      }
      
      newBoxes[selectedCropIndex] = box;
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
      
    } else if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newBoxes = [...cropBoxes];
      const box = newBoxes[selectedCropIndex];
      
      // Update crop box position, keeping it within canvas bounds
      box.x = Math.max(0, Math.min(canvas.width - box.width, box.x + deltaX));
      box.y = Math.max(0, Math.min(canvas.height - box.height, box.y + deltaY));
      
      setCropBoxes(newBoxes);
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
    setIsRotating(false);
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
      height: newHeight
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
    newBoxes[selectedCropIndex] = {
      x: offsetX + (scaledWidth - maxWidth) / 2,
      y: offsetY + (scaledHeight - maxHeight) / 2,
      width: maxWidth,
      height: maxHeight
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
              <canvas 
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
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
