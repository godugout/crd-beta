
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface UploadProgressIndicatorProps {
  progress: number;
  status?: 'idle' | 'uploading' | 'failed' | 'completed';
  fileName?: string;
  fileSize?: number;
}

const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({ 
  progress,
  status = 'uploading',
  fileName,
  fileSize 
}) => {
  // Format bytes to human-readable format
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="space-y-2">
      {fileName && (
        <div className="flex justify-between text-xs">
          <span className="font-medium truncate max-w-[150px]" title={fileName}>
            {fileName}
          </span>
          {fileSize && <span className="text-muted-foreground">{formatBytes(fileSize)}</span>}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Progress 
          value={progress} 
          className="flex-1"
          // Add visual indicator for different statuses
          aria-valuetext={`${Math.round(progress)}%`}
        />
        <span className="text-xs text-gray-500 w-10 text-right tabular-nums">
          {status === 'uploading' ? (
            `${Math.round(progress)}%`
          ) : status === 'completed' ? (
            '100%'
          ) : status === 'failed' ? (
            'Failed'
          ) : (
            'Ready'
          )}
        </span>
      </div>
      
      {status === 'uploading' && progress < 100 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="text-xs text-red-500">
          Upload failed. Click to retry.
        </div>
      )}
      
      {status === 'completed' && (
        <div className="text-xs text-green-500">
          Upload complete
        </div>
      )}
    </div>
  );
};

export default UploadProgressIndicator;
