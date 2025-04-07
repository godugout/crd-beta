
import React from 'react';
import { ImageControlsToolbar } from '@/components/image-controls';

interface EditorToolbarProps {
  onMaximizeCrop: () => void;
  onAddCropBox: () => void;
  onRemoveCropBox: () => void;
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  selectedCropIndex?: number;
  batchMode?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onMaximizeCrop,
  onAddCropBox,
  onRemoveCropBox,
  onRotateClockwise,
  onRotateCounterClockwise,
  onZoomIn,
  onZoomOut,
  selectedCropIndex = -1,
  batchMode = false
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <ImageControlsToolbar
        onMaximizeCrop={onMaximizeCrop}
        onAddCrop={onAddCropBox}
        onRemoveCrop={onRemoveCropBox}
        onRotateClockwise={onRotateClockwise}
        onRotateCounterClockwise={onRotateCounterClockwise}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        selectedCropIndex={selectedCropIndex}
      />
    </div>
  );
};

export default EditorToolbar;
