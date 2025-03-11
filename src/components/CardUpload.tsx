
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface CardUploadProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  className?: string;
}

const CardUpload: React.FC<CardUploadProps> = ({ onImageUpload, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
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
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageUpload(file, url);
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!previewUrl ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center w-full aspect-[2.5/3.5] border-2 border-dashed rounded-xl transition-colors",
            dragActive ? "border-cardshow-blue bg-cardshow-blue-light" : "border-gray-300 hover:border-cardshow-blue hover:bg-cardshow-blue-light/50",
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
          />
          
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 p-4 bg-white rounded-full shadow-subtle">
              <Upload className="h-8 w-8 text-cardshow-blue" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-cardshow-dark">Upload your card</h3>
            <p className="mb-4 text-sm text-cardshow-slate">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-cardshow-slate-light">
              JPG, PNG, GIF (Max 5MB)
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
          >
            <X className="h-4 w-4 text-cardshow-slate" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CardUpload;
