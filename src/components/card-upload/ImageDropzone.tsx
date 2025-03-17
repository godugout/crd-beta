
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ 
  onFileSelected,
  isUploading,
  inputRef 
}) => {
  const [dragActive, setDragActive] = useState(false);

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
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
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
  );
};

export default ImageDropzone;
