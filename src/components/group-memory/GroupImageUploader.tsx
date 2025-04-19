
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DropzoneUploader from '@/components/dam/DropzoneUploader';
import CardSelector from '@/components/card-selector/CardSelector';
import { useCards } from '@/hooks/useCards';
import UploadTypeSelector from './components/UploadTypeSelector';
import { GroupUploadType, useUploadHandling } from './hooks/useUploadHandling';

interface GroupImageUploaderProps {
  onImageSelect: (urls: string[], sourceCards?: Card[]) => void;
  className?: string;
  onComplete?: (cardIds: string[]) => void; // Added for compatibility
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ 
  onImageSelect, 
  className,
  onComplete 
}) => {
  const { cards } = useCards();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const { 
    uploadType, 
    selectedFiles, 
    uploadProgress, 
    isUploading, 
    hasSelectedFiles,
    handleFileSelect, 
    handleUploadTypeChange, 
    clearSelectedFiles, 
    simulateUpload 
  } = useUploadHandling();

  const handleUploadClick = async () => {
    if (uploadType === 'selection' && selectedCards.length > 0) {
      // For card selection, use the card images
      const cardUrls = selectedCards.map(card => card.imageUrl);
      onImageSelect(cardUrls, selectedCards);
      
      // If onComplete is provided, also call it with card IDs
      if (onComplete) {
        onComplete(selectedCards.map(card => card.id));
      }
    } else if (hasSelectedFiles) {
      // For direct uploads, use the file uploader
      const urls = await simulateUpload();
      onImageSelect(urls);
      
      // If onComplete is provided, also call it with empty array since these are new files
      if (onComplete) {
        onComplete([]);
      }
    }
  };

  return (
    <div className={className}>
      <UploadTypeSelector 
        uploadType={uploadType}
        onUploadTypeChange={handleUploadTypeChange}
      />
      
      {uploadType === 'selection' ? (
        <div className="mt-6">
          <CardSelector 
            cards={cards}
            selectedCards={selectedCards}
            onSelect={(card) => {
              if (selectedCards.some(c => c.id === card.id)) {
                setSelectedCards(selectedCards.filter(c => c.id !== card.id));
              } else {
                setSelectedCards([...selectedCards, card]);
              }
            }}
            onSelectAll={() => setSelectedCards(cards)}
            onClearSelection={() => setSelectedCards([])}
            allowMultipleSelection={true}
          />
        </div>
      ) : (
        <Tabs defaultValue="upload" className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="gallery">My Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-0 mt-4">
            <DropzoneUploader
              onFilesSelected={handleFileSelect}
              maxFiles={uploadType === 'batch' ? 10 : 1}
              selectedFiles={selectedFiles}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              onCancel={clearSelectedFiles}
            />
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-4">
            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UploadCloud className="mx-auto text-gray-400 mb-4 h-12 w-12" />
              <h3 className="font-medium text-gray-700 mb-1">Your Gallery</h3>
              <p className="text-gray-500 text-sm mb-4">
                Select images from your existing gallery
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleUploadClick}
          disabled={(uploadType === 'selection' && selectedCards.length === 0) || 
                   (uploadType !== 'selection' && !hasSelectedFiles)}
        >
          {uploadType === 'selection' ? 'Use Selected Cards' : 'Upload and Process'}
        </Button>
      </div>
    </div>
  );
};

export default GroupImageUploader;
