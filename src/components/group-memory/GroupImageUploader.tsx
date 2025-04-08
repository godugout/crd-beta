import React, { useState } from 'react';
import { UploadFileItem } from './hooks/useUploadHandling';
import ProcessingQueue from './components/ProcessingQueue';

// Update props for ProcessingQueue
interface GroupImageUploaderProps {
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onComplete, className }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessUploads = async () => {
    try {
      setIsProcessing(true);
      // Processing logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      // If onComplete is provided, call it with the processed card IDs
      if (onComplete) {
        onComplete(['sample-card-id-1', 'sample-card-id-2']); // Replace with actual IDs
      }
      
      setUploadedFiles([]); // Clear after processing
    } catch (error) {
      console.error('Error processing uploads:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Other components */}
      
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
