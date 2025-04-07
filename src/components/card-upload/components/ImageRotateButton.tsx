
import React from 'react';
import { RotationControls } from '@/components/image-controls';

interface ImageRotateButtonProps {
  onRotate: () => void;
}

const ImageRotateButton: React.FC<ImageRotateButtonProps> = ({ onRotate }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
      <RotationControls onRotateClockwise={onRotate} />
    </div>
  );
};

export default ImageRotateButton;
