
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { UploadFileItem } from '../hooks/useUploadHandling';

interface ProcessingQueueProps {
  uploadedFiles: UploadFileItem[];
  onRemoveFile: (index: number) => void;
  onProcessUploads: () => void;
  isProcessing: boolean;
}

const ProcessingQueue: React.FC<ProcessingQueueProps> = ({
  uploadedFiles,
  onRemoveFile,
  onProcessUploads,
  isProcessing
}) => {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Upload Queue</h3>
      
      <div className="space-y-2">
        {uploadedFiles.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 border rounded-lg bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-100">
                <img 
                  src={item.url} 
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium text-sm truncate max-w-[200px]">
                {item.file.name}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="h-8 w-8 p-0"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onProcessUploads}
          disabled={isProcessing}
          className="flex items-center"
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-1 h-4 w-4" />
              Process All ({uploadedFiles.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProcessingQueue;
