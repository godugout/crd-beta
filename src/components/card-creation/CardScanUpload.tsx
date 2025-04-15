
import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useImageProcessing from '@/hooks/useImageProcessing';

interface CardScanUploadProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CardScanUpload: React.FC<CardScanUploadProps> = ({ onImageCaptured }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fileToDataUrl, resizeImage } = useImageProcessing();
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const processFile = async (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert file to data URL
      const dataUrl = await fileToDataUrl(file);
      
      // Resize the image to a reasonable size
      const { dataUrl: resizedDataUrl } = await resizeImage(dataUrl, 1200, 1600, 0.85);
      
      setPreviewUrl(resizedDataUrl);
      onImageCaptured(resizedDataUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative">
          <div className="aspect-[2.5/3.5] w-full max-w-[300px] mx-auto rounded-lg overflow-hidden border">
            <img src={previewUrl} alt="Card preview" className="w-full h-full object-cover" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white rounded-full shadow-md"
            onClick={handleRemoveImage}
          >
            <X size={18} />
          </Button>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg flex flex-col items-center justify-center
            py-8 px-4 transition-colors cursor-pointer
            ${isDragging ? 'border-litmus-green bg-litmus-green/5' : 'border-gray-300 hover:border-gray-400'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleTriggerFileInput}
        >
          {isUploading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-t-litmus-green rounded-full animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col items-center">
                <div className="p-3 bg-litmus-green/10 rounded-full mb-3">
                  <Upload className="h-6 w-6 text-litmus-green" />
                </div>
                <p className="font-medium">Upload or drag your image</p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG or WEBP up to 10MB
                </p>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button
                  type="button" 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Upload size={16} />
                  Browse files
                </Button>
                
                <Button
                  type="button" 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Camera size={16} />
                  Take photo
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CardScanUpload;
