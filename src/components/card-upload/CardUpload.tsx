import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from 'sonner';
import ImageDropzone from './ImageDropzone';
import ImageEditor from './ImageEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { ResponsiveImage } from '@/components/ui/responsive-image';

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
  const isMobile = useIsMobile();
  const { shouldOptimizeAnimations, getImageQuality } = useMobileOptimization();

  const handleCameraCapture = () => {
    if (!inputRef.current) return;
    
    inputRef.current.setAttribute('capture', 'environment');
    inputRef.current.click();
  };

  const processFile = async (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setCurrentFile(file);
    
    const localUrl = URL.createObjectURL(file);
    
    const img = new window.Image();
    img.onload = () => {
      setEditorImage(localUrl);
      setShowEditor(true);
    };
    img.src = localUrl;
  };

  const handleImageUpload = async (file: File, localUrl: string) => {
    try {
      setIsUploading(true);
      setPreviewUrl(localUrl);
      
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
      inputRef.current.removeAttribute('capture');
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!previewUrl ? (
        <div>
          <ImageDropzone 
            onFileSelected={processFile}
            isUploading={isUploading}
            inputRef={inputRef}
          />
          
          {isMobile && (
            <div className="mt-4 flex justify-center">
              <MobileTouchButton
                onClick={handleCameraCapture}
                className="flex items-center gap-2"
                size="lg"
                hapticFeedback={false}
              >
                <Camera className="h-5 w-5" />
                Take a Photo
              </MobileTouchButton>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-card">
          <ResponsiveImage 
            src={previewUrl} 
            alt="Card preview" 
            className="w-full h-full object-cover" 
          />
          <MobileTouchButton
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-subtle hover:bg-gray-100 transition-colors"
            variant="icon"
            size="sm"
            hapticFeedback={false}
          >
            <X className="h-4 w-4 text-cardshow-slate" />
          </MobileTouchButton>
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
