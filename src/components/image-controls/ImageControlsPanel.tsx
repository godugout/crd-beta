
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageControlsProps } from './types';
import RotationControls from './RotationControls';
import ZoomControls from './ZoomControls';
import CropControls from './CropControls';
import MemorabiliaTypeControl from './MemorabiliaTypeControl';
import { MemorabiliaType } from '../card-upload/cardDetection';

interface ImageControlsPanelProps extends ImageControlsProps {
  selectedCropIndex: number;
  memorabiliaType?: MemorabiliaType;
  onMemorabiliaTypeChange?: (type: MemorabiliaType) => void;
  enabledMemorabiliaTypes?: MemorabiliaType[];
  title?: string;
}

const ImageControlsPanel: React.FC<ImageControlsPanelProps> = ({
  onRotateClockwise,
  onRotateCounterClockwise,
  onZoomIn,
  onZoomOut,
  onReset,
  onAddCrop,
  onRemoveCrop,
  onMaximizeCrop,
  selectedCropIndex,
  memorabiliaType,
  onMemorabiliaTypeChange,
  enabledMemorabiliaTypes,
  disabled = false,
  title = 'Image Controls'
}) => {
  const showRotationControls = onRotateClockwise || onRotateCounterClockwise;
  const showZoomControls = onZoomIn || onZoomOut || onReset;
  const showCropControls = onAddCrop || onRemoveCrop || onMaximizeCrop;
  const showTypeControl = !!memorabiliaType && !!onMemorabiliaTypeChange;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showRotationControls && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Rotation</h4>
            <RotationControls
              onRotateClockwise={onRotateClockwise}
              onRotateCounterClockwise={onRotateCounterClockwise}
              disabled={disabled}
            />
          </div>
        )}
        
        {showRotationControls && showZoomControls && <Separator className="my-3" />}
        
        {showZoomControls && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Zoom</h4>
            <ZoomControls
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onReset={onReset}
              disabled={disabled}
            />
          </div>
        )}
        
        {(showRotationControls || showZoomControls) && showCropControls && <Separator className="my-3" />}
        
        {showCropControls && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Crop Area</h4>
            <CropControls
              onMaximizeCrop={onMaximizeCrop}
              onAddCrop={onAddCrop}
              onRemoveCrop={onRemoveCrop}
              selectedCropIndex={selectedCropIndex}
              disabled={disabled}
            />
          </div>
        )}
        
        {showTypeControl && (
          <>
            <Separator className="my-3" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Memorabilia Type</h4>
              <MemorabiliaTypeControl
                selectedType={memorabiliaType}
                onChange={onMemorabiliaTypeChange!}
                enabledTypes={enabledMemorabiliaTypes}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageControlsPanel;
