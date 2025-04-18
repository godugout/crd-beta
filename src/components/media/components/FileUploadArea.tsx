
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
  disabled
}) => {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <p className="text-gray-700 mb-2">
          {selectedFilesCount > 0 
            ? `Add more files (${selectedFilesCount}/${maxFiles})`
            : 'Drag and drop files here, or'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={onBrowseClick}
            size="sm"
            className="flex items-center gap-1"
            disabled={disabled}
          >
            <Upload size={16} />
            Browse
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCameraClick}
            size="sm"
            className="flex items-center gap-1"
            disabled={disabled}
          >
            <Camera size={16} />
            Camera
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;
