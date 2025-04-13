
import React, { useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CardScanUploadProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CardScanUpload: React.FC<CardScanUploadProps> = ({ onImageCaptured }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
      handleFiles(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };
  
  const handleFiles = (file: File) => {
    if (file.type.startsWith('image/')) {
      setIsLoading(true);
      
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageCaptured(e.target.result.toString());
            toast.success('Image uploaded successfully');
          }
          setIsLoading(false);
        };
        reader.onerror = () => {
          toast.error('Error reading file');
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error('Error processing image');
        setIsLoading(false);
      }
    } else {
      toast.error('Please upload an image file');
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${dragActive ? 'border-litmus-green bg-litmus-green/10' : 'border-gray-300 hover:border-litmus-green/50'}
      `}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center justify-center py-4">
        <div className="bg-litmus-green/10 p-3 rounded-full mb-4">
          <Upload className="h-8 w-8 text-litmus-green" />
        </div>
        <p className="text-sm font-medium mb-2">Drag and drop your card image here</p>
        <p className="text-xs text-gray-500 mb-4">or click to browse files</p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={openFileDialog}
            variant="outline"
            className="flex items-center"
            size="sm"
          >
            <ImageIcon className="mr-1 h-4 w-4" /> Choose File
          </Button>
          
          <Button
            onClick={() => toast.info('Camera capture coming soon')}
            variant="outline"
            className="flex items-center"
            size="sm"
          >
            <Camera className="mr-1 h-4 w-4" /> Take Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardScanUpload;
