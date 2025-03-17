import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X, Crop, Maximize, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
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

interface CardUploadProps {
  onImageUpload: (file: File, previewUrl: string, storagePath?: string) => void;
  className?: string;
  initialImageUrl?: string;
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CardUpload: React.FC<CardUploadProps> = ({ onImageUpload, className, initialImageUrl }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorImgRef = useRef<HTMLImageElement>(null);
  const [cropBoxes, setCropBoxes] = useState<CropBox[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageData, setImageData] = useState<{ width: number, height: number, scale: number }>({ width: 0, height: 0, scale: 1 });
  const [detectedCards, setDetectedCards] = useState<CropBox[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setCurrentFile(file);
    
    // Create a temporary URL for the image
    const localUrl = URL.createObjectURL(file);
    
    // Load the image to check dimensions and detect card content
    const img = new window.Image();
    img.onload = () => {
      // Check if dimensions match standard card ratio (2.5:3.5)
      const ratio = img.width / img.height;
      const standardRatio = 2.5 / 3.5;
      const isStandardRatio = Math.abs(ratio - standardRatio) < 0.1;
      
      // Update image data
      setImageData({
        width: img.width,
        height: img.height,
        scale: 1
      });
      
      // Always show the editor for better user experience
      setEditorImage(localUrl);
      setShowEditor(true);
      
      // Attempt to detect cards in the image
      detectCardsInImage(img, isStandardRatio);
    };
    img.src = localUrl;
  };

  const detectCardsInImage = (img: HTMLImageElement, isStandardRatio: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // If it's already a standard ratio, just use the whole image
    if (isStandardRatio) {
      const singleCard: CropBox = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
      };
      
      setDetectedCards([singleCard]);
      setCropBoxes([singleCard]);
      return;
    }
    
    // Simple heuristic to detect multiple cards
    // For demonstration, we'll check if the image is wide enough to contain multiple cards side by side
    const possibleCards: CropBox[] = [];
    
    // Check if width is roughly twice the expected width for a single card
    const isWideFormat = img.width > img.height * 1.8;
    
    if (isWideFormat) {
      // Likely contains two cards side by side
      const cardWidth = img.width / 2;
      const cardHeight = cardWidth * (3.5 / 2.5);
      
      // Left card
      possibleCards.push({
        x: 0,
        y: (img.height - cardHeight) / 2,
        width: cardWidth,
        height: cardHeight
      });
      
      // Right card
      possibleCards.push({
        x: img.width / 2,
        y: (img.height - cardHeight) / 2,
        width: cardWidth,
        height: cardHeight
      });
    } else {
      // Default to a single card with proper ratio
      const cardWidth = img.width * 0.8;
      const cardHeight = cardWidth * (3.5 / 2.5);
      
      possibleCards.push({
        x: (img.width - cardWidth) / 2,
        y: (img.height - cardHeight) / 2,
        width: cardWidth,
        height: cardHeight
      });
    }
    
    setDetectedCards(possibleCards);
    setCropBoxes(possibleCards);
    setSelectedCropIndex(0);
  };

