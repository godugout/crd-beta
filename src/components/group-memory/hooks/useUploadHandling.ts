
import { useState, useRef } from 'react';
import { EnhancedCropBoxProps, MemorabiliaType } from '@/components/card-upload/cardDetection';
import { toast } from 'sonner';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

interface UseUploadHandlingProps {
  onComplete?: (cardIds: string[]) => void;
}

export const useUploadHandling = ({ onComplete }: UseUploadHandlingProps = {}) => {
  const [uploadType, setUploadType] = useState<MemorabiliaType>('face');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveMemory, isSaving } = useOfflineStorage();

  const handleFileSelected = (file: File | null) => {
    if (!file) return;
    
    // Validate file
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be under 25MB');
      return;
    }
    
    setUploadedFiles(prev => [...prev, file]);
    
    // Open editor for the first file
    if (uploadedFiles.length === 0) {
      openEditor(file);
    }
  };
  
  const openEditor = (file: File) => {
    setCurrentFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCurrentImageUrl(imageUrl);
    setShowEditor(true);
  };
  
  const processNextFile = () => {
    if (uploadedFiles.length > 0) {
      openEditor(uploadedFiles[0]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleBatchUpload = async (
    files: File[], 
    urls: string[], 
    types?: MemorabiliaType[]
  ) => {
    setIsProcessing(true);
    
    try {
      const cardIds: string[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = urls[i];
        const type = types?.[i] || uploadType;
        
        // Save to memory - this works with offline storage
        const result = await saveMemory(
          {
            title: `Group Image ${i + 1}`,
            description: `Auto-detected ${type}`,
            type: type,
            tags: [type, 'auto-detected']
          },
          file
        );
        
        if (result.success && result.id) {
          cardIds.push(result.id);
          toast.success(`Processed image ${i + 1} of ${files.length}`, {
            duration: 2000
          });
        }
      }
      
      setUploadedFiles(prev => {
        // Remove processed files
        const newFiles = [...prev];
        newFiles.splice(0, 1);
        return newFiles;
      });
      
      setShowEditor(false);
      
      // Process next file if available
      if (uploadedFiles.length > 1) {
        processNextFile();
      }
      
      // Call completion callback
      if (onComplete && cardIds.length > 0) {
        onComplete(cardIds);
      }
      
      return cardIds;
    } catch (error) {
      console.error('Error in batch upload:', error);
      toast.error('Failed to process images');
      return [];
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processUploads = async () => {
    if (uploadedFiles.length === 0) return;
    
    if (!showEditor) {
      processNextFile();
    }
  };
  
  return {
    uploadType,
    setUploadType,
    uploadedFiles,
    setUploadedFiles,
    isProcessing,
    isSaving,
    showEditor,
    setShowEditor,
    currentFile,
    currentImageUrl,
    fileInputRef,
    handleFileSelected,
    handleBatchUpload,
    handleRemoveFile,
    processUploads
  };
};
