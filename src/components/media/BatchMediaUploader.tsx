
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMediaBatchUpload } from './hooks/useMediaBatchUpload';
import { useMediaFileSelection } from './hooks/useMediaFileSelection';
import FileUploadArea from './components/FileUploadArea';
import FilePreviewGrid from './components/FilePreviewGrid';
import UploadProgressIndicator from './components/UploadProgressIndicator';

interface BatchMediaUploaderProps {
  memoryId: string;
  userId: string;
  onUploadComplete: (uploadedItems: any[]) => void;
  isPrivate?: boolean;
  detectFaces?: boolean;
  maxFiles?: number;
  onError?: (err: Error) => void;
}

export const BatchMediaUploader: React.FC<BatchMediaUploaderProps> = ({
  memoryId,
  userId,
  onUploadComplete,
  isPrivate = false,
  detectFaces = false,
  maxFiles = 10,
  onError
}) => {
  const {
    selectedFiles,
    previews,
    fileRef,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleRemoveFile,
    clearFiles
  } = useMediaFileSelection(maxFiles);

  const {
    uploading,
    uploadFiles,
    getOverallProgress
  } = useMediaBatchUpload({
    memoryId,
    userId,
    isPrivate,
    detectFaces,
    onError
  });

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    try {
      const uploadedItems = await uploadFiles(selectedFiles);
      onUploadComplete(uploadedItems);
      clearFiles();
      toast.success(`Successfully uploaded ${uploadedItems.length} files`);
    } catch (error) {
      console.error('Error in batch upload:', error);
      toast.error('Failed to complete the upload process');
    }
  };

  const handleBrowseClick = () => fileRef.current?.click();
  
  const handleCameraClick = () => {
    if (fileRef.current) {
      fileRef.current.setAttribute('capture', 'environment');
      fileRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      
      <div className="space-y-4">
        {selectedFiles.length < maxFiles && (
          <FileUploadArea
            onBrowseClick={handleBrowseClick}
            onCameraClick={handleCameraClick}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            selectedFilesCount={selectedFiles.length}
            maxFiles={maxFiles}
            disabled={uploading}
          />
        )}
        
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <FilePreviewGrid
              files={selectedFiles}
              previews={previews}
              onRemoveFile={handleRemoveFile}
              disabled={uploading}
            />
            
            {uploading ? (
              <UploadProgressIndicator progress={getOverallProgress()} />
            ) : (
              <Button onClick={handleUploadAll} className="w-full">
                Upload All ({selectedFiles.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchMediaUploader;
