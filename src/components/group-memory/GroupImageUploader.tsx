
import React, { useState } from 'react';
import { GroupUploadType } from '@/lib/types';
import UploadTypeSelector from './components/UploadTypeSelector';
import DropzoneUploader from '@/components/ui/DropzoneUploader';
import CardSelector from '@/components/ui/CardSelector';

export interface GroupImageUploaderProps {
  onComplete?: (cardIds: string[]) => void; 
  onImageSelect?: (images: File[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ 
  onComplete = () => {}, 
  onImageSelect = () => {},
  className 
}) => {
  const [uploadType, setUploadType] = useState<GroupUploadType>(GroupUploadType.GROUP);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedCardIds, setUploadedCardIds] = useState<string[]>([]);

  const handleTypeChange = (type: GroupUploadType) => {
    setUploadType(type);
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files);
    onImageSelect(files);
  };

  const handleCardIdsUpdated = (cardIds: string[]) => {
    setUploadedCardIds(cardIds);
    if (cardIds.length > 0) {
      onComplete(cardIds);
    }
  };

  return (
    <div className={className}>
      <UploadTypeSelector 
        uploadType={uploadType} 
        onUploadTypeChange={handleTypeChange} 
      />
      
      {/* Image upload area */}
      <div className="mt-6">
        <DropzoneUploader 
          onFilesSelected={handleImagesSelected}
          accept={{
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
          }}
          maxFiles={10}
          showPreview={true}
          onUploaded={handleCardIdsUpdated}
        />
      </div>
      
      {/* Display selected cards */}
      {uploadedCardIds.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Selected cards</h3>
          <CardSelector 
            selectedCardIds={uploadedCardIds} 
            onSelectionChange={() => {}}
            readOnly={true}
          />
        </div>
      )}
    </div>
  );
};

export default GroupImageUploader;
