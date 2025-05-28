
import React from 'react';
import AdvancedImageProcessor from './AdvancedImageProcessor';

interface ImageProcessingPanelProps {
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  className?: string;
}

const ImageProcessingPanel: React.FC<ImageProcessingPanelProps> = (props) => {
  return <AdvancedImageProcessor {...props} />;
};

export default ImageProcessingPanel;
