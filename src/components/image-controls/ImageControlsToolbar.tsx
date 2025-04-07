
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ImageControlsProps } from './types';
import RotationControls from './RotationControls';
import ZoomControls from './ZoomControls';
import CropControls from './CropControls';

const ImageControlsToolbar: React.FC<ImageControlsProps & { selectedCropIndex: number }> = ({
  onRotateClockwise,
  onRotateCounterClockwise,
  onZoomIn,
  onZoomOut,
  onReset,
  onAddCrop,
  onRemoveCrop,
  onMaximizeCrop,
  selectedCropIndex = -1,
  disabled = false
}) => {
  const showRotationControls = onRotateClockwise || onRotateCounterClockwise;
  const showZoomControls = onZoomIn || onZoomOut || onReset;
  const showCropControls = onAddCrop || onRemoveCrop || onMaximizeCrop;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex items-center space-x-2">
      {showCropControls && (
        <CropControls
          onMaximizeCrop={onMaximizeCrop}
          onAddCrop={onAddCrop}
          onRemoveCrop={onRemoveCrop}
          selectedCropIndex={selectedCropIndex}
          disabled={disabled}
        />
      )}
      
      {showCropControls && showRotationControls && <Separator orientation="vertical" className="h-6 mx-1" />}
      
      {showRotationControls && (
        <RotationControls
          onRotateClockwise={onRotateClockwise}
          onRotateCounterClockwise={onRotateCounterClockwise}
          disabled={disabled}
        />
      )}
      
      {showRotationControls && showZoomControls && <Separator orientation="vertical" className="h-6 mx-1" />}
      
      {showZoomControls && (
        <ZoomControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onReset}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ImageControlsToolbar;
