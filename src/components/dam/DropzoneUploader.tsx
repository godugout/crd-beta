
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DropzoneUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  selectedFiles: File[];
  uploadProgress?: number;
  isUploading?: boolean;
  onCancel?: () => void;
}

const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  onFilesSelected,
  maxFiles = 1,
  maxSizeMB = 10,
  acceptedFileTypes = ['image/*'],
  selectedFiles = [],
  uploadProgress = 0,
  isUploading = false,
  onCancel
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Check max files
    if (acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }
    
    // Check file sizes
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSizeBytes);
    
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the ${maxSizeMB}MB size limit.`);
      return;
    }
    
    onFilesSelected(acceptedFiles);
  }, [maxFiles, maxSizeMB, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc: Record<string, string[]>, type) => {
      acc[type] = [];
      return acc;
    }, {}),
    maxFiles,
    disabled: isUploading
  });

  return (
    <div className="w-full">
      {selectedFiles.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drop your files here, or <span className="text-blue-600">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {maxFiles > 1 ? `Up to ${maxFiles} files, ` : ''}Max {maxSizeMB}MB per file
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border">
              <FileCheck className="h-5 w-5 text-green-600 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => {
                    if (onCancel) onCancel();
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Remove file</span>
                </button>
              )}
            </div>
          ))}
          
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {!isUploading && (
            <div className="flex justify-end mt-3 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onCancel) onCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                Change Files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropzoneUploader;
