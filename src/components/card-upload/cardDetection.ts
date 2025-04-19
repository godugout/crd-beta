
// Define the type for memorabilia
export type MemorabiliaType = 'card' | 'ticket' | 'program' | 'autograph' | 'face' | 'group';

// Define the enhanced crop box properties
export interface EnhancedCropBoxProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: MemorabiliaType;
  confidence?: number;
  label?: string;
  metadata?: Record<string, any>;
  selected?: boolean;
}

// Detection function stub
export const detectCardsInImage = async (
  imageUrl: string, 
  options?: { 
    detectTypes?: MemorabiliaType[], 
    enhanceDetection?: boolean,
    confidenceThreshold?: number
  }
): Promise<EnhancedCropBoxProps[]> => {
  console.log('Detecting cards in image:', imageUrl);
  
  // Mock detection - in a real app, this would use ML/AI services
  return [
    {
      id: `detection-${Date.now()}-1`,
      x: 20,
      y: 20,
      width: 300,
      height: 420,
      type: 'card',
      confidence: 0.92,
      label: 'Trading Card'
    }
  ];
};

// Text detection function stub
export const detectText = async (
  imageUrl: string,
  region?: { x: number, y: number, width: number, height: number }
): Promise<string> => {
  console.log('Detecting text in image region:', region);
  return 'Sample Text';
};

// Apply crop function stub
export const applyCrop = async (
  imageUrl: string,
  cropArea: Pick<EnhancedCropBoxProps, 'x' | 'y' | 'width' | 'height'>
): Promise<string> => {
  console.log('Applying crop to image:', imageUrl, cropArea);
  
  // In a real implementation, this would actually crop the image
  return imageUrl;
};
