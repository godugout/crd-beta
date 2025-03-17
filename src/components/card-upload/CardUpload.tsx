
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import ImageDropzone from './ImageDropzone';
import ImageEditor from './ImageEditor';

interface CardUploadProps {
  onImageUpload: (file: File, previewUrl: string, storagePath?: string) => void;
  className?: string;
  initialImageUrl?: string;
}

const CardUpload: React.FC<CardUploadProps> = ({ onImageUpload, className, initialImageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      
      // Always show the editor for better user experience
      setEditorImage(localUrl);
      setShowEditor(true);
    };
    img.src = localUrl;
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

  return (
    <div className={cn("w-full", className)}>
      {!previewUrl ? (
        <ImageDropzone 
          onFileSelected={processFile}
          isUploading={isUploading}
          inputRef={inputRef}
        />
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

      {showEditor && (
        <ImageEditor 
          showEditor={showEditor}
          setShowEditor={setShowEditor}
          editorImage={editorImage}
          currentFile={currentFile}
          onCropComplete={handleImageUpload}
        />
      )}
    </div>
  );
};

export default CardUpload;
