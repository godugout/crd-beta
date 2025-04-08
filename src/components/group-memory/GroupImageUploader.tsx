import React, { useState } from 'react';
import { UploadFileItem } from './hooks/useUploadHandling';
import ProcessingQueue from './components/ProcessingQueue';

// Update props for ProcessingQueue
interface GroupImageUploaderProps {
  // Add any props needed
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = () => {
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
      setUploadedFiles([]); // Clear after processing
    } catch (error) {
      console.error('Error processing uploads:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
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
