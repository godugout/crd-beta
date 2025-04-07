
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Plus, X } from 'lucide-react';
import { CropControlsProps } from './types';

const CropControls: React.FC<CropControlsProps> = ({
  onAddCrop,
  onRemoveCrop,
  onMaximizeCrop,
  selectedCropIndex = -1,
  disabled = false
}) => {
  const hasSelection = selectedCropIndex >= 0;
  
  return (
    <div className="flex items-center space-x-2">
      {onMaximizeCrop && (
        <Button
          onClick={onMaximizeCrop}
          variant="outline"
          size="icon"
          disabled={disabled || !hasSelection}
          className="h-8 w-8"
          title="Maximize crop area"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      )}
      
      {onAddCrop && (
        <Button
          onClick={onAddCrop}
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-8 w-8"
          title="Add new crop area"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      
      {onRemoveCrop && (
        <Button
          onClick={onRemoveCrop}
          variant="outline"
          size="icon"
          disabled={disabled || !hasSelection}
          className="h-8 w-8"
          title="Remove selected crop area"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CropControls;
