
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GroupUploadType } from '@/lib/types';
import useUploadHandling, { UploadTypeSelectorProps } from './hooks/useUploadHandling';
import { Upload, UploadCloud } from 'lucide-react';

// Upload Type Selector Component
const UploadTypeSelector: React.FC<UploadTypeSelectorProps> = ({
  uploadType,
  onChange
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={uploadType === 'single' ? 'default' : 'outline'}
        onClick={() => onChange('single')}
        className="flex-1"
      >
        Single
      </Button>
      <Button
        variant={uploadType === 'multi' ? 'default' : 'outline'}
        onClick={() => onChange('multi')}
        className="flex-1"
      >
        Multiple
      </Button>
      <Button
        variant={uploadType === 'batch' ? 'default' : 'outline'}
        onClick={() => onChange('batch')}
        className="flex-1"
      >
        Batch
      </Button>
    </div>
  );
};

export interface GroupImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({
  onImageSelect,
  onComplete,
  className
}) => {
  const [uploadType, setUploadType] = useState<GroupUploadType>('multi');
  const { handleFileUpload, isUploading } = useUploadHandling();
  
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      onImageSelect(filesArray);
      
      // Process the files
      const cardIds = handleFileUpload(filesArray);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(cardIds);
      }
    }
  };
  
  const handleTypeChange = (type: GroupUploadType) => {
    setUploadType(type);
  };

  return (
    <div className={className}>
      <UploadTypeSelector
        uploadType={uploadType}
        onChange={handleTypeChange}
      />
      
      <Card className="border-dashed border-2 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="file"
          id="fileInput"
          multiple={uploadType !== 'single'}
          accept="image/*"
          className="hidden"
          onChange={handleFilesChange}
          disabled={isUploading}
        />
        
        <label htmlFor="fileInput" className="w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center">
            {isUploading ? (
              <div className="animate-pulse">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">Uploading...</p>
              </div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  {uploadType === 'single' ? 'Upload Image' : 'Upload Images'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {uploadType === 'single' 
                    ? 'Click to select or drag and drop' 
                    : 'Click to select multiple images or drag and drop them'}
                </p>
              </>
            )}
          </div>
        </label>
      </Card>
    </div>
  );
};

export default GroupImageUploader;
