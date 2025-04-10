
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressIndicatorProps {
  progress: number;
}

const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({
  progress
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Progress value={progress} />
      <div className="text-right text-xs">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default UploadProgressIndicator;
