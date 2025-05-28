
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Camera, Users, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';
import ImageDropzone from './ImageDropzone';
import SmartCardExtractor from './SmartCardExtractor';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { MemorabiliaType } from './cardDetection';

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
  const [showExtractor, setShowExtractor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractorImage, setExtractorImage] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
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
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setCurrentFile(file);
    
    const localUrl = URL.createObjectURL(file);
    
    // Preload the image to ensure it's loaded before we try to use it
    const img = new Image();
    img.onload = () => {
      setExtractorImage(localUrl);
      setShowExtractor(true);
    };
    img.onerror = () => {
      toast.error('Failed to load image');
    };
    img.crossOrigin = 'anonymous';
    img.src = localUrl;
  };

  const handleExtractorSave = async (file: File, url: string) => {
    try {
      setIsUploading(true);
      setPreviewUrl(url);
      
      onImageUpload(file, url);
      toast.success('Card extracted and saved successfully! 🔥');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Failed to save card: ' + err.message);
    } finally {
      setIsUploading(false);
      setShowExtractor(false);
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
        toast.success(`${files.length} cards processed successfully! 🔥`);
      } else {
        handleExtractorSave(files[0], urls[0]);
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      toast.error('Failed to process cards: ' + err.message);
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

  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
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
          
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {batchProcessingEnabled && (
              <MobileTouchButton
                onClick={toggleBatchMode}
                className="flex items-center gap-2"
                size="lg"
                variant={batchMode ? "default" : "secondary"}
                hapticFeedback={false}
              >
                <Users className="h-5 w-5" />
                {batchMode ? 'Batch Mode On' : 'Batch Processing'}
              </MobileTouchButton>
            )}
            
            {isMobile && (
              <MobileTouchButton
                onClick={handleCameraCapture}
                className="flex items-center gap-2"
                size="lg"
                hapticFeedback={false}
              >
                <Camera className="h-5 w-5" />
                Take a Photo
              </MobileTouchButton>
            )}
          </div>
        </div>
      ) : (
        <div>
          {previewUrls.length <= 1 ? (
            <div className="relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-card">
              <ResponsiveImage 
                src={previewUrl} 
                alt="Card preview" 
                className="w-full h-full object-cover" 
              />
              <MobileTouchButton
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-subtle hover:bg-gray-100 transition-colors"
                variant="outline"
                size="sm"
                hapticFeedback={false}
              >
                <X className="h-4 w-4 text-cardshow-slate" />
              </MobileTouchButton>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.slice(0, 6).map((url, index) => (
                  <div key={index} className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md">
                    <ResponsiveImage 
                      src={url}
                      alt={`Processed card ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {previewUrls.length > 6 && (
                <div className="text-center text-sm text-gray-500">
                  +{previewUrls.length - 6} more cards processed
                </div>
              )}
              <div className="flex justify-center">
                <MobileTouchButton
                  onClick={clearImage}
                  className="flex items-center gap-2"
                  variant="secondary"
                  size="sm"
                  hapticFeedback={false}
                >
                  <X className="h-4 w-4" />
                  Clear All Images
                </MobileTouchButton>
              </div>
            </div>
          )}
        </div>
      )}

      <SmartCardExtractor
        isOpen={showExtractor}
        onClose={() => setShowExtractor(false)}
        imageUrl={extractorImage || ''}
        onSave={handleExtractorSave}
      />
    </div>
  );
};

export default CardUpload;
