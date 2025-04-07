
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, RotateCcw } from 'lucide-react';
import { RotationControlsProps } from './types';

const RotationControls: React.FC<RotationControlsProps> = ({
  onRotateClockwise,
  onRotateCounterClockwise,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      {onRotateCounterClockwise && (
        <Button
          onClick={onRotateCounterClockwise}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Rotate counter-clockwise"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
      
      {onRotateClockwise && (
        <Button
          onClick={onRotateClockwise}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Rotate clockwise"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default RotationControls;
