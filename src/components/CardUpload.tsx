import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image, X, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface CardUploadProps {
  onImageUpload: (file: File, previewUrl: string, storagePath?: string) => void;
  className?: string;
  initialImageUrl?: string;
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
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    const img = new Image();
    img.onload = () => {
      // Check if dimensions match standard card ratio (2.5:3.5)
      const ratio = img.width / img.height;
      const standardRatio = 2.5 / 3.5;
      const isStandardRatio = Math.abs(ratio - standardRatio) < 0.1;
      
      if (!isStandardRatio) {
        // If not standard ratio, show the editor
        setEditorImage(localUrl);
        setShowEditor(true);
        
        // Set initial crop box to maintain card ratio
        const canvas = canvasRef.current;
        if (canvas) {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const cropWidth = canvasWidth * 0.8;
          const cropHeight = cropWidth * (3.5 / 2.5);
          
          setCropBox({
            x: (canvasWidth - cropWidth) / 2,
            y: (canvasHeight - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight
          });
        }
      } else {
        // If standard ratio, proceed with upload
        handleImageUpload(file, localUrl);
      }
    };
    img.src = localUrl;
  };

  const handleImageUpload = async (file: File, localUrl: string) => {
    try {
      setIsUploading(true);
      setPreviewUrl(localUrl);
      
      // Instead of using Supabase directly, which is failing,
      // let's use the local URL for now and pass the file to the parent
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

  // Editor functions
  useEffect(() => {
    if (showEditor && editorImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        const img = editorImgRef.current;
        
        // Draw image on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit image in canvas
        const scale = Math.min(
          canvas.width / img.naturalWidth,
          canvas.height / img.naturalHeight
        );
        
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Draw crop box
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
      }
    }
  }, [showEditor, editorImage, cropBox]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if click is inside the crop box
      if (
        x >= cropBox.x && 
        x <= cropBox.x + cropBox.width && 
        y >= cropBox.y && 
        y <= cropBox.y + cropBox.height
      ) {
        setIsDragging(true);
        setDragStart({ x, y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      // Update crop box position, keeping it within canvas bounds
      setCropBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(canvas.height - prev.height, prev.y + deltaY))
      }));
      
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyImageCrop = () => {
    if (canvasRef.current && currentFile) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && editorImgRef.current) {
        // Create a temporary canvas to hold just the cropped portion
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Set the dimensions of the temp canvas to match the crop box
          tempCanvas.width = cropBox.width;
          tempCanvas.height = cropBox.height;
          
          // Draw the cropped portion to the temp canvas
          tempCtx.drawImage(
            canvas, 
            cropBox.x, cropBox.y, cropBox.width, cropBox.height,
            0, 0, cropBox.width, cropBox.height
          );
          
          // Convert the temp canvas to a data URL
          tempCanvas.toBlob((blob) => {
            if (blob && currentFile) {
              // Create a new file with the cropped image
              const croppedFile = new File(
                [blob], 
                currentFile.name, 
                { type: currentFile.type }
              );
              
              // Use the cropped file
              const croppedUrl = URL.createObjectURL(blob);
              handleImageUpload(croppedFile, croppedUrl);
              
              // Close the editor
              setShowEditor(false);
              setEditorImage(null);
            }
          }, currentFile.type);
        }
      }
    }
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

      {/* Image Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Card Image</DialogTitle>
            <DialogDescription>
              Adjust the crop area to match a standard trading card ratio (2.5:3.5)
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4">
            <div className="relative border rounded-lg overflow-hidden bg-gray-100">
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
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      // Draw initial image
                      const img = editorImgRef.current;
                      const scale = Math.min(
                        canvas.width / img.naturalWidth,
                        canvas.height / img.naturalHeight
                      );
                      const scaledWidth = img.naturalWidth * scale;
                      const scaledHeight = img.naturalHeight * scale;
                      const x = (canvas.width - scaledWidth) / 2;
                      const y = (canvas.height - scaledHeight) / 2;
                      
                      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                      
                      // Set initial crop box
                      const cropWidth = scaledWidth * 0.8;
                      const cropHeight = cropWidth * (3.5 / 2.5);
                      
                      setCropBox({
                        x: (canvas.width - cropWidth) / 2,
                        y: (canvas.height - cropHeight) / 2,
                        width: cropWidth,
                        height: cropHeight
                      });
                    }
                  }
                }}
              />
              <canvas 
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyImageCrop}
                className="px-4 py-2 bg-cardshow-blue text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <Crop className="h-4 w-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardUpload;
