
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { assetService, AssetUploadOptions } from '@/lib/dam/assetService';

interface ImageUploaderProps {
  onUploadComplete?: (url: string, assetId: string) => void;
  className?: string;
  cardId?: string;
  collectionId?: string;
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  showPreview?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  className = '',
  cardId,
  collectionId,
  accept = 'image/*',
  maxSizeMB = 5,
  title = 'Upload Image',
  showPreview = true
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preloadedImage, setPreloadedImage] = useState<HTMLImageElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  // Preload the image to improve performance
  useEffect(() => {
    if (preview && showPreview) {
      const img = new Image();
      img.src = preview;
      img.onload = () => setPreloadedImage(img);
    } else {
      setPreloadedImage(null);
    }
    
    return () => {
      setPreloadedImage(null);
    };
  }, [preview, showPreview]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size
      if (selectedFile.size > maxSizeBytes) {
        toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setFile(selectedFile);
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file type
      if (!droppedFile.type.match('image.*')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size
      if (droppedFile.size > maxSizeBytes) {
        toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }
      
      setFile(droppedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const options: AssetUploadOptions = {
        title: file.name,
        cardId,
        collectionId
      };
      
      const asset = await assetService.uploadAsset(file, options);
      
      if (asset && asset.url) {
        if (onUploadComplete) {
          onUploadComplete(asset.url, asset.id);
        }
        
        // Reset state
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center">
        {!file ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-xs text-gray-500">Click to browse or drag & drop</p>
          </div>
        ) : showPreview ? (
          <div className="relative">
            <img 
              src={preview || ''} 
              alt="Preview" 
              className="max-h-64 rounded-lg" 
              loading="lazy"
              onError={() => {
                toast.error('Failed to load image preview');
                clearSelection();
              }}
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute top-1 right-1 rounded-full p-1 h-8 w-8"
              onClick={clearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-1 h-6 w-6"
              onClick={clearSelection}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {file && (
        <div className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
