
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { imageStorageService, ImageUploadResult } from '@/lib/services/imageStorageService';
import SmartImage from '@/components/ui/SmartImage';

interface EnhancedImageUploaderProps {
  onUploadComplete?: (result: ImageUploadResult) => void;
  onError?: (error: Error) => void;
  userId: string;
  cardId?: string;
  collectionId?: string;
  generateVariants?: boolean;
  className?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const EnhancedImageUploader: React.FC<EnhancedImageUploaderProps> = ({
  onUploadComplete,
  onError,
  userId,
  cardId,
  collectionId,
  generateVariants = true,
  className = '',
  maxSizeMB = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<ImageUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (selectedFile: File) => {
    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Unsupported file type. Please upload a valid image.');
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const result = await imageStorageService.uploadImage(file, {
        userId,
        cardId,
        collectionId,
        generateVariants
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result) {
        setUploadResult(result);
        toast.success('Image uploaded successfully!');
        onUploadComplete?.(result);
      } else {
        throw new Error('Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      const uploadError = error instanceof Error ? error : new Error('Upload failed');
      toast.error('Failed to upload image: ' + uploadError.message);
      onError?.(uploadError);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Upload Image</p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag and drop your image here, or click to browse
          </p>
          <p className="text-xs text-gray-400">
            Max size: {maxSizeMB}MB • Supported: JPEG, PNG, WebP, GIF
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden bg-gray-100">
            {preview && (
              <SmartImage
                src={preview}
                alt="Upload preview"
                className="w-full h-full"
                showLoadingState={false}
              />
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* File info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="truncate">{file.name}</span>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                {uploadProgress < 90 ? 'Uploading...' : 'Processing image variants...'}
              </p>
            </div>
          )}

          {/* Upload result */}
          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Upload Complete</span>
              </div>
              <div className="text-sm text-green-700">
                <p>Original image and {uploadResult.variants.length} variants created</p>
                <p className="text-xs mt-1">
                  Variants: {uploadResult.variants.map(v => v.variantType).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Upload button */}
          {!uploadResult && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedImageUploader;