  const handleImageUpload = async (file: File, localUrl: string) => {
    try {
      setIsUploading(true);
      setPreviewUrl(localUrl);
      
      // Pass the file and local URL to the parent component
      onImageUpload(file, localUrl);
      toast.success('Image processed successfully');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Failed to process image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

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
        
        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Draw all crop boxes
        cropBoxes.forEach((box, index) => {
          const isSelected = index === selectedCropIndex;
          
          // Draw crop box
          ctx.strokeStyle = isSelected ? '#2563eb' : 'rgba(37, 99, 235, 0.5)';
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
          
          // Draw selection indicator
          if (isSelected) {
            // Draw corner resize handles
            const handleSize = 8;
            
            // Draw handles
            ctx.fillStyle = '#2563eb';
            // Top-left
            ctx.fillRect(box.x - handleSize/2, box.y - handleSize/2, handleSize, handleSize);
            // Top-right
            ctx.fillRect(box.x + box.width - handleSize/2, box.y - handleSize/2, handleSize, handleSize);
            // Bottom-left
            ctx.fillRect(box.x - handleSize/2, box.y + box.height - handleSize/2, handleSize, handleSize);
            // Bottom-right
            ctx.fillRect(box.x + box.width - handleSize/2, box.y + box.height - handleSize/2, handleSize, handleSize);
            
            // Draw a transparent overlay for selected crop
            ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
            ctx.fillRect(box.x, box.y, box.width, box.height);
          }
        });
      }
    }
  }, [showEditor, editorImage, cropBoxes, selectedCropIndex]);

  const getResizeHandle = (e: React.MouseEvent<HTMLCanvasElement>, box: CropBox): string | null => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const handleSize = 8;
    
    // Check if cursor is on any of the resize handles
    // Top-left
    if (Math.abs(x - box.x) <= handleSize && Math.abs(y - box.y) <= handleSize) return 'tl';
    // Top-right
    if (Math.abs(x - (box.x + box.width)) <= handleSize && Math.abs(y - box.y) <= handleSize) return 'tr';
    // Bottom-left
    if (Math.abs(x - box.x) <= handleSize && Math.abs(y - (box.y + box.height)) <= handleSize) return 'bl';
    // Bottom-right
    if (Math.abs(x - (box.x + box.width)) <= handleSize && Math.abs(y - (box.y + box.height)) <= handleSize) return 'br';
    
    return null;
  };

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
    
    // If clicked outside all boxes and there's an image loaded
    if (editorImage) {
      // Create a new crop box with proper card ratio
      const newWidth = 150;
      const newHeight = newWidth * (3.5 / 2.5);
      
      const newBox: CropBox = {
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
    if (!isDragging && !isResizing) {
      let cursorStyle = 'default';
      
      // If over an existing box
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
    
    if (isResizing) {
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
  };

  const addNewCropBox = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Create a new crop box with proper card ratio
    const newWidth = canvas.width * 0.3;
    const newHeight = newWidth * (3.5 / 2.5);
    
    const newBox: CropBox = {
      x: (canvas.width - newWidth) / 2,
      y: (canvas.height - newHeight) / 2,
      width: newWidth,
      height: newHeight
    };
    
    const newBoxes = [...cropBoxes, newBox];
    setCropBoxes(newBoxes);
    setSelectedCropIndex(newBoxes.length - 1);
  };

  const removeCropBox = (index: number) => {
    if (cropBoxes.length <= 1) {
      toast.error("At least one crop area is required");
      return;
    }
    
    const newBoxes = cropBoxes.filter((_, i) => i !== index);
    setCropBoxes(newBoxes);
    
    // Update selected index
    if (selectedCropIndex >= newBoxes.length) {
      setSelectedCropIndex(newBoxes.length - 1);
    }
  };

  const applyCrop = (box: CropBox) => {
    if (!canvasRef.current || !currentFile || !editorImgRef.current) return null;
    
    const canvas = canvasRef.current;
    const img = editorImgRef.current;
    
    // Create a temporary canvas for the cropped image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return null;
    
    // Set dimensions for the cropped image
    tempCanvas.width = box.width;
    tempCanvas.height = box.height;
    
    // Calculate the source coordinates in the original image
    // We need to account for the scaling and positioning in the canvas
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
    
    // Calculate source coordinates (in the original image)
    const sourceX = (box.x - offsetX) / scale;
    const sourceY = (box.y - offsetY) / scale;
    const sourceWidth = box.width / scale;
    const sourceHeight = box.height / scale;
    
    // Draw the cropped portion
    tempCtx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, tempCanvas.width, tempCanvas.height
    );
    
    // Create a blob from the temp canvas
    return new Promise<{file: File, url: string}>((resolve) => {
      tempCanvas.toBlob((blob) => {
        if (blob && currentFile) {
          // Create a new file with the cropped image
          const croppedFile = new File(
            [blob], 
            currentFile.name, 
            { type: currentFile.type }
          );
          
          // Return the cropped file and URL
          resolve({
            file: croppedFile,
            url: URL.createObjectURL(blob)
          });
        }
      }, currentFile.type);
    });
  };

  const applySelectedCrop = async () => {
    const selectedBox = cropBoxes[selectedCropIndex];
    const result = await applyCrop(selectedBox);
    
    if (result) {
      handleImageUpload(result.file, result.url);
      setShowEditor(false);
      setEditorImage(null);
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
    newBoxes[selectedCropIndex] = {
      x: offsetX + (scaledWidth - maxWidth) / 2,
      y: offsetY + (scaledHeight - maxHeight) / 2,
      width: maxWidth,
      height: maxHeight
    };
    
    setCropBoxes(newBoxes);
  };

  return (
    <div className={cn("w-full", className)}>
      {!previewUrl ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center w-full aspect-[2.5/3.5] border-2 border-dashed rounded-xl transition-colors",
            dragActive ? "border-cardshow-blue bg-cardshow-blue-light" : "border-gray-300 hover:border-cardshow-blue hover:bg-cardshow-blue-light/50",
            isUploading && "opacity-70 pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            id="card-upload"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleChange}
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 p-4 bg-white rounded-full shadow-subtle">
              {isUploading ? (
                <div className="h-8 w-8 text-cardshow-blue animate-spin">
                  <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <Upload className="h-8 w-8 text-cardshow-blue" />
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-cardshow-dark">
              {isUploading ? 'Processing...' : 'Upload your card'}
            </h3>
            <p className="mb-4 text-sm text-cardshow-slate">
              {isUploading ? 'Please wait while we process your image' : 'Drag and drop an image, or click to browse'}
            </p>
            <p className="text-xs text-cardshow-slate-light">
              JPG, PNG, GIF (Max 5MB) - Ideal ratio 2.5:3.5
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-card">
          <img 
            src={previewUrl} 
            alt="Card preview" 
            className="w-full h-full object-cover" 
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-subtle hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X className="h-4 w-4 text-cardshow-slate" />
          </button>
        </div>
      )}

      {/* Advanced Image Editor Dialog */}
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
                
                {/* Editor Toolbar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex items-center space-x-2">
                  <button
                    onClick={maximizeCrop}
                    className="p-2 hover:bg-gray-100 rounded-md" 
                    title="Maximize crop area"
                  >
                    <Maximize className="h-5 w-5 text-cardshow-slate" />
                  </button>
                  <button
                    onClick={addNewCropBox}
                    className="p-2 hover:bg-gray-100 rounded-md"
                    title="Add new crop area"
                  >
                    <Plus className="h-5 w-5 text-cardshow-slate" />
                  </button>
                  <button
                    onClick={() => removeCropBox(selectedCropIndex)}
                    className="p-2 hover:bg-gray-100 rounded-md" 
                    title="Remove selected crop area"
                  >
                    <X className="h-5 w-5 text-cardshow-slate" />
                  </button>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={25}>
              <div className="h-full flex flex-col p-4">
                <h3 className="font-medium mb-4">Detected Cards</h3>
                
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                    {cropBoxes.map((box, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "border rounded-lg overflow-hidden cursor-pointer",
                          selectedCropIndex === index ? "ring-2 ring-cardshow-blue" : ""
                        )}
                        onClick={() => setSelectedCropIndex(index)}
                      >
                        <div className="aspect-[2.5/3.5] relative">
                          {editorImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-cardshow-slate-light">
                                Card {index + 1}
                              </span>
                            </div>
                          )}
                          
                          <div className="absolute right-2 top-2">
                            {selectedCropIndex === index && (
                              <div className="bg-cardshow-blue text-white rounded-full p-1">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-cardshow-slate mb-4">
                    Select a card crop area and click "Extract Card" to use it for your digital card.
                  </p>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applySelectedCrop}
                      className="px-4 py-2 bg-cardshow-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    >
                      <Crop className="h-4 w-4" />
                      Extract Card
                    </button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardUpload;
