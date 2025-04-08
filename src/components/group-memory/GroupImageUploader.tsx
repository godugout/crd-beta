
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { MemorabiliaType } from '../card-upload/cardDetection';
import BatchImageEditor from './BatchImageEditor';
import UploadTypeSelector from './components/UploadTypeSelector';
import ImageUploadArea from './components/ImageUploadArea';
import ProcessingQueue from './components/ProcessingQueue';
import { useUploadHandling, UseUploadHandlingProps, GroupUploadType } from './hooks/useUploadHandling';

interface GroupImageUploaderProps {
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

const GroupImageUploader: React.FC<GroupImageUploaderProps> = ({ onComplete, className }) => {
  const {
    uploadType,
    setUploadType,
    uploadedFiles,
    isProcessing,
    showEditor,
    setShowEditor,
    currentFile,
    currentImageUrl,
    handleFileSelected,
    handleBatchUpload,
    handleRemoveFile,
    processUploads
  } = useUploadHandling({ onComplete });
  
  return (
    <div className={className}>
      <UploadTypeSelector 
        uploadType={uploadType}
        onUploadTypeChange={(value) => setUploadType(value as GroupUploadType)}
      />
      
      <Separator className="my-6" />
      
      <ImageUploadArea onFileSelected={handleFileSelected} />
      
      <ProcessingQueue 
        uploadedFiles={uploadedFiles}
        onRemoveFile={handleRemoveFile}
        onProcessUploads={processUploads}
        isProcessing={isProcessing}
      />
      
      {/* Batch Image Editor */}
      <BatchImageEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        imageUrl={currentImageUrl}
        originalFile={currentFile}
        onProcessComplete={handleBatchUpload}
        detectionType={uploadType}
      />
    </div>
  );
};

export default GroupImageUploader;
