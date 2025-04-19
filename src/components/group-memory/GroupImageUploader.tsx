
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import DropzoneArea from './DropzoneArea';
import ProgressIndicator from '../ui/ProgressIndicator';
import useImageProcessing from '@/hooks/useImageProcessing';
import { useUploadHandling } from './hooks/useUploadHandling';

interface GroupImageUploaderProps {
  onImageUpload?: (imageUrl: string) => void;
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onImageUpload, onComplete, className }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { fileToDataUrl } = useImageProcessing();
  const { processUploads, handleFileSelected: handleFileUpload } = useUploadHandling({ onComplete });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await fileToDataUrl(file);
      
      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (onImageUpload) {
            onImageUpload(imageUrl);
          }
          
          // Handle the file with the useUploadHandling hook
          handleFileUpload(file);
        }
      }, 200);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg ${className}`}>
      {isUploading ? (
        <ProgressIndicator progress={uploadProgress} />
      ) : (
        <>
          <DropzoneArea onImageUpload={handleImageUpload} />
          <div className="flex items-center space-x-4 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
          
          {onComplete && (
            <Button 
              variant="default" 
              className="mt-4" 
              onClick={processUploads}
            >
              Process Uploads
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default GroupImageUploader;
