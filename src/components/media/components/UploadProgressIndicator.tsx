
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressIndicatorProps {
  progress: number;
}

const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <div className="text-xs text-gray-500 text-right">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default UploadProgressIndicator;
