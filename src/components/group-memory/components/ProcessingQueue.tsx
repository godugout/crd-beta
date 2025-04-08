
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Play } from 'lucide-react';
import { UploadFileItem } from '../hooks/useUploadHandling';

interface ProcessingQueueProps {
  queue: UploadFileItem[];
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  onProcessAll: () => void;
  isProcessing: boolean;
}

const ProcessingQueue: React.FC<ProcessingQueueProps> = ({
  queue,
  onRemoveFromQueue,
  onClearQueue,
  onProcessAll,
  isProcessing
}) => {
  if (queue.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Processing Queue</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearQueue}
            disabled={isProcessing || queue.length === 0}
          >
            Clear All
          </Button>
          <Button 
            size="sm" 
            onClick={onProcessAll}
            disabled={isProcessing || queue.length === 0}
            className="flex items-center gap-1"
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Process {queue.length} {queue.length === 1 ? 'Image' : 'Images'}</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {queue.map((item, index) => (
            <div 
              key={index} 
              className="relative group border rounded-md overflow-hidden"
            >
              <div className="aspect-square">
                <img 
                  src={item.url} 
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemoveFromQueue(index)}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-white text-xs truncate">
                {item.file.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingQueue;
