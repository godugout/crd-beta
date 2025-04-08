
import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { MemorabiliaType } from '@/components/card-upload/cardDetection';

interface ProcessingQueueProps {
  uploadedFiles: Array<{ file: File; url: string; type?: MemorabiliaType }>;
  onRemoveFile: (index: number) => void;
  onProcessUploads: () => Promise<void>;
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
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Processing Queue</h3>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
          {uploadedFiles.length} item{uploadedFiles.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {uploadedFiles.map((upload, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <img 
              src={upload.url} 
              alt={`Upload ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0 p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 bg-white/80 hover:bg-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {upload.type && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {upload.type}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        onClick={onProcessUploads} 
        disabled={isProcessing} 
        className="w-full"
      >
        <UploadCloud className="h-5 w-5 mr-2" />
        {isProcessing ? 'Processing...' : 'Create Cards from Uploads'}
      </Button>
    </div>
  );
};

export default ProcessingQueue;
