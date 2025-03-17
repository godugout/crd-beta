
import React from 'react';
import { RotateCw } from 'lucide-react';

interface ImageRotateButtonProps {
  onRotate: () => void;
}

const ImageRotateButton: React.FC<ImageRotateButtonProps> = ({ onRotate }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
      <button
        onClick={onRotate}
        className="p-2 hover:bg-gray-100 rounded-md" 
        title="Rotate image"
      >
        <RotateCw className="h-5 w-5 text-cardshow-slate" />
      </button>
    </div>
  );
};

export default ImageRotateButton;
