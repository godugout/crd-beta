
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

interface FileUploadAreaProps {
  onBrowseClick: () => void;
  onCameraClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  selectedFilesCount: number;
  maxFiles: number;
  disabled?: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onBrowseClick,
  onCameraClick,
  handleDragOver,
  handleDrop,
  selectedFilesCount,
  maxFiles,
  disabled = false
}) => {
  return (
    <div
      className="border-2 border-dashed rounded p-6 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="mb-2">
        {selectedFilesCount > 0
          ? `Add more files (${selectedFilesCount}/${maxFiles})`
          : 'Drag & drop or click to select multiple files'}
      </p>
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={onBrowseClick} disabled={disabled}>
          <Upload size={16} /> Browse
        </Button>
        <Button variant="outline" onClick={onCameraClick} disabled={disabled}>
          <Camera size={16} /> Camera
        </Button>
      </div>
    </div>
  );
};

export default FileUploadArea;
