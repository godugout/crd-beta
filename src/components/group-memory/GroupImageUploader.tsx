
import React, { useState } from 'react';
import { UploadFileItem } from './hooks/useUploadHandling';
import ProcessingQueue from './components/ProcessingQueue';
import ImageUploadArea from './components/ImageUploadArea';
import { toast } from 'sonner';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { storageOperations } from '@/lib/supabase';

// Update props for ProcessingQueue
interface GroupImageUploaderProps {
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onComplete, className }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createThumbnail } = useImageProcessing();

  const handleFileSelected = async (file: File) => {
    try {
      // Basic validation
      if (!file.type.includes('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Create thumbnail
      const dataUrl = await createThumbnail(file, 800);
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, { file, url: dataUrl }]);
      
      toast.success('Image added to processing queue');
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to process image');
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessUploads = async () => {
    if (uploadedFiles.length === 0) {
      toast.warning('No files to process');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Upload files to storage and process them
      const processedCardIds = await Promise.all(uploadedFiles.map(async (item, index) => {
        try {
          // Upload to Supabase Storage
          const uploadResult = await storageOperations.uploadImage(
            item.file, 
            'group-memories'
          );
          
          if (!uploadResult.data) {
            throw new Error('Upload failed');
          }
          
          // In a real app, you would create database entries here
          // For now, return a generated ID
          return `card-${Date.now()}-${index}`;
        } catch (err) {
          console.error('Error processing file:', err);
          throw err;
        }
      }));
      
      // Simulate processing time
      setTimeout(() => {
        // If onComplete is provided, call it with the processed card IDs
        if (onComplete) {
          onComplete(processedCardIds);
        }
        
        setUploadedFiles([]); // Clear after processing
        setIsProcessing(false);
        toast.success(`Successfully processed ${processedCardIds.length} images`);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing uploads:', error);
      toast.error('Failed to process uploads');
      setIsProcessing(false);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <ImageUploadArea onFileSelected={handleFileSelected} />
      
      <ProcessingQueue 
        queue={uploadedFiles}
        onRemoveFromQueue={handleRemoveFile}
        onClearQueue={() => setUploadedFiles([])}
        onProcessAll={handleProcessUploads}
      />
    </div>
  );
};

export default GroupImageUploader;
