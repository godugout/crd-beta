
import { MemorabiliaType } from '../card-upload/cardDetection';

export interface ImageControlsProps {
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onCrop?: () => void;
  onAddCrop?: () => void;
  onRemoveCrop?: () => void;
  onMaximizeCrop?: () => void;
  disabled?: boolean;
}

export interface CropControlsProps {
  onAddCrop?: () => void;
  onRemoveCrop?: () => void;
  onMaximizeCrop?: () => void;
  selectedCropIndex: number;
  disabled?: boolean;
}

export interface RotationControlsProps {
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  disabled?: boolean;
}

export interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  disabled?: boolean;
}

export interface MemorabiliaTypeControlProps {
  selectedType: MemorabiliaType;
  onChange: (type: MemorabiliaType) => void;
  enabledTypes?: MemorabiliaType[];
  disabled?: boolean;
}
