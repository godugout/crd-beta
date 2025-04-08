import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, WifiOff, Image, CheckCircle2 } from 'lucide-react';
import { UploadFileItem } from '../hooks/useUploadHandling';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { OptimizedImage } from '@/components/ui/optimized-image';

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
  const { isOnline, offlineItems } = useConnectivity();
  const isMobile = useIsMobile();
  const { optimizeInteractions } = useMobileOptimization();

  if (uploadedFiles.length === 0) {
    return null;
  }

  const ButtonComponent = isMobile ? MobileTouchButton : Button;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Upload Queue</h3>
        {!isOnline && (
          <div className="flex items-center text-amber-600 text-sm gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <WifiOff className="h-3 w-3" />
            <span>Offline Mode</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {uploadedFiles.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 border rounded-lg bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 relative rounded-md overflow-hidden bg-gray-100">
                <OptimizedImage 
                  src={item.url} 
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  fadeIn={true}
                />
                
                {item.type && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[8px] text-white text-center">
                    {item.type}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm truncate max-w-[200px]">
                  {item.file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(item.file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
            
            <ButtonComponent
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="h-8 w-8 p-0"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </ButtonComponent>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {!isOnline && (
            <span className="flex items-center text-amber-600 text-xs">
              <WifiOff className="h-3 w-3 mr-1" />
              Files will upload when online
            </span>
          )}
        </div>
        
        <ButtonComponent
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
        </ButtonComponent>
      </div>
      
      {/* Offline queue indicator */}
      {!isOnline && offlineItems.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image className="h-4 w-4 mr-2 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {offlineItems.length} item(s) waiting to be synced
              </span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingQueue;
