import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import ImageDropzone from './ImageDropzone';
import ImageEditor from './ImageEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { MemorabiliaType } from './cardDetection';
import ImagePreview from './components/ImagePreview';
import UploadActions from './components/UploadActions';
import { toast } from 'sonner';

interface CardUploadProps {
  onImageUpload: (file: File, previewUrl: string, storagePath?: string) => void;
  onBatchUpload?: (files: File[], previewUrls: string[], types?: MemorabiliaType[]) => void;
  className?: string;
  initialImageUrl?: string;
  batchProcessingEnabled?: boolean;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  autoEnhance?: boolean;
}

const CardUpload: React.FC<CardUploadProps> = ({
  onImageUpload,
  onBatchUpload,
  className,
  initialImageUrl,
  batchProcessingEnabled = false,
  enabledMemorabiliaTypes = ['card', 'ticket', 'program', 'autograph', 'face'],
  autoEnhance = true
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

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
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setCurrentFile(file);
    const localUrl = URL.createObjectURL(file);
    
    const img = new window.Image();
    img.onload = () => {
      setEditorImage(localUrl);
      setShowEditor(true);
      if (batchProcessingEnabled) {
        setBatchMode(true);
      }
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

  const handleBatchUpload = async (files: File[], urls: string[], types?: MemorabiliaType[]) => {
    try {
      setIsUploading(true);
      setPreviewUrls(urls);
      
      if (urls.length === 1) {
        setPreviewUrl(urls[0]);
      } else {
        setPreviewUrl(urls[0]);
      }
      
      if (onBatchUpload) {
        onBatchUpload(files, urls, types);
        toast.success(`${files.length} images processed successfully`);
      } else {
        handleImageUpload(files[0], urls[0]);
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      toast.error('Failed to process images: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setPreviewUrls([]);
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
          
          <UploadActions 
            batchProcessingEnabled={batchProcessingEnabled}
            batchMode={batchMode}
            toggleBatchMode={() => setBatchMode(!batchMode)}
            handleCameraCapture={handleCameraCapture}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <ImagePreview 
          previewUrl={previewUrl}
          previewUrls={previewUrls}
          onClear={clearImage}
        />
      )}

      {showEditor && (
        <ImageEditor 
          showEditor={showEditor}
          setShowEditor={setShowEditor}
          editorImage={editorImage}
          currentFile={currentFile}
          onCropComplete={handleImageUpload}
          batchProcessingMode={batchMode}
          onBatchProcessComplete={handleBatchUpload}
          enabledMemorabiliaTypes={enabledMemorabiliaTypes}
          autoEnhance={autoEnhance}
        />
      )}
    </div>
  );
};

export default CardUpload;
