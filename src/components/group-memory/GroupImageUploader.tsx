import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import DropzoneArea from './DropzoneArea';
import ProgressIndicator from '../ui/ProgressIndicator';
import useImageProcessing from '@/hooks/useImageProcessing';

interface GroupImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onImageUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { fileToDataUrl } = useImageProcessing();

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await fileToDataUrl(file);
      onImageUpload(imageUrl);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
      {isUploading ? (
        <ProgressIndicator progress={uploadProgress} />
      ) : (
        <>
          <DropzoneArea onImageUpload={handleImageUpload} />
          <div className="flex items-center space-x-4 mt-4">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Button variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupImageUploader;
